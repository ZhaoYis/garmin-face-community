import { createCanvas, drawSolidBackground, drawText, drawRoundedRect } from "../canvas";
import { renderRoute, renderGradientRoute } from "../route-renderer";
import { formatActivityData } from "../utils";
import { Activity } from "@/lib/db/schema";

const WIDTH = 750;
const HEIGHT = 1334;

interface PosterData {
  activity: Activity;
  customText?: string;
}

/**
 * 成就海报渲染器
 * 深色背景 + 金色装饰
 */
export function renderAchievementPoster(data: PosterData): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas({ width: WIDTH, height: HEIGHT, scale: 2 });
  const formatted = formatActivityData(data.activity);

  // 深色背景
  drawSolidBackground(ctx, WIDTH, HEIGHT, "#0F172A");

  // 顶部装饰线
  ctx.fillStyle = "#FFD700";
  ctx.fillRect(0, 100, WIDTH, 4);

  // 绘制路线（如果有）
  if (formatted.polyline) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    renderRoute(ctx, formatted.polyline, {
      canvasWidth: WIDTH,
      canvasHeight: 400,
      padding: 50,
      strokeColor: "#FFD700",
      strokeWidth: 3,
    });
    ctx.restore();
  }

  // 比赛名称
  drawText(ctx, formatted.raceName, WIDTH / 2, 250, {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
  });

  // 完赛时间（大字）
  drawText(ctx, formatted.finishTime, WIDTH / 2, 450, {
    fontSize: 120,
    fontWeight: "bold",
    color: "#FFD700",
  });

  // 距离
  drawText(ctx, formatted.distance, WIDTH / 2, 580, {
    fontSize: 36,
    color: "#FFFFFF",
  });

  // 分隔线
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 650);
  ctx.lineTo(WIDTH - 100, 650);
  ctx.stroke();

  // 数据网格
  const startY = 720;
  const gapY = 80;

  // 平均配速
  drawText(ctx, "平均配速", WIDTH / 4, startY, { fontSize: 20, color: "#94A3B8" });
  drawText(ctx, formatted.avgPace, WIDTH / 4, startY + 40, {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  });

  // 平均心率
  drawText(ctx, "平均心率", (WIDTH / 4) * 3, startY, { fontSize: 20, color: "#94A3B8" });
  drawText(ctx, formatted.avgHr ? `${formatted.avgHr} bpm` : "-", (WIDTH / 4) * 3, startY + 40, {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  });

  // 累计爬升
  drawText(ctx, "累计爬升", WIDTH / 4, startY + gapY, { fontSize: 20, color: "#94A3B8" });
  drawText(ctx, `${formatted.elevationGain}m`, WIDTH / 4, startY + gapY + 40, {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  });

  // 日期
  drawText(ctx, "比赛日期", (WIDTH / 4) * 3, startY + gapY, { fontSize: 20, color: "#94A3B8" });
  drawText(ctx, formatted.date, (WIDTH / 4) * 3, startY + gapY + 40, {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  });

  // 自定义标语
  if (data.customText) {
    drawRoundedRect(ctx, 50, HEIGHT - 250, WIDTH - 100, 100, 16, "#1E293B");
    drawText(ctx, data.customText, WIDTH / 2, HEIGHT - 200, {
      fontSize: 32,
      fontWeight: "bold",
      color: "#FFD700",
    });
  }

  // 底部品牌
  drawText(ctx, "Garmin Watch Face Community", WIDTH / 2, HEIGHT - 50, {
    fontSize: 16,
    color: "#64748B",
  });

  return canvas;
}

/**
 * 极简海报渲染器
 * 白底 + 黑字
 */
export function renderMinimalPoster(data: PosterData): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas({ width: WIDTH, height: HEIGHT, scale: 2 });
  const formatted = formatActivityData(data.activity);

  // 白色背景
  drawSolidBackground(ctx, WIDTH, HEIGHT, "#FFFFFF");

  // 简约边框
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, WIDTH - 80, HEIGHT - 80);

  // 运动类型图标区域
  drawText(ctx, "RUN", WIDTH / 2, 150, {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
  });

  // 距离（核心数据）
  drawText(ctx, formatted.distance, WIDTH / 2, 350, {
    fontSize: 96,
    fontWeight: "bold",
    color: "#0F172A",
  });

  // 时长
  drawText(ctx, formatted.finishTime, WIDTH / 2, 450, {
    fontSize: 48,
    color: "#64748B",
  });

  // 配速
  drawText(ctx, `平均配速 ${formatted.avgPace}`, WIDTH / 2, 550, {
    fontSize: 28,
    color: "#94A3B8",
  });

  // 日期
  drawText(ctx, formatted.date, WIDTH / 2, HEIGHT - 200, {
    fontSize: 24,
    color: "#64748B",
  });

  // 自定义标语
  if (data.customText) {
    drawText(ctx, `"${data.customText}"`, WIDTH / 2, HEIGHT - 280, {
      fontSize: 24,
      color: "#0F172A",
    });
  }

  return canvas;
}

/**
 * 艺术海报渲染器
 * 渐变背景
 */
