import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { follows, users } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

const MOCK_USER_ID = "anonymous";

// POST /api/follows - 关注用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { followingId } = body;

    if (!followingId) {
      return NextResponse.json({ error: "缺少用户ID" }, { status: 400 });
    }

    // 不能关注自己
    if (followingId === MOCK_USER_ID) {
      return NextResponse.json({ error: "不能关注自己" }, { status: 400 });
    }

    // 检查目标用户是否存在
    const targetUser = await db.query.users.findFirst({
      where: eq(users.id, followingId),
    });

    if (!targetUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 检查是否已关注
    const existingFollow = await db.query.follows.findFirst({
      where: and(
        eq(follows.followerId, MOCK_USER_ID),
        eq(follows.followingId, followingId)
      ),
    });

    if (existingFollow) {
      return NextResponse.json({ error: "已关注" }, { status: 400 });
    }

    // 添加关注
    const [follow] = await db
      .insert(follows)
      .values({
        followerId: MOCK_USER_ID,
        followingId,
      })
      .returning();

    return NextResponse.json(follow, { status: 201 });
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// DELETE /api/follows - 取消关注
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const followingId = searchParams.get("followingId");

    if (!followingId) {
      return NextResponse.json({ error: "缺少用户ID" }, { status: 400 });
    }

    // 删除关注
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, MOCK_USER_ID),
          eq(follows.followingId, followingId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// GET /api/follows?type=followers|following&userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "following"; // followers 或 following
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "缺少用户ID" }, { status: 400 });
    }

    if (type === "followers") {
      // 获取粉丝列表
      const followersList = await db
        .select({
          id: follows.id,
          createdAt: follows.createdAt,
          follower: {
            id: users.id,
            name: users.name,
            image: users.image,
            bio: users.bio,
          },
        })
        .from(follows)
        .leftJoin(users, eq(follows.followerId, users.id))
        .where(eq(follows.followingId, userId))
        .orderBy(desc(follows.createdAt));

      return NextResponse.json(followersList);
    } else {
      // 获取关注列表
      const followingList = await db
        .select({
          id: follows.id,
          createdAt: follows.createdAt,
          following: {
            id: users.id,
            name: users.name,
            image: users.image,
            bio: users.bio,
          },
        })
        .from(follows)
        .leftJoin(users, eq(follows.followingId, users.id))
        .where(eq(follows.followerId, userId))
        .orderBy(desc(follows.createdAt));

      return NextResponse.json(followingList);
    }
  } catch (error) {
    console.error("Error fetching follows:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
