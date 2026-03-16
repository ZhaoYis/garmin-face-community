import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { db } from "@/lib/db";
import { watchFaces, users } from "@/lib/db/schema";
import { randomUUID } from "crypto";

// 表盘风格配置
const watchFaceStyles = [
  {
    name: "极简商务",
    description: "简约风格的商务表盘，适合日常办公和正式场合佩戴。设计简洁大方，信息显示清晰易读，支持多种配色方案。",
    category: "analog",
    style: {
      background: "#1a1a2e",
      accent: "#eab308",
      secondary: "#3b82f6",
      type: "minimal-analog",
    },
    downloads: 1234,
    likes: 567,
  },
  {
    name: "运动数据面板",
    description: "专为运动爱好者设计的数字表盘，实时显示心率、步数、卡路里等运动数据，支持跑步、骑行等多种运动模式。",
    category: "fitness",
    style: {
      background: "#0f172a",
      accent: "#22c55e",
      secondary: "#f97316",
      type: "fitness-digital",
    },
    downloads: 2345,
    likes: 890,
  },
  {
    name: "数字时钟",
    description: "简洁的数字时钟表盘，大字体显示时间，支持24小时制，夜间模式自动调节亮度。",
    category: "digital",
    style: {
      background: "#020617",
      accent: "#06b6d4",
      secondary: "#8b5cf6",
      type: "digital-clock",
    },
    downloads: 3456,
    likes: 1234,
  },
  {
    name: "经典指针",
    description: "经典指针表盘设计，模拟传统手表外观，优雅大气，适合各种场合佩戴。",
    category: "analog",
    style: {
      background: "#18181b",
      accent: "#fbbf24",
      secondary: "#a1a1aa",
      type: "classic-analog",
    },
    downloads: 1567,
    likes: 456,
  },
  {
    name: "混合时尚",
    description: "结合模拟指针和数字显示的混合表盘，既保留传统美感又兼顾现代实用性。",
    category: "hybrid",
    style: {
      background: "#1e1b4b",
      accent: "#c084fc",
      secondary: "#fb923c",
      type: "hybrid-fashion",
    },
    downloads: 987,
    likes: 321,
  },
  {
    name: "户外探险",
    description: "专为户外探险设计的表盘，显示海拔、气压、指南针等户外信息，支持GPS轨迹记录。",
    category: "fitness",
    style: {
      background: "#14532d",
      accent: "#4ade80",
      secondary: "#fbbf24",
      type: "outdoor-adventure",
    },
    downloads: 765,
    likes: 234,
  },
  {
    name: "极简数字",
    description: "极简主义数字表盘，只显示最基本的时间信息，界面干净清爽，非常省电。",
    category: "digital",
    style: {
      background: "#000000",
      accent: "#ffffff",
      secondary: "#6b7280",
      type: "minimal-digital",
    },
    downloads: 4567,
    likes: 1567,
  },
  {
    name: "科技感",
    description: "充满科技感的表盘设计，动态效果炫酷，显示丰富的系统信息，适合科技爱好者。",
    category: "hybrid",
    style: {
      background: "#0c0a09",
      accent: "#06b6d4",
      secondary: "#a855f7",
      type: "tech-cyber",
    },
    downloads: 678,
    likes: 189,
  },
  {
    name: "复古经典",
    description: "复古风格的指针表盘，仿古铜色设计，带有岁月沉淀的质感，适合怀旧风格爱好者。",
    category: "analog",
    style: {
      background: "#292524",
      accent: "#d97706",
      secondary: "#78716c",
      type: "vintage-classic",
    },
    downloads: 543,
    likes: 167,
  },
  {
    name: "健身追踪",
    description: "健身追踪专用表盘，实时显示运动目标完成度，支持多种健身模式，激励你达成目标。",
    category: "fitness",
    style: {
      background: "#0f172a",
      accent: "#ef4444",
      secondary: "#22c55e",
      type: "fitness-tracker",
    },
    downloads: 1890,
    likes: 567,
  },
  {
    name: "夜光数字",
    description: "夜间模式优化的数字表盘，支持自动亮度调节，清晰易读不刺眼。",
    category: "digital",
    style: {
      background: "#030712",
      accent: "#3b82f6",
      secondary: "#10b981",
      type: "night-glow",
    },
    downloads: 2341,
    likes: 789,
  },
  {
    name: "城市脉搏",
    description: "现代都市风格的混合表盘，结合天气、日程提醒等实用功能，是都市白领的理想选择。",
    category: "hybrid",
    style: {
      background: "#1e293b",
      accent: "#f472b6",
      secondary: "#38bdf8",
      type: "urban-pulse",
    },
    downloads: 1122,
    likes: 345,
  },
];

// 测试用户
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

