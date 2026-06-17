import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * B2B Toplu Sipariş / Teklif (Quote) API'si
 *
 * Birden fazla ürün + adet içeren bir teklif talebini sunucu tarafında
 * doğrular ve (RESEND anahtarı varsa) mağaza sahibine lead olarak gönderir.
 * Anahtar yoksa sendEmail no-op olur; talep yine loglanır ve başarı döner
 * (kullanıcı deneyimi bozulmaz). Ödeme/anahtar gerektirmez.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\s()-]{7,20}$/;
const STORE_OWNER = process.env.EMAIL_STORE_OWNER || process.env.EMAIL_FROM || "";

interface QuoteLine {
  name?: string;
  sku?: string;
  quantity?: number;
}

interface QuoteBody {
  company?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  note?: string;
  items?: QuoteLine[];
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  // Hız sınırı: IP başına 60 sn'de en fazla 5 teklif talebi (abuse'a karşı).
  const rl = checkRateLimit(request, "quote", 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Çok fazla talep gönderdiniz. Lütfen biraz sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let body: QuoteBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Geçersiz istek." }, { status: 400 });
  }

  const contactName = (body.contactName || "").trim();
  const company = (body.company || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const note = (body.note || "").trim();
  const rawItems = Array.isArray(body.items) ? body.items : [];

  // ── Sunucu tarafı doğrulama (sınırda doğrulama, fail-closed) ──
  if (contactName.length < 2) {
    return NextResponse.json({ ok: false, error: "Yetkili adı zorunludur." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Geçerli bir e-posta giriniz." }, { status: 400 });
  }
  if (phone && !PHONE_RE.test(phone)) {
    return NextResponse.json({ ok: false, error: "Telefon numarası geçerli değil." }, { status: 400 });
  }

  // Geçerli kalemleri temizle: adı olan + adet >= 1.
  const items = rawItems
    .map((it) => ({
      name: (it.name || "").trim().slice(0, 200),
      sku: (it.sku || "").trim().slice(0, 60),
      quantity: Math.floor(Number(it.quantity)),
    }))
    .filter((it) => it.name.length > 0 && Number.isFinite(it.quantity) && it.quantity >= 1);

  if (items.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Teklif için en az bir ürün ve adet girilmelidir." },
      { status: 400 },
    );
  }
  if (items.length > 100) {
    return NextResponse.json({ ok: false, error: "Çok fazla kalem." }, { status: 400 });
  }
  if (note.length > 5000) {
    return NextResponse.json({ ok: false, error: "Not çok uzun." }, { status: 400 });
  }

  const totalUnits = items.reduce((s, it) => s + it.quantity, 0);

  const rows = items
    .map(
      (it) =>
        `<tr>` +
        `<td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(it.name)}</td>` +
        `<td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(it.sku || "—")}</td>` +
        `<td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${it.quantity}</td>` +
        `</tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;color:#1a1a1a">
      <h2 style="color:#ea580c">Yeni Toplu Sipariş / Teklif Talebi</h2>
      <p><strong>Firma:</strong> ${escapeHtml(company || "—")}</p>
      <p><strong>Yetkili:</strong> ${escapeHtml(contactName)}</p>
      <p><strong>E-posta:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ""}
      <table style="width:100%;border-collapse:collapse;margin:14px 0">
        <thead>
          <tr style="background:#f8f8f8;text-align:left">
            <th style="padding:6px 10px;border-bottom:2px solid #ddd">Ürün</th>
            <th style="padding:6px 10px;border-bottom:2px solid #ddd">SKU</th>
            <th style="padding:6px 10px;border-bottom:2px solid #ddd;text-align:right">Adet</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p><strong>Toplam kalem:</strong> ${items.length} &nbsp;|&nbsp; <strong>Toplam adet:</strong> ${totalUnits}</p>
      ${note ? `<p><strong>Not:</strong><br/>${escapeHtml(note).replace(/\n/g, "<br/>")}</p>` : ""}
    </div>`;

  const result = await sendEmail({
    to: STORE_OWNER || email,
    replyTo: email,
    subject: `Teklif Talebi — ${company || contactName} (${items.length} kalem)`,
    html,
  });

  return NextResponse.json({
    ok: true,
    summary: { lineCount: items.length, totalUnits },
    delivered: result.sent,
    message: result.sent
      ? "Teklif talebiniz alındı. Ekibimiz en kısa sürede dönüş yapacaktır."
      : "Teklif talebiniz alındı. (E-posta servisi yapılandırılmadığı için bildirim loglandı; sizinle iletişime geçilecektir.)",
  });
}
