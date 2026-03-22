import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, watchFaces } from "@/lib/db/schema";
import { randomUUID } from "crypto";

// 测试用户数据
const testUsers = [
  {
    id: randomUUID(),
    name: "设计师小王",
    email: "xiaowang@test.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=xiaowang",
    role: "creator" as const,
  },
  {
    id: randomUUID(),
    name: "表盘达人",
    email: "daren@test.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=daren",
    role: "creator" as const,
  },
  {
    id: randomUUID(),
    name: "运动爱好者",
    email: "sports@test.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sports",
    role: "user" as const,
  },
  {
    id: randomUUID(),
    name: "极简主义",
    email: "minimal@test.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=minimal",
    role: "creator" as const,
  },
];

// 测试表盘数据
const getTestWatchFaces = (userIds: string[]) => [
  {
    id: randomUUID(),
    userId: userIds[0],
    name: "极简商务",
    description: "简约风格的商务表盘，适合日常办公和正式场合佩戴。设计简洁大方，信息显示清晰易读，支持多种配色方案。",
    category: "analog",
    thumbnailUrl: "https://picsum.photos/seed/watch1/400/400",
    fileUrl: "/uploads/watchface1.garmin",
    fileSize: 2621440,
    status: "approved" as const,
    downloads: 1234,
    likes: 567,
  },
  {
    id: randomUUID(),
    userId: userIds[1],
    name: "运动数据面板",
    description: "专为运动爱好者设计的数字表盘，实时显示心率、步数、卡路里等运动数据，支持跑步、骑行等多种运动模式。",
    category: "fitness",
    thumbnailUrl: "https://picsum.photos/seed/watch2/400/400",
    fileUrl: "/uploads/watchface2.garmin",
    fileSize: 3145728,
    status: "approved" as const,
    downloads: 2345,
    likes: 890,
  },
  {
    id: randomUUID(),
    userId: userIds[2],
    name: "数字时钟",
    description: "简洁的数字时钟表盘，大字体显示时间，支持24小时制，夜间模式自动调节亮度。",
    category: "digital",
    thumbnailUrl: "https://picsum.photos/seed/watch3/400/400",
    fileUrl: "/uploads/watchface3.garmin",
    fileSize: 1572864,
    status: "approved" as const,
    downloads: 3456,
    likes: 1234,
  },
  {
    id: randomUUID(),
    userId: userIds[3],
    name: "经典指针",
    description: "经典指针表盘设计，模拟传统手表外观，优雅大气，适合各种场合佩戴。",
    category: "analog",
    thumbnailUrl: "https://picsum.photos/seed/watch4/400/400",
    fileUrl: "/uploads/watchface4.garmin",
    fileSize: 2097152,
    status: "approved" as const,
    downloads: 1567,
    likes: 456,
  },
  {
    id: randomUUID(),
    userId: userIds[0],
    name: "混合时尚",
    description: "结合模拟指针和数字显示的混合表盘，既保留传统美感又兼顾现代实用性。",
    category: "hybrid",
    thumbnailUrl: "https://picsum.photos/seed/watch5/400/400",
    fileUrl: "/uploads/watchface5.garmin",
    fileSize: 2831155,
    status: "approved" as const,
    downloads: 987,
    likes: 321,
  },
  {
    id: randomUUID(),
    userId: userIds[1],
    name: "户外探险",
    description: "专为户外探险设计的表盘，显示海拔、气压、指南针等户外信息，支持GPS轨迹记录。",
    category: "fitness",
    thumbnailUrl: "https://picsum.photos/seed/watch6/400/400",
    fileUrl: "/uploads/watchface6.garmin",
    fileSize: 3670016,
    status: "approved" as const,
    downloads: 765,
    likes: 234,
  },
  {
    id: randomUUID(),
    userId: userIds[2],
    name: "极简数字",
    description: "极简主义数字表盘，只显示最基本的时间信息，界面干净清爽，非常省电。",
    category: "digital",
    thumbnailUrl: "https://picsum.photos/seed/watch7/400/400",
    fileUrl: "/uploads/watchface7.garmin",
    fileSize: 1048576,
    status: "approved" as const,
    downloads: 4567,
    likes: 1567,
  },
  {
    id: randomUUID(),
    userId: userIds[3],
    name: "科技感",
    description: "充满科技感的表盘设计，动态效果炫酷，显示丰富的系统信息，适合科技爱好者。",
    category: "hybrid",
    thumbnailUrl: "https://picsum.photos/seed/watch8/400/400",
    fileUrl: "/uploads/watchface8.garmin",
    fileSize: 4194304,
    status: "approved" as const,
    downloads: 678,
    likes: 189,
  },
  {
    id: randomUUID(),
    userId: userIds[0],
    name: "复古经典",
    description: "复古风格的指针表盘，仿古铜色设计，带有岁月沉淀的质感，适合怀旧风格爱好者。",
    category: "analog",
    thumbnailUrl: "https://picsum.photos/seed/watch9/400/400",
    fileUrl: "/uploads/watchface9.garmin",
    fileSize: 2516582,
    status: "approved" as const,
    downloads: 543,
    likes: 167,
  },
  {
    id: randomUUID(),
    userId: userIds[1],
    name: "健身追踪",
    description: "健身追踪专用表盘，实时显示运动目标完成度，支持多种健身模式，激励你达成目标。",
    category: "fitness",
    thumbnailUrl: "https://picsum.photos/seed/watch10/400/400",
    fileUrl: "/uploads/watchface10.garmin",
    fileSize: 2936013,
    status: "approved" as const,
    downloads: 1890,
    likes: 567,
  },
  {
    id: randomUUID(),
    userId: userIds[2],
    name: "夜光数字",
    description: "夜间模式优化的数字表盘，支持自动亮度调节，清晰易读不刺眼。",
    category: "digital",
    thumbnailUrl: "https://picsum.photos/seed/watch11/400/400",
    fileUrl: "/uploads/watchface11.garmin",
    fileSize: 1835008,
    status: "approved" as const,
    downloads: 2341,
    likes: 789,
  },
  {
    id: randomUUID(),
    userId: userIds[3],
    name: "城市脉搏",
    description: "现代都市风格的混合表盘，结合天气、日程提醒等实用功能，是都市白领的理想选择。",
    category: "hybrid",
    thumbnailUrl: "https://picsum.photos/seed/watch12/400/400",
    fileUrl: "/uploads/watchface12.garmin",
    fileSize: 3355443,
    status: "approved" as const,
    downloads: 1122,
    likes: 345,
  },
];

