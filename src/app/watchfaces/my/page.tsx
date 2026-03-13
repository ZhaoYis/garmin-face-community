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

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "审核中", variant: "outline" },
  approved: { label: "已通过", variant: "default" },
  rejected: { label: "已拒绝", variant: "destructive" },
};

const categoryLabels: Record<string, string> = {
  analog: "模拟表盘",
  digital: "数字表盘",
  hybrid: "混合表盘",
  fitness: "运动表盘",
};

export default async function MyWatchfacesPage() {
  const session = await auth();

  if (!session?.user || !hasPermission(session.user.role, PERMISSIONS.UPLOAD_WATCHFACE)) {
    redirect("/forbidden");
  }

  const myWatchfaces = await db
    .select()
    .from(watchFaces)
    .where(eq(watchFaces.userId, session.user.id))
    .orderBy(desc(watchFaces.createdAt));

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">我的作品</h1>
        <Link href="/watchfaces">
          <Button>上传新表盘</Button>
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
                <TableHead>名称</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>下载</TableHead>
                <TableHead>点赞</TableHead>
                <TableHead>上传时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myWatchfaces.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    暂无作品，
                    <Link href="/watchfaces" className="text-primary hover:underline">
                      立即上传
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                myWatchfaces.map((wf) => (
                  <TableRow key={wf.id}>
                    <TableCell className="font-medium">{wf.name}</TableCell>
                    <TableCell>{categoryLabels[wf.category] || wf.category}</TableCell>
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
