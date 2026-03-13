/**
 * Polyline 解码和路线渲染
 */

interface Point {
  lat: number;
  lng: number;
}

interface RouteBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/**
 * 解码 Google Polyline 编码
 */
export function decodePolyline(encoded: string): Point[] {
  if (!encoded) return [];

  const points: Point[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return points;
}

/**
 * 计算路线边界
 */
function calculateBounds(points: Point[]): RouteBounds {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const point of points) {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLng = Math.min(minLng, point.lng);
    maxLng = Math.max(maxLng, point.lng);
  }

  return { minLat, maxLat, minLng, maxLng };
}

/**
 * 渲染路线到 Canvas
 */
export function renderRoute(
  ctx: CanvasRenderingContext2D,
  encodedPolyline: string,
  options: {
    canvasWidth: number;
    canvasHeight: number;
    padding: number;
    strokeColor: string;
    strokeWidth: number;
    lineCap?: CanvasLineCap;
    lineJoin?: CanvasLineJoin;
    shadowColor?: string;
    shadowBlur?: number;
  }
): void {
  const points = decodePolyline(encodedPolyline);
  if (points.length < 2) return;

  const {
    canvasWidth,
    canvasHeight,
    padding,
    strokeColor,
    strokeWidth,
    lineCap = "round",
    lineJoin = "round",
    shadowColor,
    shadowBlur,
  } = options;

  // 计算边界
  const bounds = calculateBounds(points);

  // 计算缩放比例
  const latRange = bounds.maxLat - bounds.minLat || 1;
  const lngRange = bounds.maxLng - bounds.minLng || 1;

  const availableWidth = canvasWidth - padding * 2;
  const availableHeight = canvasHeight - padding * 2;

  const scale = Math.min(availableWidth / lngRange, availableHeight / latRange);

  // 计算居中偏移
  const scaledWidth = lngRange * scale;
  const scaledHeight = latRange * scale;
  const offsetX = (availableWidth - scaledWidth) / 2 + padding;
  const offsetY = (availableHeight - scaledHeight) / 2 + padding;

  // 设置绘制样式
  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = lineCap;
  ctx.lineJoin = lineJoin;

  if (shadowColor && shadowBlur) {
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
  }

  // 绘制路线
  points.forEach((point, index) => {
    const x = (point.lng - bounds.minLng) * scale + offsetX;
    // 翻转 Y 轴（Canvas 的 Y 轴向下）
    const y = canvasHeight - ((point.lat - bounds.minLat) * scale + offsetY);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // 重置阴影
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
}

/**
 * 渲染带渐变的路线
 */
export function renderGradientRoute(
  ctx: CanvasRenderingContext2D,
  encodedPolyline: string,
  options: {
    canvasWidth: number;
    canvasHeight: number;
    padding: number;
    gradientColors: string[];
    strokeWidth: number;
  }
): void {
  const points = decodePolyline(encodedPolyline);
  if (points.length < 2) return;

  const { canvasWidth, canvasHeight, padding, gradientColors, strokeWidth } = options;
  const bounds = calculateBounds(points);

  const latRange = bounds.maxLat - bounds.minLat || 1;
  const lngRange = bounds.maxLng - bounds.minLng || 1;

  const availableWidth = canvasWidth - padding * 2;
  const availableHeight = canvasHeight - padding * 2;

  const scale = Math.min(availableWidth / lngRange, availableHeight / latRange);

  // 计算所有点的坐标
  const coords = points.map((point) => {
    const x = (point.lng - bounds.minLng) * scale + padding;
    const y = canvasHeight - ((point.lat - bounds.minLat) * scale + padding);
    return { x, y };
  });

  // 创建渐变
  const minX = Math.min(...coords.map((c) => c.x));
  const maxX = Math.max(...coords.map((c) => c.x));
  const gradient = ctx.createLinearGradient(minX, 0, maxX, 0);

  gradientColors.forEach((color, index) => {
    gradient.addColorStop(index / (gradientColors.length - 1), color);
  });

  // 绘制路线
  ctx.beginPath();
  ctx.strokeStyle = gradient;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  coords.forEach((coord, index) => {
    if (index === 0) {
      ctx.moveTo(coord.x, coord.y);
    } else {
      ctx.lineTo(coord.x, coord.y);
    }
  });

  ctx.stroke();
}
