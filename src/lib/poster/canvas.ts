/**
 * Canvas 渲染工具函数
 */

export interface CanvasRenderOptions {
  width: number;
  height: number;
  scale?: number;
}

/**
 * 创建高分辨率 Canvas
 */
export function createCanvas(options: CanvasRenderOptions): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const { width, height, scale = 2 } = options;

  // 创建离屏 Canvas
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get 2D context");
  }

  // 缩放上下文以支持高分辨率
  ctx.scale(scale, scale);

  return { canvas, ctx };
}

/**
 * 绘制渐变背景
 */
export function drawGradientBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: string[]
): void {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * 绘制纯色背景
 */
export function drawSolidBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

/**
 * 绘制圆角矩形
 */
export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillColor?: string,
  strokeColor?: string,
  strokeWidth: number = 0
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  if (strokeColor && strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

/**
 * 绘制文本
 */
export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    maxWidth?: number;
  } = {}
): void {
  const {
    fontSize = 16,
    fontFamily = "system-ui, sans-serif",
    fontWeight = "normal",
    color = "#000000",
    align = "center",
    baseline = "middle",
    maxWidth,
  } = options;

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;

  if (maxWidth) {
    ctx.fillText(text, x, y, maxWidth);
  } else {
    ctx.fillText(text, x, y);
  }
}

/**
 * 绘制多行文本
 */
export function drawMultilineText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  options: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    align?: CanvasTextAlign;
  } = {}
): number {
  const { fontSize = 16, fontFamily, fontWeight, color, align = "center" } = options;

  ctx.font = `${fontWeight || "normal"} ${fontSize}px ${fontFamily || "system-ui, sans-serif"}`;
  ctx.fillStyle = color || "#000000";
  ctx.textAlign = align;
  ctx.textBaseline = "top";

  const words = text.split("");
  let line = "";
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);

  return currentY + lineHeight;
}

/**
 * Canvas 转换为 Blob
 */
export function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png"): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert canvas to blob"));
        }
      },
      type,
      0.95
    );
  });
}

/**
 * Canvas 转换为 Data URL
 */
export function canvasToDataURL(canvas: HTMLCanvasElement, type = "image/png"): string {
  return canvas.toDataURL(type, 0.95);
}
