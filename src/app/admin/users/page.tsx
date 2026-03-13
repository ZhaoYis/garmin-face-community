import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/lib/db/schema";
import { getTranslations } from "next-intl/server";

export default async function AdminUsersPage() {
  const t = await getTranslations();
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  const getRoleVariant = (role: UserRole): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
      guest: "outline",
      user: "secondary",
      creator: "default",
      admin: "destructive",
    };
    return variants[role] || "outline";
  };

  const getRoleLabel = (role: UserRole) => {
    const key = `admin.roles.${role}` as const;
    try {
      return t(key);
    } catch {
      return role;
    }
  };

  const getStatusLabel = (status: string) => {
    const key = `admin.statuses.${status}` as const;
    try {
      return t(key);
    } catch {
      return status;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("admin.users")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("users.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("users.name")}</TableHead>
                <TableHead>{t("users.email")}</TableHead>
                <TableHead>{t("users.role")}</TableHead>
                <TableHead>{t("users.status")}</TableHead>
                <TableHead>{t("users.createdAt")}</TableHead>
                <TableHead>{t("users.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    {t("admin.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                allUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "-"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleVariant(user.role as UserRole)}>
                        {getRoleLabel(user.role as UserRole)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>
                        {getStatusLabel(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.createdAt?.toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm">{t("users.noActions")}</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
