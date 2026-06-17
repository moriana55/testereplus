import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-session";

/**
 * Proxy (Next.js 16'da Middleware'in yeni adı)
 *
 * /admin/* yollarını sunucu tarafında korur:
 *  - İmzalı oturum çerezi geçerliyse istek geçer.
 *  - Geçerli değilse (çerez yok / imza geçersiz / süre dolmuş / secret yok)
 *    kullanıcı /admin köküne (giriş ekranı) yönlendirilir → FAIL-CLOSED.
 *
 * /admin kökünün kendisi (giriş ekranı) ve /api/admin/auth her zaman geçer
 * ki kullanıcı giriş yapabilsin. Gerçek doğrulama imza kontrolüyle yapılır;
 * istemci localStorage'ı ile bypass edilemez.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin kökü = giriş ekranı; alt yolları koru.
  if (pathname === "/admin") return NextResponse.next();

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const valid = await verifySessionToken(token);
  if (valid) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/admin";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // /admin alt yolları korunur. /admin kökü matcher dışında bırakıldı.
  matcher: ["/admin/:path+"],
};