// 生成 SVG 表盘图片
function generateWatchFaceSVG(style: typeof watchFaceStyles[0]["style"], name: string): string {
  const size = 400;
  const center = size / 2;
  const radius = size / 2 - 20;

  // 根据类型生成不同的 SVG
  let svgContent = "";

  if (style.type.includes("analog")) {
    // 模拟指针表盘
    svgContent = `
      <circle cx="${center}" cy="${center}" r="${radius}" fill="${style.background}" stroke="${style.accent}" stroke-width="3"/>
      <circle cx="${center}" cy="${center}" r="${radius - 10}" fill="none" stroke="${style.secondary}" stroke-width="1" opacity="0.3"/>
      ${generateHourMarks(center, radius - 20, style)}
      ${generateHands(center, radius - 40, style)}
      <circle cx="${center}" cy="${center}" r="8" fill="${style.accent}"/>
    `;
  } else if (style.type.includes("digital")) {
    // 数字表盘
    const time = "10:42";
    svgContent = `
      <rect x="20" y="20" width="${size - 40}" height="${size - 40}" rx="30" fill="${style.background}" stroke="${style.secondary}" stroke-width="2"/>
      <text x="${center}" y="${center + 30}" font-family="monospace" font-size="80" font-weight="bold" fill="${style.accent}" text-anchor="middle">${time}</text>
      <text x="${center}" y="${center + 70}" font-family="sans-serif" font-size="20" fill="${style.secondary}" text-anchor="middle">${name}</text>
      ${generateDigitalWidgets(center, size, style)}
    `;
  } else if (style.type.includes("fitness")) {
    // 运动表盘
    svgContent = `
      <circle cx="${center}" cy="${center}" r="${radius}" fill="${style.background}"/>
      ${generateFitnessArcs(center, radius, style)}
      <text x="${center}" y="${center - 20}" font-family="monospace" font-size="48" font-weight="bold" fill="${style.accent}" text-anchor="middle">10:42</text>
      <text x="${center}" y="${center + 30}" font-family="sans-serif" font-size="16" fill="${style.secondary}" text-anchor="middle">❤️ 72 BPM</text>
      <text x="${center}" y="${center + 55}" font-family="sans-serif" font-size="14" fill="${style.secondary}" text-anchor="middle">👟 8,432 步</text>
    `;
  } else {
    // 混合表盘
    svgContent = `
      <circle cx="${center}" cy="${center}" r="${radius}" fill="${style.background}" stroke="${style.accent}" stroke-width="2"/>
      ${generateHourMarks(center, radius - 15, style)}
      <text x="${center}" y="${center + 40}" font-family="monospace" font-size="50" font-weight="bold" fill="${style.accent}" text-anchor="middle">10:42</text>
      <text x="${center}" y="${center + 70}" font-family="sans-serif" font-size="16" fill="${style.secondary}" text-anchor="middle">${name}</text>
      ${generateMiniHands(center, radius - 30, style)}
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${svgContent}</svg>`;
}

function generateHourMarks(center: number, radius: number, style: typeof watchFaceStyles[0]["style"]): string {
  let marks = "";
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const innerR = i % 3 === 0 ? radius - 20 : radius - 10;
    const x1 = center + innerR * Math.cos(angle);
    const y1 = center + innerR * Math.sin(angle);
    const x2 = center + radius * Math.cos(angle);
    const y2 = center + radius * Math.sin(angle);
    const width = i % 3 === 0 ? 3 : 1;
    marks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${style.accent}" stroke-width="${width}"/>`;
  }
  return marks;
}

function generateHands(center: number, length: number, style: typeof watchFaceStyles[0]["style"]): string {
  // 时针
  const hourAngle = (10 * 30 + 42 / 60 * 30 - 90) * (Math.PI / 180);
  const hourX = center + (length * 0.5) * Math.cos(hourAngle);
  const hourY = center + (length * 0.5) * Math.sin(hourAngle);
  
  // 分针
  const minAngle = (42 * 6 - 90) * (Math.PI / 180);
  const minX = center + (length * 0.8) * Math.cos(minAngle);
  const minY = center + (length * 0.8) * Math.sin(minAngle);

  return `
    <line x1="${center}" y1="${center}" x2="${hourX}" y2="${hourY}" stroke="${style.accent}" stroke-width="6" stroke-linecap="round"/>
    <line x1="${center}" y1="${center}" x2="${minX}" y2="${minY}" stroke="${style.accent}" stroke-width="4" stroke-linecap="round"/>
  `;
}

function generateMiniHands(center: number, radius: number, style: typeof watchFaceStyles[0]["style"]): string {
  const minRadius = radius * 0.3;
  const minCenterX = center + radius * 0.5;
  const minCenterY = center - radius * 0.3;

  return `
    <circle cx="${minCenterX}" cy="${minCenterY}" r="${minRadius}" fill="none" stroke="${style.secondary}" stroke-width="1" opacity="0.5"/>
  `;
}

