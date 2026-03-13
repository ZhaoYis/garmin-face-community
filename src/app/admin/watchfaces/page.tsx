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
import Link from "next/link";

export default async function AdminWatchfacesPage() {
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

  const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { label: "待审核", variant: "outline" },
    approved: { label: "已通过", variant: "default" },
    rejected: { label: "已拒绝", variant: "destructive" },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">表盘审核</h1>

      <Card>
        <CardHeader>
          <CardTitle>表盘作品列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>作者</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>下载</TableHead>
                <TableHead>点赞</TableHead>
                <TableHead>上传时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchfacesList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    暂无表盘作品
                  </TableCell>
                </TableRow>
              ) : (
                watchfacesList.map((wf) => (
                  <TableRow key={wf.id}>
                    <TableCell className="font-medium">{wf.name}</TableCell>
                    <TableCell>{wf.userName || wf.userEmail || "-"}</TableCell>
                    <TableCell>{wf.category}</TableCell>
                    <TableCell>
                      <Badge variant={statusLabels[wf.status]?.variant || "outline"}>
                        {statusLabels[wf.status]?.label || wf.status}
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
