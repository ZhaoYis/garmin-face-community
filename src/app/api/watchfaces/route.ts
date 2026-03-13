import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { watchFaces } from "@/lib/db/schema";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  if (!hasPermission(session.user.role, PERMISSIONS.UPLOAD_WATCHFACE)) {
    return NextResponse.json({ message: "无权限" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const file = formData.get("file") as File;

    if (!name || !category || !file) {
      return NextResponse.json({ message: "缺少必填字段" }, { status: 400 });
    }

    // 文件验证
    const validExtensions = [".garmin", ".prg"];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));
    if (!isValid) {
      return NextResponse.json({ message: "不支持的文件格式" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: "文件大小超过限制" }, { status: 400 });
    }

    // TODO: 实际文件上传到存储服务
    // 这里暂时使用占位 URL
    const fileUrl = `/uploads/watchfaces/${Date.now()}-${file.name}`;

    // 创建表盘记录
    const [watchface] = await db
      .insert(watchFaces)
      .values({
        userId: session.user.id,
        name,
        description,
        category,
        fileUrl,
        fileSize: file.size,
        status: "pending",
      })
      .returning();

    return NextResponse.json(watchface, { status: 201 });
  } catch (error) {
    console.error("Upload watchface error:", error);
    return NextResponse.json({ message: "上传失败" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  try {
    const myWatchfaces = await db.query.watchFaces.findMany({
      where: (wf, { eq }) => eq(wf.userId, session.user.id),
      orderBy: (wf, { desc }) => [desc(wf.createdAt)],
    });

    return NextResponse.json(myWatchfaces);
  } catch (error) {
    console.error("Get watchfaces error:", error);
    return NextResponse.json({ message: "获取失败" }, { status: 500 });
  }
}
