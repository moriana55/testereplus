/**
 * Basit IP tabanlı hız sınırlayıcı (in-memory, server-only)
 *
 * Kayan pencere (sliding window) ile her IP için zaman aralığında izin verilen
 * istek sayısını sınırlar. Dağıtık/çok örnekli ortamlarda kalıcı bir store
 * (Redis vb.) gerekir; tek örnek/dev için yeterli, fail-closed davranır
 * (limit aşılırsa istek reddedilir).
 *
 * Not: Sunucusuz (serverless) ortamlarda bellek örnekler arası paylaşılmaz;
 * yine de tek örnek içinde kötüye kullanımı yavaşlatır. Kalıcı çözüm için
 * Upstash/Redis tabanlı bir limitör eklenebilir (anahtar gerektirir).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

/**
 * @param key       Sınırlama anahtarı (genelde "ruta:ip")
 * @param limit     Pencere başına izin verilen istek sayısı
 * @param windowMs  Pencere süresi (ms)
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, retryAfterSec: 0 };
}

/** İstekten istemci IP'sini güvenilir başlıklardan çıkarır. */
export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

// Bellek sızıntısını önlemek için süresi geçmiş kovaları ara sıra temizle.
let lastSweep = Date.now();
function maybeSweep() {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
}

/** rateLimit + otomatik temizlik için sarmalayıcı. */
export function checkRateLimit(request: Request, route: string, limit: number, windowMs: number): RateLimitResult {
  maybeSweep();
  return rateLimit(`${route}:${clientIp(request)}`, limit, windowMs);
}
