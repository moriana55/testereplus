/**
 * Sunucu tarafı admin oturum yardımcısı (server-only)
 *
 * Güvenlik modeli:
 *  - Şifre yalnızca SUNUCUDA, ADMIN_PASSWORD env değişkeninden okunur.
 *    İstemci koduna ASLA gömülmez ve NEXT_PUBLIC ile sızdırılmaz.
 *  - Giriş başarılıysa HMAC-SHA256 ile imzalı bir oturum jetonu üretilir
 *    ve httpOnly + secure + sameSite=strict bir çereze yazılır.
 *  - Jetonu doğrulamak ADMIN_SECRET (veya yoksa ADMIN_PASSWORD) gerektirir.
 *  - FAIL-CLOSED: ADMIN_PASSWORD tanımlı değilse hiçbir giriş kabul edilmez;
 *    imza secret'ı yoksa hiçbir oturum geçerli sayılmaz.
 *
 * Bu modül yalnızca sunucuda (route handler / proxy / RSC) çalışır.
 */

export const ADMIN_COOKIE = "tp_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 saat

function getPassword(): string {
  return process.env.ADMIN_PASSWORD || "";
}

/** İmza secret'ı: ayrı ADMIN_SECRET tercih edilir, yoksa ADMIN_PASSWORD'a düşer. */
function getSecret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

/** Admin girişi yapılandırılmış mı? (fail-closed kontrolü) */
export function isAdminConfigured(): boolean {
  return getPassword().length > 0 && getSecret().length > 0;
}

// ─── Düşük seviye yardımcılar (Web Crypto, Edge + Node uyumlu) ───

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const bin = atob(b64 + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(message: string, secret: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return new Uint8Array(sig);
}

/** Sabit zamanlı karşılaştırma (timing-safe). */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Şifreyi timing-safe doğrular (sabit zamanlı string karşılaştırma). */
export function verifyPassword(input: string): boolean {
  const expected = getPassword();
  if (!expected) return false; // fail-closed: env yoksa giriş yok
  const enc = new TextEncoder();
  return timingSafeEqual(enc.encode(input), enc.encode(expected));
}

/**
 * İmzalı oturum jetonu üretir.  Format: "<expiryMs>.<base64url(hmac)>"
 * İmza, secret + "admin:<expiryMs>" mesajı üzerinden hesaplanır.
 */
export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `admin:${exp}`;
  const sig = await hmac(payload, secret);
  return `${exp}.${toBase64Url(sig)}`;
}

/** Jetonu doğrular: imza geçerli mi + süresi dolmamış mı. */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false; // fail-closed

  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sigStr = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;

  const payload = `admin:${exp}`;
  const expected = await hmac(payload, secret);
  let provided: Uint8Array;
  try {
    provided = fromBase64Url(sigStr);
  } catch {
    return false;
  }
  return timingSafeEqual(provided, expected);
}

/** Oturum çerezi için ortak ayarlar. */
export function sessionCookieOptions(maxAgeSec: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}

export const SESSION_MAX_AGE_SEC = Math.floor(SESSION_TTL_MS / 1000);
