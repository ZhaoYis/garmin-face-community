import { db } from "@/lib/db";
import { posterTemplates } from "@/lib/db/schema";
import { POSTER_TEMPLATES } from "@/lib/poster/templates";

/**
 * 插入海报模板初始数据
 */
export async function seedPosterTemplates() {
  console.log("Seeding poster templates...");

  for (const template of POSTER_TEMPLATES) {
    try {
      await db.insert(posterTemplates).values({
        name: template.name,
        key: template.key,
        category: template.category,
        previewUrl: template.previewUrl || null,
        thumbnailUrl: template.thumbnailUrl || null,
        config: template.config,
        isFree: template.isFree,
        price: template.price || null,
        sortOrder: template.sortOrder,
        status: "active",
      }).onConflictDoNothing();

      console.log(`Inserted template: ${template.name}`);
    } catch (error) {
      console.error(`Error inserting template ${template.name}:`, error);
    }
  }

  console.log("Poster templates seeding completed!");
}

// 如果直接运行此脚本
if (require.main === module) {
  seedPosterTemplates()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
