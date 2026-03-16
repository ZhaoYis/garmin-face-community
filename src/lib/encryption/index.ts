import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
// AUTH_TAG_LENGTH is defined for documentation purposes
// The auth tag length is determined by the algorithm (16 bytes for AES-GCM)
const _AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;

/**
 * 从环境变量获取加密密钥
 * 密钥应该是 32 字节的十六进制字符串（64 个字符）
 * P3 修复：添加密钥长度验证
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }
  
  // 验证密钥长度：必须是 64 个字符的十六进制字符串（32 字节）
  if (key.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(key)) {
    throw new Error(
      "ENCRYPTION_KEY must be a 64-character hexadecimal string (32 bytes). " +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }
  
  return Buffer.from(key, "hex");
}

/**
 * 加密敏感数据
 * @param plaintext 要加密的明文
 * @returns 加密后的字符串（格式：salt:iv:authTag:ciphertext）
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();

  // 生成随机盐和 IV
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);

  // 使用 PBKDF2 派生密钥
  const derivedKey = crypto.pbkdf2Sync(key, salt, 100000, 32, "sha256");

  // 创建加密器
  const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);

  // 加密
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  // 获取认证标签
  const authTag = cipher.getAuthTag();

  // 返回格式：salt:iv:authTag:ciphertext
  return [
    salt.toString("hex"),
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

/**
 * 解密敏感数据
 * @param ciphertext 加密的字符串
 * @returns 解密后的明文
 */
export function decrypt(ciphertext: string): string {
  const key = getEncryptionKey();

  // 解析加密数据
  const parts = ciphertext.split(":");
  if (parts.length !== 4) {
    throw new Error("Invalid ciphertext format");
  }

  const [saltHex, ivHex, authTagHex, encryptedHex] = parts;
  const salt = Buffer.from(saltHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  // 使用 PBKDF2 派生密钥
  const derivedKey = crypto.pbkdf2Sync(key, salt, 100000, 32, "sha256");

  // 创建解密器
  const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);
  decipher.setAuthTag(authTag);

  // 解密
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

/**
 * 检查加密密钥是否已配置
 */
export function isEncryptionConfigured(): boolean {
  return !!process.env.ENCRYPTION_KEY;
}
