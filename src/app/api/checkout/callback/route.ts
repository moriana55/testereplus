import { NextResponse } from "next/server";
import { getCheckoutFormResult } from "@/lib/iyzico";

/**
 * iyzico Checkout Form callback
 *
 * iyzico, ödeme tamamlandıktan sonra bu adrese POST eder (token gönderir).
 * Token ile sonucu sorgular, başarılıysa onay sayfasına, değilse
 * ödeme sayfasına hata ile yönlendiririz.
 *
 * iyzico yapılandırılmamışsa bu uç çağrılmaz; yine de fail-soft davranır.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId") || "";
  const origin = url.origin;

  let token = "";
  try {
    const form = await request.formData();
    token = String(form.get("token") || "");
  } catch {
    // gövde yoksa
  }

  if (!token || !process.env.IYZICO_API_KEY) {
    return NextResponse.redirect(`${origin}/odeme?error=payment_failed`, 303);
  }

  try {
    const result = await getCheckoutFormResult(token);
    if (result.status === "success") {
      return NextResponse.redirect(`${origin}/siparis?id=${encodeURIComponent(orderId || result.conversationId)}`, 303);
    }
    return NextResponse.redirect(
      `${origin}/odeme?error=${encodeURIComponent(result.errorMessage || "payment_failed")}`,
      303,
    );
  } catch (err) {
    console.error("[checkout/callback] iyzico sonuç hatası:", err);
    return NextResponse.redirect(`${origin}/odeme?error=payment_failed`, 303);
  }
}