function generateDigitalWidgets(center: number, size: number, style: typeof watchFaceStyles[0]["style"]): string {
  return `
    <text x="${center - 80}" y="${center + 100}" font-family="sans-serif" font-size="14" fill="${style.secondary}">📅 3月15日</text>
    <text x="${center + 30}" y="${center + 100}" font-family="sans-serif" font-size="14" fill="${style.secondary}">🌡️ 22°</text>
  `;
}

function generateFitnessArcs(center: number, radius: number, style: typeof watchFaceStyles[0]["style"]): string {
  const arcRadius = radius - 30;
  return `
    <circle cx="${center}" cy="${center}" r="${arcRadius}" fill="none" stroke="${style.secondary}" stroke-width="8" opacity="0.3"/>
    <circle cx="${center}" cy="${center}" r="${arcRadius}" fill="none" stroke="${style.accent}" stroke-width="8" 
      stroke-dasharray="${arcRadius * 1.5} ${arcRadius * 4.7}" 
      transform="rotate(-90 ${center} ${center})"/>
  `;
}

// 上传到七牛云（如果配置了）
async function uploadToQiniu(buffer: Buffer, key: string): Promise<string | null> {
  const accessKey = process.env.QINIU_ACCESS_KEY;
  const secretKey = process.env.QINIU_SECRET_KEY;
  const bucket = process.env.QINIU_BUCKET;
  const domain = process.env.QINIU_DOMAIN;

  if (!accessKey || !secretKey || !bucket || !domain) {
    console.log("七牛云未配置，跳过上传");
    return null;
  }

  try {
    const qiniu = await import("qiniu");
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = { scope: bucket };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    const config = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    return new Promise((resolve, reject) => {
      formUploader.put(uploadToken, key, buffer, putExtra, (err, _body, info) => {
        if (err) {
          reject(err);
        } else if (info.statusCode === 200) {
          resolve(`https://${domain}/${key}`);
        } else {
          reject(new Error(`上传失败: ${info.statusCode}`));
        }
      });
    });
  } catch (error) {
    console.error("七牛云上传失败:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  // P0 修复：添加管理员权限验证
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasPermission(session.user.role, PERMISSIONS.ACCESS_ADMIN)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 生产环境禁用此接口
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is disabled in production" },
      { status: 403 }
    );
  }

  try {
    console.log("🎨 开始生成风格化表盘图片...");

    const useQiniu = request.nextUrl.searchParams.get("qiniu") === "true";

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

    // 如果没有插入新用户，使用已有用户
    if (insertedUserIds.length === 0) {
      const existingUsers = await db.query.users.findMany({ limit: 4 });
      if (existingUsers.length > 0) {
        existingUsers.forEach((u) => insertedUserIds.push(u.id));
      } else {
        for (const user of testUsers) {
          await db.insert(users).values(user);
          insertedUserIds.push(user.id);
        }
      }
    }

    // 生成并插入表盘数据
    const results = [];
    for (let i = 0; i < watchFaceStyles.length; i++) {
      const style = watchFaceStyles[i];
      const userId = insertedUserIds[i % insertedUserIds.length];

      // 生成 SVG
      const svg = generateWatchFaceSVG(style.style, style.name);
      const svgBuffer = Buffer.from(svg);

      // 上传到七牛云（如果启用）
      let thumbnailUrl = `data:image/svg+xml;base64,${svgBuffer.toString("base64")}`;
      
      if (useQiniu) {
        const key = `watchfaces/${Date.now()}-${i}.svg`;
        const uploadedUrl = await uploadToQiniu(svgBuffer, key);
        if (uploadedUrl) {
          thumbnailUrl = uploadedUrl;
        }
      }

      // 插入数据库
      const watchfaceId = randomUUID();
      try {
        await db.insert(watchFaces).values({
          id: watchfaceId,
          userId,
          name: style.name,
          description: style.description,
          category: style.category,
          thumbnailUrl,
          fileUrl: `/uploads/watchface-${i + 1}.garmin`,
          fileSize: Math.floor(Math.random() * 3000000) + 1000000,
          status: "approved",
          downloads: style.downloads,
          likes: style.likes,
        });
        results.push({ name: style.name, thumbnailUrl, uploaded: useQiniu && thumbnailUrl.startsWith("http") });
      } catch {
        console.log(`表盘 ${style.name} 已存在，跳过`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `生成 ${results.length} 个风格化表盘图片`,
      data: results,
      note: useQiniu ? "已尝试上传到七牛云" : "图片以 SVG 格式存储，可通过 qiniu=true 参数上传到七牛云",
    });
  } catch (error) {
    console.error("生成表盘图片失败:", error);
    return NextResponse.json(
      { error: "生成失败", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "使用 POST 方法生成风格化表盘图片",
    endpoint: "/api/generate-watchfaces",
    options: {
      qiniu: "设置 ?qiniu=true 上传到七牛云（需配置七牛云环境变量）",
    },
    styles: watchFaceStyles.map((s) => ({
      name: s.name,
      category: s.category,
      style: s.style.type,
    })),
  });
}
