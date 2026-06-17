import { NextResponse } from "next/server";
import { initCheckoutForm, type IyzicoBasketItem } from "@/lib/iyzico";
import { sendEmail, orderConfirmationHtml } from "@/lib/email";

/**
 * Checkout API
 *
 * Görevi:
 *  - Sipariş verisini SUNUCU TARAFINDA doğrular (güvenlik: sınırda doğrulama).
 *  - "card" ödeme + iyzico anahtarı varsa → iyzico Checkout Form başlatır.
 *  - iyzico anahtarı yoksa veya ödeme yöntemi havale/kapıda ise → sipariş kaydı
 *    "alındı" olarak döner (graceful, çökme yok).
 *  - Her durumda sipariş onay e-postasını gönderir (anahtar yoksa no-op loglar).
 *
 * Gizli anahtarlar yalnızca sunucuda okunur; istemciye asla sızmaz.
 */

const IYZICO_CONFIGURED = Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutBody {
  address: {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    district: string;
    address: string;
    postalCode?: string;
    note?: string;
  };
  shipping: string;
  payment: string;
  items: CheckoutItem[];
}

// ─── Doğrulama yardımcıları ───
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\s()-]{7,20}$/;

function validate(body: Partial<CheckoutBody>): string[] {
  const errors: string[] = [];
  const a = body.address;
  if (!a) {
    errors.push("Adres bilgisi eksik.");
    return errors;
  }
  if (!a.fullName?.trim() || a.fullName.trim().length < 3) errors.push("Ad Soyad geçerli değil.");
  if (!a.phone?.trim() || !PHONE_RE.test(a.phone.trim())) errors.push("Telefon numarası geçerli değil.");
  if (!a.email?.trim() || !EMAIL_RE.test(a.email.trim())) errors.push("E-posta adresi geçerli değil.");
  if (!a.city?.trim()) errors.push("İl alanı zorunludur.");
  if (!a.district?.trim()) errors.push("İlçe alanı zorunludur.");
  if (!a.address?.trim() || a.address.trim().length < 10) errors.push("Açık adres en az 10 karakter olmalıdır.");

  if (!body.payment || !["card", "transfer", "door"].includes(body.payment)) {
    errors.push("Geçersiz ödeme yöntemi.");
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push("Sepetinizde ürün bulunmuyor.");
  } else {
    for (const it of body.items) {
      if (!it.id || !it.name || typeof it.price !== "number" || it.price < 0 || typeof it.quantity !== "number" || it.quantity < 1) {
        errors.push("Sepet ürünleri geçersiz.");
        break;
      }
    }
  }
  return errors;
}

function genOrderId(): string {
  return "TP-" + Date.now().toString(36).toUpperCase();
}

export async function POST(request: Request) {
  let body: Partial<CheckoutBody>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: ["Geçersiz istek gövdesi."] }, { status: 400 });
  }

  // 1) Sunucu tarafı doğrulama (fail-closed)
  const errors = validate(body);
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const { address, shipping, payment, items } = body as CheckoutBody;
  const shippingCost = shipping === "express" ? 150 : 0;
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + shippingCost;
  const orderId = genOrderId();

  // 2) Onay e-postası (anahtar yoksa no-op loglar, akışı bozmaz)
  const ownerEmail = process.env.EMAIL_STORE_OWNER;
  await sendEmail({
    to: ownerEmail ? [address.email, ownerEmail] : address.email,
    subject: `Sipariş Onayı — ${orderId}`,
    html: orderConfirmationHtml({
      orderId,
      customerName: address.fullName,
      items,
      total,
    }),
    replyTo: ownerEmail,
  });

  // 3) Kartla ödeme + iyzico yapılandırılmışsa → ödeme formunu başlat
  if (payment === "card") {
    if (!IYZICO_CONFIGURED) {
      // Anahtar yok — istemciye net mesaj, çökme yok.
      return NextResponse.json({
        ok: true,
        orderId,
        paymentConfigured: false,
        message:
          "Online kart ödemesi henüz yapılandırılmadı. Siparişiniz alındı; ödeme için sizinle WhatsApp üzerinden iletişime geçeceğiz.",
      });
    }

    try {
      const origin = new URL(request.url).origin;
      const basketItems: IyzicoBasketItem[] = items.map((i) => ({
        id: i.id,
        name: i.name,
        category1: "Kesici Takımlar",
        itemType: "PHYSICAL",
        price: (i.price * i.quantity).toFixed(2),
      }));
      // Kargo bedeli ayrı kalem olarak eklenir ki price === sum(basket) eşitliği sağlansın.
      if (shippingCost > 0) {
        basketItems.push({
          id: "shipping",
          name: "Kargo",
          category1: "Kargo",
          itemType: "VIRTUAL",
          price: shippingCost.toFixed(2),
        });
      }

      const [name, ...rest] = address.fullName.trim().split(" ");
      const surname = rest.join(" ") || name;

      const result = await initCheckoutForm({
        conversationId: orderId,
        price: total.toFixed(2),
        paidPrice: total.toFixed(2),
        callbackUrl: `${origin}/api/checkout/callback?orderId=${orderId}`,
        buyer: {
          id: address.email,
          name,
          surname,
          email: address.email,
          identityNumber: "11111111111", // bireysel müşteri varsayılanı; e-Arşiv için TCKN admin tarafında güncellenir
          registrationAddress: address.address,
          ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "85.34.78.112",
          city: address.city,
          country: "Turkey",
          gsmNumber: address.phone,
        },
        shippingAddress: {
          contactName: address.fullName,
          city: address.city,
          country: "Turkey",
          address: address.address,
          zipCode: address.postalCode,
        },
        billingAddress: {
          contactName: address.fullName,
          city: address.city,
          country: "Turkey",
          address: address.address,
          zipCode: address.postalCode,
        },
        basketItems,
      });

      if (result.status !== "success" || !result.checkoutFormContent) {
        return NextResponse.json(
          { ok: false, errors: [result.errorMessage || "Ödeme başlatılamadı. Lütfen tekrar deneyin."] },
          { status: 502 },
        );
      }

      return NextResponse.json({
        ok: true,
        orderId,
        paymentConfigured: true,
        checkoutFormContent: result.checkoutFormContent,
        token: result.token,
      });
    } catch (err) {
      console.error("[checkout] iyzico hatası:", err);
      return NextResponse.json(
        { ok: false, errors: ["Ödeme servisine ulaşılamadı. Lütfen daha sonra tekrar deneyin."] },
        { status: 502 },
      );
    }
  }

  // 4) Havale / Kapıda ödeme → sipariş alındı
  return NextResponse.json({
    ok: true,
    orderId,
    paymentConfigured: false,
    message:
      payment === "transfer"
        ? "Siparişiniz alındı. Havale/EFT bilgileri e-posta ile gönderilecektir."
        : "Siparişiniz alındı. Ödemeyi teslimat sırasında yapabilirsiniz.",
  });
}
