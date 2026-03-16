import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

// 支持的文件类型（扩展名 + MIME 类型）
const ALLOWED_TYPES: Record<string, { extensions: string[]; mimes: string[] }> = {
  watchface: {
    extensions: [".garmin", ".prg"],
    mimes: ["application/octet-stream", "application/x-garmin"],
  },
  image: {
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    mimes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  },
  poster: {
    extensions: [".png", ".jpg", ".jpeg"],
    mimes: ["image/png", "image/jpeg"],
  },
};

// 文件大小限制 (bytes)
const SIZE_LIMITS: Record<string, number> = {
  watchface: 10 * 1024 * 1024, // 10MB
  image: 5 * 1024 * 1024, // 5MB
  poster: 5 * 1024 * 1024, // 5MB
};

// POST /api/upload - 通用文件上传
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "image"; // watchface | image | poster

    if (!file) {
      return NextResponse.json({ error: "缺少文件" }, { status: 400 });
    }

    // 验证文件类型
    const typeConfig = ALLOWED_TYPES[type] || ALLOWED_TYPES.image;
    const fileName = file.name.toLowerCase();
    const fileExt = fileName.substring(fileName.lastIndexOf("."));
    
    // P1 修复：同时验证扩展名和 MIME 类型
    const isValidExtension = typeConfig.extensions.some((ext) => fileExt === ext);
    const isValidMime = typeConfig.mimes.some(
      (mime) => file.type === mime || file.type.startsWith(mime.split("/")[0] + "/")
    );

    if (!isValidExtension || !isValidMime) {
      return NextResponse.json(
        { error: `不支持的文件格式，支持: ${typeConfig.extensions.join(", ")}` },
        { status: 400 }
      );
    }

    // 验证文件大小
    const sizeLimit = SIZE_LIMITS[type] || SIZE_LIMITS.image;
    if (file.size > sizeLimit) {
      return NextResponse.json(
        { error: `文件大小超过限制 (${sizeLimit / 1024 / 1024}MB)` },
        { status: 400 }
      );
    }

    // 权限检查
    if (type === "watchface" && !hasPermission(session.user.role, PERMISSIONS.UPLOAD_WATCHFACE)) {
      return NextResponse.json({ error: "无权限上传表盘" }, { status: 403 });
    }

    // 生成文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = fileName.substring(fileName.lastIndexOf("."));
    const newFileName = `${timestamp}-${randomStr}${ext}`;
    const filePath = `uploads/${type}/${newFileName}`;

    // 读取文件内容
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 根据环境选择上传方式
    let fileUrl: string;

    if (process.env.QINIU_ACCESS_KEY && process.env.QINIU_BUCKET) {
      // 七牛云上传
      fileUrl = await uploadToQiniu(buffer, filePath);
    } else {
      // 本地存储（开发环境）
      // 注意：Vercel 不支持本地文件存储，仅用于本地开发测试
      const fs = await import("fs/promises");
      const path = await import("path");
      const uploadDir = path.join(process.cwd(), "public", "uploads", type);

      // 确保目录存在
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, newFileName), buffer);

      fileUrl = `/uploads/${type}/${newFileName}`;
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: newFileName,
      size: file.size,
      type,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}

// 七牛云上传
async function uploadToQiniu(buffer: Buffer, key: string): Promise<string> {
  const qiniu = await import("qiniu");

  const mac = new qiniu.auth.digest.Mac(
    process.env.QINIU_ACCESS_KEY!,
    process.env.QINIU_SECRET_KEY!
  );

  const options = {
    scope: process.env.QINIU_BUCKET!,
  };

  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  const config = new qiniu.conf.Config();
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();

  return new Promise((resolve, reject) => {
    formUploader.put(
      uploadToken,
      key,
      buffer,
      putExtra,
      (err, body, info) => {
        if (err) {
          reject(err);
        } else if (info.statusCode === 200) {
          const domain = process.env.QINIU_DOMAIN!;
          resolve(`https://${domain}/${key}`);
        } else {
          reject(new Error(`上传失败: ${info.statusCode}`));
        }
      }
    );
  });
}
