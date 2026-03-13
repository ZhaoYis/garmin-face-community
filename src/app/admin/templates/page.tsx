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
import { getTranslations } from "next-intl/server";

export default async function AdminTemplatesPage() {
  const t = await getTranslations();
  const templates = await db.select().from(posterTemplates).orderBy(desc(posterTemplates.sortOrder));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("admin.templates")}</h1>

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
                <TableHead>{t("watchfaces.category")}</TableHead>
                <TableHead>{t("admin.price.paid")}</TableHead>
                <TableHead>{t("users.status")}</TableHead>
                <TableHead>排序</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    {t("admin.noData")}
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
                        <Badge variant="secondary">{t("admin.price.free")}</Badge>
                      ) : (
                        <span>{template.price || t("admin.price.paid")}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={template.status === "active" ? "default" : "outline"}>
                        {template.status === "active" ? t("admin.templateStatus.active") : t("admin.templateStatus.inactive")}
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
