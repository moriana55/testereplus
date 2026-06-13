/**
 * iyzico Payment Integration
 * Docs: https://dev.iyzipay.com
 *
 * ENV variables needed:
 *   IYZICO_API_KEY
 *   IYZICO_SECRET_KEY
 *   IYZICO_BASE_URL  (sandbox: https://sandbox-api.iyzipay.com | prod: https://api.iyzipay.com)
 */

const API_KEY = process.env.IYZICO_API_KEY || "";
const SECRET_KEY = process.env.IYZICO_SECRET_KEY || "";
const BASE_URL = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";

// ─── Crypto Utils ───
async function generateAuthorizationHeader(uri: string, body: string): Promise<Record<string, string>> {
  const randomString = Math.random().toString(36).slice(2, 14);
  const encoder = new TextEncoder();
  const payload = API_KEY + randomString + SECRET_KEY + body;

  const key = await crypto.subtle.importKey("raw", encoder.encode(SECRET_KEY), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const hashStr = btoa(String.fromCharCode(...new Uint8Array(signature)));

  const authStr = `apiKey:${API_KEY}&randomKey:${randomString}&signature:${hashStr}`;
  return {
    "Authorization": `IYZWS ${btoa(authStr)}`,
    "Content-Type": "application/json",
    "x-iyzi-rnd": randomString,
  };
}

async function iyzicoRequest<T>(path: string, body: Record<string, any>): Promise<T> {
  const bodyStr = JSON.stringify(body);
  const headers = await generateAuthorizationHeader(path, bodyStr);
  const res = await fetch(`${BASE_URL}${path}`, { method: "POST", headers, body: bodyStr });
  if (!res.ok) throw new Error(`iyzico error: ${res.status} ${res.statusText}`);
  return res.json();
}

// ─── Types ───
export interface IyzicoAddress {
  contactName: string;
  city: string;
  country: string;
  address: string;
  zipCode?: string;
}

export interface IyzicoBuyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  identityNumber: string;
  registrationAddress: string;
  ip: string;
  city: string;
  country: string;
  gsmNumber?: string;
}

export interface IyzicoBasketItem {
  id: string;
  name: string;
  category1: string;
  category2?: string;
  itemType: "PHYSICAL" | "VIRTUAL";
  price: string;
}

export interface IyzicoPaymentResult {
  status: string;
  paymentId: string;
  conversationId: string;
  price: number;
  paidPrice: number;
  installment: number;
  fraudStatus: number;
  errorCode?: string;
  errorMessage?: string;
}

// ─── 3D Secure Payment Init ───
export async function initThreeDSPayment(params: {
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: string;
  installment: number;
  callbackUrl: string;
  buyer: IyzicoBuyer;
  shippingAddress: IyzicoAddress;
  billingAddress: IyzicoAddress;
  basketItems: IyzicoBasketItem[];
  paymentCard: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
    registerCard?: number;
  };
}): Promise<{ status: string; threeDSHtmlContent?: string; errorMessage?: string }> {
  return iyzicoRequest("/payment/3dsecure/initialize", {
    locale: "tr",
    conversationId: params.conversationId,
    price: params.price,
    paidPrice: params.paidPrice,
    currency: params.currency || "TRY",
    installment: params.installment || 1,
    callbackUrl: params.callbackUrl,
    paymentChannel: "WEB",
    paymentGroup: "PRODUCT",
    paymentCard: params.paymentCard,
    buyer: params.buyer,
    shippingAddress: params.shippingAddress,
    billingAddress: params.billingAddress,
    basketItems: params.basketItems,
  });
}

// ─── 3D Secure Payment Complete ───
export async function completeThreeDSPayment(paymentId: string, conversationId: string): Promise<IyzicoPaymentResult> {
  return iyzicoRequest("/payment/3dsecure/auth", {
    locale: "tr",
    conversationId,
    paymentId,
  });
}

// ─── Non-3D Payment ───
export async function createPayment(params: {
  conversationId: string;
  price: string;
  paidPrice: string;
  currency?: string;
  installment?: number;
  buyer: IyzicoBuyer;
  shippingAddress: IyzicoAddress;
  billingAddress: IyzicoAddress;
  basketItems: IyzicoBasketItem[];
  paymentCard: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
  };
}): Promise<IyzicoPaymentResult> {
  return iyzicoRequest("/payment/auth", {
    locale: "tr",
    conversationId: params.conversationId,
    price: params.price,
    paidPrice: params.paidPrice,
    currency: params.currency || "TRY",
    installment: params.installment || 1,
    paymentChannel: "WEB",
    paymentGroup: "PRODUCT",
    paymentCard: params.paymentCard,
    buyer: params.buyer,
    shippingAddress: params.shippingAddress,
    billingAddress: params.billingAddress,
    basketItems: params.basketItems,
  });
}

// ─── Refund ───
export async function refundPayment(paymentTransactionId: string, price: string, conversationId: string): Promise<{ status: string; errorMessage?: string }> {
  return iyzicoRequest("/payment/refund", {
    locale: "tr",
    conversationId,
    paymentTransactionId,
    price,
    currency: "TRY",
  });
}

// ─── Cancel ───
export async function cancelPayment(paymentId: string, conversationId: string): Promise<{ status: string; errorMessage?: string }> {
  return iyzicoRequest("/payment/cancel", {
    locale: "tr",
    conversationId,
    paymentId,
  });
}

// ─── Installment Info ───
export async function getInstallmentInfo(binNumber: string, price: string): Promise<any> {
  return iyzicoRequest("/payment/iyzipos/installment", {
    locale: "tr",
    binNumber,
    price,
  });
}

// ─── Checkout Form (hosted page) ───
export async function initCheckoutForm(params: {
  conversationId: string;
  price: string;
  paidPrice: string;
  callbackUrl: string;
  buyer: IyzicoBuyer;
  shippingAddress: IyzicoAddress;
  billingAddress: IyzicoAddress;
  basketItems: IyzicoBasketItem[];
  enabledInstallments?: number[];
}): Promise<{ status: string; token?: string; checkoutFormContent?: string; errorMessage?: string }> {
  return iyzicoRequest("/payment/iyzipos/checkoutform/initialize/auth/ecom", {
    locale: "tr",
    conversationId: params.conversationId,
    price: params.price,
    paidPrice: params.paidPrice,
    currency: "TRY",
    callbackUrl: params.callbackUrl,
    enabledInstallments: params.enabledInstallments || [1, 2, 3, 6, 9],
    buyer: params.buyer,
    shippingAddress: params.shippingAddress,
    billingAddress: params.billingAddress,
    basketItems: params.basketItems,
  });
}

// ─── Checkout Form Result ───
export async function getCheckoutFormResult(token: string): Promise<IyzicoPaymentResult> {
  return iyzicoRequest("/payment/iyzipos/checkoutform/auth/ecom/detail", {
    locale: "tr",
    token,
  });
}
