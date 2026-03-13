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

const roleLabels: Record<UserRole, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  guest: { label: "游客", variant: "outline" },
  user: { label: "普通用户", variant: "secondary" },
  creator: { label: "创作者", variant: "default" },
  admin: { label: "管理员", variant: "destructive" },
};

export default async function AdminUsersPage() {
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">用户管理</h1>

      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户名</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>注册时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    暂无用户
                  </TableCell>
                </TableRow>
              ) : (
                allUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "-"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleLabels[user.role as UserRole]?.variant || "outline"}>
                        {roleLabels[user.role as UserRole]?.label || user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>
                        {user.status === "active" ? "正常" : "禁用"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.createdAt?.toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm">暂无操作</span>
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
