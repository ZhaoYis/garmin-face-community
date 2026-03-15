import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { watchFaces, users } from "@/lib/db/schema";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { eq, desc, count } from "drizzle-orm";

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

// GET /api/watchfaces?page=1&limit=12&public=true
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const isPublic = searchParams.get("public") === "true";

    const offset = (page - 1) * limit;

    if (isPublic) {
      // 公开查询：获取已审核通过的表盘
      const watchfaces = await db
        .select({
          id: watchFaces.id,
          name: watchFaces.name,
          description: watchFaces.description,
          category: watchFaces.category,
          thumbnailUrl: watchFaces.thumbnailUrl,
          downloads: watchFaces.downloads,
          likes: watchFaces.likes,
          createdAt: watchFaces.createdAt,
          author: {
            id: users.id,
            name: users.name,
            image: users.image,
          },
        })
        .from(watchFaces)
        .leftJoin(users, eq(watchFaces.userId, users.id))
        .where(eq(watchFaces.status, "approved"))
        .orderBy(desc(watchFaces.createdAt))
        .limit(limit)
        .offset(offset);

      // 获取总数
      const [totalResult] = await db
        .select({ count: count() })
        .from(watchFaces)
        .where(eq(watchFaces.status, "approved"));

      return NextResponse.json({
        data: watchfaces,
        total: totalResult.count,
        hasMore: totalResult.count > offset + limit,
      });
    }

    // 私有查询：获取用户自己的表盘
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    const myWatchfaces = await db.query.watchFaces.findMany({
      where: eq(watchFaces.userId, session.user.id),
      orderBy: [desc(watchFaces.createdAt)],
    });

    return NextResponse.json(myWatchfaces);
  } catch (error) {
    console.error("Get watchfaces error:", error);
    return NextResponse.json({ message: "获取失败" }, { status: 500 });
  }
}
