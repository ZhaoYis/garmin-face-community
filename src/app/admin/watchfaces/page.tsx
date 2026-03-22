import { db } from "@/lib/db";
import { watchFaces, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
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
import { getTranslations } from "next-intl/server";

export default async function AdminWatchfacesPage() {
  const t = await getTranslations();
  const watchfacesList = await db
    .select({
      id: watchFaces.id,
      name: watchFaces.name,
      category: watchFaces.category,
      status: watchFaces.status,
      downloads: watchFaces.downloads,
      likes: watchFaces.likes,
      createdAt: watchFaces.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(watchFaces)
    .leftJoin(users, eq(watchFaces.userId, users.id))
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("admin.watchfaces")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>表盘作品列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("watchfaces.name")}</TableHead>
                <TableHead>作者</TableHead>
                <TableHead>{t("watchfaces.category")}</TableHead>
                <TableHead>{t("users.status")}</TableHead>
                <TableHead>{t("watchfaces.downloads")}</TableHead>
                <TableHead>{t("watchfaces.likes")}</TableHead>
                <TableHead>上传时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchfacesList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {t("admin.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                watchfacesList.map((wf) => (
                  <TableRow key={wf.id}>
                    <TableCell className="font-medium">{wf.name}</TableCell>
                    <TableCell>{wf.userName || wf.userEmail || "-"}</TableCell>
                    <TableCell>{wf.category}</TableCell>
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
