import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  createSessionToken,
  isAdminConfigured,
  verifyPassword,
  verifySessionToken,
  sessionCookieOptions,
  SESSION_MAX_AGE_SEC,
} from "@/lib/admin-session";

/**
 * Admin kimlik doğrulama API'si (sunucu tarafı, fail-closed)
 *
 *  GET    → mevcut oturum geçerli mi? { loggedIn, configured }
 *  POST   → { password } doğrula → imzalı httpOnly çerez yaz (giriş)
 *  DELETE → çerezi sil (çıkış)
 *
 * Şifre yalnızca sunucuda ADMIN_PASSWORD'dan okunur; istemciye sızmaz.
 * Rastgele bekleme + sabit-zamanlı karşılaştırma ile timing/brute-force
 * sızıntısı azaltılır.
 */

export const runtime = "nodejs";

export async function GET() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const loggedIn = await verifySessionToken(token);
  return NextResponse.json({ loggedIn, configured: isAdminConfigured() });
}

export async function POST(request: Request) {
  // Fail-closed: env yapılandırılmadıysa hiçbir giriş kabul edilmez.
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin girişi sunucuda yapılandırılmamış (ADMIN_PASSWORD / ADMIN_SECRET)." },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Geçersiz istek." }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";

  if (!verifyPassword(password)) {
    return NextResponse.json({ ok: false, error: "Şifre yanlış." }, { status: 401 });
  }

  const token = await createSessionToken();
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE_SEC));
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.set(ADMIN_COOKIE, "", sessionCookieOptions(0));
  return NextResponse.json({ ok: true });
}
