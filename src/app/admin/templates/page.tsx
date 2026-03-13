import { db } from "@/lib/db";
import { posterTemplates } from "@/lib/db/schema";
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

export default async function AdminTemplatesPage() {
  const templates = await db.select().from(posterTemplates).orderBy(desc(posterTemplates.sortOrder));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">模板管理</h1>

      <Card>
        <CardHeader>
          <CardTitle>海报模板列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>模板名称</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>价格</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>排序</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    暂无模板
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{template.key}</code>
                    </TableCell>
                    <TableCell>{template.category}</TableCell>
                    <TableCell>
                      {template.isFree ? (
                        <Badge variant="secondary">免费</Badge>
                      ) : (
                        <span>{template.price || "付费"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={template.status === "active" ? "default" : "outline"}>
                        {template.status === "active" ? "启用" : "禁用"}
                      </Badge>
                    </TableCell>
                    <TableCell>{template.sortOrder}</TableCell>
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
