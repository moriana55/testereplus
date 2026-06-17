/**
 * E-posta gönderim yardımcısı (Resend-ready)
 *
 * Anahtar yoksa hata fırlatmaz — sadece loglar ve { sent: false } döner.
 * Böylece checkout / iletişim akışları anahtar olmadan da çökmeden çalışır.
 *
 * Gerekli ENV değişkenleri (canlıya almak için):
 *   RESEND_API_KEY     — Resend API anahtarı (https://resend.com)
 *   EMAIL_FROM         — Gönderen adresi (ör: "Testere Plus <siparis@testereplus.com>")
 *   EMAIL_STORE_OWNER  — (opsiyonel) Mağaza sahibinin bildirim alacağı adres
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "Testere Plus <onboarding@resend.dev>";

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export interface SendEmailResult {
  sent: boolean;
  id?: string;
  reason?: string;
}

/** E-posta gönderir. Anahtar yoksa no-op olur (loglar, çökmez). */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  if (!RESEND_API_KEY) {
    // Anahtar yapılandırılmamış — fail-closed değil, fail-soft: akışı bozmadan logla.
    console.warn(
      `[email] RESEND_API_KEY tanımlı değil — e-posta gönderilmedi. ` +
        `Alıcı: ${Array.isArray(params.to) ? params.to.join(", ") : params.to} | Konu: ${params.subject}`,
    );
    return { sent: false, reason: "not_configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: Array.isArray(params.to) ? params.to : [params.to],
        subject: params.subject,
        html: params.html,
        ...(params.replyTo ? { reply_to: params.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[email] Resend hatası ${res.status}: ${text}`);
      return { sent: false, reason: `resend_error_${res.status}` };
    }

    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { sent: true, id: data.id };
  } catch (err) {
    console.error("[email] Gönderim sırasında hata:", err);
    return { sent: false, reason: "exception" };
  }
}

/** Sipariş onay e-postası için basit HTML şablonu. */
export function orderConfirmationHtml(params: {
  orderId: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
  const rows = params.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.name} × ${i.quantity}</td>` +
        `<td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${fmt(i.price * i.quantity)}</td></tr>`,
    )
    .join("");

  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
    <h2 style="color:#ea580c">Siparişiniz Alındı 🎉</h2>
    <p>Merhaba ${params.customerName || "Değerli Müşterimiz"},</p>
    <p>Siparişiniz başarıyla oluşturuldu. Sipariş numaranız: <strong>${params.orderId}</strong></p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      ${rows}
      <tr><td style="padding:12px 0;font-weight:bold">Toplam</td>
      <td style="padding:12px 0;font-weight:bold;text-align:right;color:#ea580c">${fmt(params.total)}</td></tr>
    </table>
    <p style="color:#666;font-size:13px">Sorularınız için WhatsApp üzerinden bize ulaşabilirsiniz.</p>
    <p style="color:#666;font-size:13px">Testere Plus</p>
  </div>`;
}
