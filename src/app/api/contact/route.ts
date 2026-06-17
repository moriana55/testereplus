import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

/**
 * İletişim formu API'si
 *
 * Mesajı sunucu tarafında doğrular ve (anahtar varsa) mağaza sahibine
 * e-posta gönderir. Anahtar yoksa sendEmail no-op olur; form yine başarı döner
 * (mesaj loglanır) — böylece kullanıcı deneyimi bozulmaz.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STORE_OWNER = process.env.EMAIL_STORE_OWNER || process.env.EMAIL_FROM || "";

interface ContactBody {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Geçersiz istek." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();
  const phone = (body.phone || "").trim();
  const subject = (body.subject || "Genel Bilgi").trim();

  const errors: string[] = [];
  if (name.length < 2) errors.push("Ad Soyad zorunludur.");
  if (!EMAIL_RE.test(email)) errors.push("Geçerli bir e-posta giriniz.");
  if (message.length < 10) errors.push("Mesaj en az 10 karakter olmalıdır.");
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, error: errors[0] }, { status: 400 });
  }

  // Basit boyut sınırı (kötüye kullanımı önle)
  if (message.length > 5000) {
    return NextResponse.json({ ok: false, error: "Mesaj çok uzun." }, { status: 400 });
  }

  await sendEmail({
    to: STORE_OWNER || email,
    replyTo: email,
    subject: `İletişim Formu: ${subject} — ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif">
        <h3>Yeni iletişim mesajı</h3>
        <p><strong>Ad Soyad:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-posta:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p><strong>Konu:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Mesaj:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      </div>`,
  });

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