export function renderArtPoster(data: PosterData): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas({ width: WIDTH, height: HEIGHT, scale: 2 });
  const formatted = formatActivityData(data.activity);

  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, "#667EEA");
  gradient.addColorStop(0.5, "#764BA2");
  gradient.addColorStop(1, "#F093FB");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 装饰圆形
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.arc(WIDTH - 100, 200, 150, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(100, HEIGHT - 300, 100, 0, Math.PI * 2);
  ctx.fill();

  // 绘制路线
  if (formatted.polyline) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    renderRoute(ctx, formatted.polyline, {
      canvasWidth: WIDTH,
      canvasHeight: 350,
      padding: 50,
      strokeColor: "#FFFFFF",
      strokeWidth: 4,
      shadowColor: "rgba(0,0,0,0.3)",
      shadowBlur: 10,
    });
    ctx.restore();
  }

  // 比赛名称
  drawText(ctx, formatted.raceName, WIDTH / 2, 500, {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFFFFF",
  });

  // 核心数据
  drawText(ctx, formatted.distance, WIDTH / 2, 650, {
    fontSize: 80,
    fontWeight: "bold",
    color: "#FFFFFF",
  });

  drawText(ctx, formatted.finishTime, WIDTH / 2, 750, {
    fontSize: 48,
    color: "rgba(255,255,255,0.9)",
  });

  drawText(ctx, `配速 ${formatted.avgPace}`, WIDTH / 2, 850, {
    fontSize: 28,
    color: "rgba(255,255,255,0.8)",
  });

  // 自定义标语
  if (data.customText) {
    drawText(ctx, data.customText, WIDTH / 2, HEIGHT - 200, {
      fontSize: 32,
      fontWeight: "bold",
      color: "#FFFFFF",
    });
  }

  // 日期
  drawText(ctx, formatted.date, WIDTH / 2, HEIGHT - 100, {
    fontSize: 20,
    color: "rgba(255,255,255,0.7)",
  });

  return canvas;
}

/**
 * 越野海报渲染器
 * 大地色系
 */
export function renderTrailPoster(data: PosterData): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas({ width: WIDTH, height: HEIGHT, scale: 2 });
  const formatted = formatActivityData(data.activity);

  // 深色背景
  drawSolidBackground(ctx, WIDTH, HEIGHT, "#1A1A2E");

  // 地形装饰
  ctx.fillStyle = "#16213E";
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT - 300);
  ctx.lineTo(WIDTH / 3, HEIGHT - 450);
  ctx.lineTo(WIDTH / 2, HEIGHT - 350);
  ctx.lineTo((WIDTH / 3) * 2, HEIGHT - 500);
  ctx.lineTo(WIDTH, HEIGHT - 380);
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.lineTo(0, HEIGHT);
  ctx.closePath();
  ctx.fill();

  // 绘制路线
  if (formatted.polyline) {
    ctx.save();
    ctx.globalAlpha = 0.6;
    renderGradientRoute(ctx, formatted.polyline, {
      canvasWidth: WIDTH,
      canvasHeight: 400,
      padding: 60,
      gradientColors: ["#D2691E", "#8B4513"],
      strokeWidth: 4,
    });
    ctx.restore();
  }

  // 比赛名称
  drawText(ctx, formatted.raceName, WIDTH / 2, 180, {
    fontSize: 40,
    fontWeight: "bold",
    color: "#F5DEB3",
  });

  // 距离和爬升（越野特色）
  drawText(ctx, formatted.distance, WIDTH / 2, 320, {
    fontSize: 72,
    fontWeight: "bold",
    color: "#D2691E",
  });

  drawText(ctx, `↑ ${formatted.elevationGain}m`, WIDTH / 2, 410, {
    fontSize: 36,
    fontWeight: "bold",
    color: "#8B4513",
  });

  // 完赛时间
  drawText(ctx, formatted.finishTime, WIDTH / 2, 520, {
    fontSize: 56,
    fontWeight: "bold",
    color: "#F5DEB3",
  });

  // 配速
  drawText(ctx, `平均配速 ${formatted.avgPace}`, WIDTH / 2, 600, {
    fontSize: 24,
    color: "#A0826D",
  });

  // 分隔线
  ctx.strokeStyle = "#2C2C54";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 700);
  ctx.lineTo(WIDTH - 100, 700);
  ctx.stroke();

  // 数据区
  drawText(ctx, `心率 ${formatted.avgHr || "-"} / ${formatted.maxHr || "-"} bpm`, WIDTH / 2, 800, {
    fontSize: 28,
    color: "#F5DEB3",
  });

  // 自定义标语
  if (data.customText) {
    drawRoundedRect(ctx, 50, HEIGHT - 280, WIDTH - 100, 80, 12, "#16213E");
    drawText(ctx, data.customText, WIDTH / 2, HEIGHT - 240, {
      fontSize: 28,
      fontWeight: "bold",
      color: "#D2691E",
    });
  }

  // 日期
  drawText(ctx, formatted.date, WIDTH / 2, HEIGHT - 80, {
    fontSize: 18,
    color: "#A0826D",
  });

  return canvas;
}

/**
 * 根据模板类型选择渲染器
 */
export function renderPoster(
  templateKey: string,
  data: PosterData
): HTMLCanvasElement {
  switch (templateKey) {
    case "achievement":
      return renderAchievementPoster(data);
    case "minimal":
      return renderMinimalPoster(data);
    case "art":
      return renderArtPoster(data);
    case "trail":
      return renderTrailPoster(data);
    default:
      return renderAchievementPoster(data);
  }
}
