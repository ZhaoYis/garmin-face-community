import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { db } from "@/lib/db";
import { watchFaces } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function MyWatchfacesPage() {
  const session = await auth();
  const t = await getTranslations();

  if (!session?.user || !hasPermission(session.user.role, PERMISSIONS.UPLOAD_WATCHFACE)) {
    redirect("/forbidden");
  }

  const myWatchfaces = await db
    .select()
    .from(watchFaces)
    .where(eq(watchFaces.userId, session.user.id))
    .orderBy(desc(watchFaces.createdAt));

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      rejected: "destructive",
    };
    return variants[status] || "outline";
  };

  const getStatusLabel = (status: string) => {
    const key = `watchfaces.statuses.${status}` as const;
    try {
      return t(key);
    } catch {
      return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    const key = `watchfaces.categories.${category}` as const;
    try {
      return t(key);
    } catch {
      return category;
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("watchfaces.myWorks")}</h1>
        <Link href="/watchfaces">
          <Button>{t("watchfaces.uploadNew")}</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>作品列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("watchfaces.name")}</TableHead>
                <TableHead>{t("watchfaces.category")}</TableHead>
                <TableHead>{t("users.status")}</TableHead>
                <TableHead>{t("watchfaces.downloads")}</TableHead>
                <TableHead>{t("watchfaces.likes")}</TableHead>
                <TableHead>上传时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myWatchfaces.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    {t("profile.noWorksDesc")}，
                    <Link href="/watchfaces" className="text-primary hover:underline">
                      {t("watchfaces.uploadNew")}
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                myWatchfaces.map((wf) => (
                  <TableRow key={wf.id}>
                    <TableCell className="font-medium">{wf.name}</TableCell>
                    <TableCell>{getCategoryLabel(wf.category)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(wf.status)}>
                        {getStatusLabel(wf.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{wf.downloads}</TableCell>
                    <TableCell>{wf.likes}</TableCell>
                    <TableCell>
                      {wf.createdAt?.toLocaleDateString("zh-CN")}
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