export async function POST() {
  try {
    console.log("🌱 开始插入测试数据...");

    // 插入测试用户
    const insertedUserIds: string[] = [];
    for (const user of testUsers) {
      try {
        await db.insert(users).values(user);
        insertedUserIds.push(user.id);
      } catch {
        console.log(`用户 ${user.name} 已存在，跳过`);
      }
    }

    // 如果没有插入新用户，使用已有用户的 ID
    if (insertedUserIds.length === 0) {
      const existingUsers = await db.query.users.findMany({
        limit: 4,
      });
      if (existingUsers.length > 0) {
        existingUsers.forEach((u) => insertedUserIds.push(u.id));
      } else {
        // 如果完全没有用户，重新插入
        for (const user of testUsers) {
          await db.insert(users).values(user);
          insertedUserIds.push(user.id);
        }
      }
    }

    // 插入测试表盘
    const testWatchFaces = getTestWatchFaces(insertedUserIds);
    let insertedCount = 0;
    for (const watchface of testWatchFaces) {
      try {
        await db.insert(watchFaces).values(watchface);
        insertedCount++;
      } catch {
        console.log(`表盘 ${watchface.name} 已存在，跳过`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `测试数据插入完成！`,
      users: insertedUserIds.length,
      watchfaces: insertedCount,
    });
  } catch (error) {
    console.error("插入测试数据失败:", error);
    return NextResponse.json(
      { error: "插入测试数据失败", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "使用 POST 方法插入测试数据",
    endpoint: "/api/seed",
  });
}
