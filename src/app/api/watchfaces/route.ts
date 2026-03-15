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

    // 使用通用上传服务
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("type", "watchface");

    // 内部调用上传 API
    const uploadUrl = new URL("/api/upload", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.json();
      return NextResponse.json(
        { message: uploadError.error || "文件上传失败" },
        { status: uploadResponse.status }
      );
    }

    const uploadResult = await uploadResponse.json();
    const fileUrl = uploadResult.url;

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
