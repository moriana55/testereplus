export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  expiresAt?: string;
  usageLimit?: number;
}

const coupons: Coupon[] = [
  { code: "HOSGELDIN", type: "percent", value: 10, minOrder: 500, maxDiscount: 200 },
  { code: "TESTERE50", type: "fixed", value: 50, minOrder: 300 },
  { code: "YUZDE15", type: "percent", value: 15, minOrder: 1000, maxDiscount: 500 },
  { code: "KARGO", type: "fixed", value: 150, minOrder: 0 },
];

export function validateCoupon(code: string, orderTotal: number): { valid: boolean; coupon?: Coupon; discount?: number; message: string } {
  const coupon = coupons.find((c) => c.code === code.toUpperCase().trim());
  if (!coupon) return { valid: false, message: "Geçersiz kupon kodu." };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { valid: false, message: "Bu kuponun süresi dolmuş." };
  if (orderTotal < coupon.minOrder) return { valid: false, message: `Minimum sipariş tutarı: ${coupon.minOrder.toLocaleString("tr-TR")} ₺` };

  let discount = coupon.type === "percent" ? (orderTotal * coupon.value) / 100 : coupon.value;
  if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
  if (discount > orderTotal) discount = orderTotal;

  return { valid: true, coupon, discount: Math.round(discount), message: `${discount.toLocaleString("tr-TR")} ₺ indirim uygulandı!` };
}
