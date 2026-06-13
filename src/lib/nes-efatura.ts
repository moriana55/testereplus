/**
 * NES (Netsis E-Belge) e-Fatura / e-Arşiv Integration
 *
 * ENV variables needed:
 *   NES_API_URL        (ör: https://efatura-api.nes.com.tr)
 *   NES_USERNAME
 *   NES_PASSWORD
 *   NES_VKN            (Vergi Kimlik No)
 *   NES_SENDER_ALIAS   (e-Fatura gönderici alias — GİB'den alınır)
 */

const API_URL = process.env.NES_API_URL || "";
const USERNAME = process.env.NES_USERNAME || "";
const PASSWORD = process.env.NES_PASSWORD || "";
const VKN = process.env.NES_VKN || "";
const SENDER_ALIAS = process.env.NES_SENDER_ALIAS || "";

let authToken: string | null = null;
let tokenExpiry = 0;

// ─── Auth ───
async function getToken(): Promise<string> {
  if (authToken && Date.now() < tokenExpiry) return authToken;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });

  if (!res.ok) throw new Error(`NES auth failed: ${res.status}`);
  const data = await res.json();
  authToken = data.token;
  tokenExpiry = Date.now() + 55 * 60 * 1000; // 55 min
  return authToken!;
}

async function nesRequest<T>(method: string, path: string, body?: any): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`NES API error ${res.status}: ${errText}`);
  }
  return res.json();
}

// ─── Types ───
export interface InvoiceLine {
  name: string;
  quantity: number;
  unitCode: string; // "C62" (adet), "KGM" (kg), "MTR" (metre)
  unitPrice: number;
  taxRate: number; // ör: 20 (KDV %20)
  taxAmount: number;
  lineTotal: number;
  discount?: number;
}

export interface InvoiceParty {
  vkn?: string; // Tüzel kişi VKN
  tckn?: string; // Gerçek kişi TCKN
  name: string;
  surname?: string;
  taxOffice?: string;
  address: string;
  city: string;
  district?: string;
  country?: string;
  phone?: string;
  email?: string;
}

export type InvoiceType = "SATIS" | "IADE";
export type DocumentType = "e-Fatura" | "e-Arsiv";

export interface CreateInvoiceParams {
  documentType: DocumentType;
  invoiceType: InvoiceType;
  invoiceNumber?: string; // auto-generated if empty
  issueDate: string; // YYYY-MM-DD
  currency?: string;
  receiver: InvoiceParty;
  lines: InvoiceLine[];
  notes?: string;
  orderNumber?: string;
  dispatchNumber?: string;
}

export interface InvoiceResult {
  uuid: string;
  invoiceNumber: string;
  status: string;
  ettn: string;
  pdfUrl?: string;
  xmlUrl?: string;
}

// ─── Check if receiver is e-Fatura user (GİB registered) ───
export async function checkEFaturaUser(vkn: string): Promise<{ isRegistered: boolean; aliases: string[] }> {
  return nesRequest("GET", `/efatura/check-user?vkn=${vkn}`);
}

// ─── Create e-Fatura ───
export async function createEFatura(params: CreateInvoiceParams): Promise<InvoiceResult> {
  const taxTotal = params.lines.reduce((s, l) => s + l.taxAmount, 0);
  const lineTotal = params.lines.reduce((s, l) => s + l.lineTotal, 0);

  return nesRequest("POST", "/efatura/create", {
    documentType: "EFATURA",
    invoiceType: params.invoiceType,
    invoiceNumber: params.invoiceNumber,
    issueDate: params.issueDate,
    currency: params.currency || "TRY",
    sender: {
      vkn: VKN,
      alias: SENDER_ALIAS,
    },
    receiver: {
      vkn: params.receiver.vkn,
      name: params.receiver.name,
      taxOffice: params.receiver.taxOffice,
      address: params.receiver.address,
      city: params.receiver.city,
      email: params.receiver.email,
    },
    lines: params.lines.map((l, i) => ({
      lineNumber: i + 1,
      name: l.name,
      quantity: l.quantity,
      unitCode: l.unitCode,
      unitPrice: l.unitPrice,
      taxRate: l.taxRate,
      taxAmount: l.taxAmount,
      lineTotal: l.lineTotal,
      discount: l.discount || 0,
    })),
    taxTotal,
    lineExtensionAmount: lineTotal,
    payableAmount: lineTotal + taxTotal,
    notes: params.notes,
    orderReference: params.orderNumber,
    despatchReference: params.dispatchNumber,
  });
}

// ─── Create e-Arşiv (for non-efatura users / individual customers) ───
export async function createEArsiv(params: CreateInvoiceParams): Promise<InvoiceResult> {
  const taxTotal = params.lines.reduce((s, l) => s + l.taxAmount, 0);
  const lineTotal = params.lines.reduce((s, l) => s + l.lineTotal, 0);

  return nesRequest("POST", "/earsiv/create", {
    documentType: "EARSIV",
    invoiceType: params.invoiceType,
    invoiceNumber: params.invoiceNumber,
    issueDate: params.issueDate,
    currency: params.currency || "TRY",
    sender: { vkn: VKN },
    receiver: {
      vkn: params.receiver.vkn,
      tckn: params.receiver.tckn,
      name: params.receiver.name,
      surname: params.receiver.surname,
      taxOffice: params.receiver.taxOffice,
      address: params.receiver.address,
      city: params.receiver.city,
      email: params.receiver.email,
      phone: params.receiver.phone,
    },
    lines: params.lines.map((l, i) => ({
      lineNumber: i + 1,
      name: l.name,
      quantity: l.quantity,
      unitCode: l.unitCode,
      unitPrice: l.unitPrice,
      taxRate: l.taxRate,
      taxAmount: l.taxAmount,
      lineTotal: l.lineTotal,
      discount: l.discount || 0,
    })),
    taxTotal,
    lineExtensionAmount: lineTotal,
    payableAmount: lineTotal + taxTotal,
    notes: params.notes,
    sendType: params.receiver.email ? "ELEKTRONIK" : "KAGIT",
  });
}

// ─── Get Invoice Status ───
export async function getInvoiceStatus(uuid: string): Promise<{ uuid: string; status: string; errorDescription?: string }> {
  return nesRequest("GET", `/invoice/status/${uuid}`);
}

// ─── Get Invoice PDF ───
export async function getInvoicePdf(uuid: string): Promise<Buffer> {
  const token = await getToken();
  const res = await fetch(`${API_URL}/invoice/pdf/${uuid}`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`PDF fetch failed: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// ─── Cancel Invoice ───
export async function cancelInvoice(uuid: string, reason: string): Promise<{ status: string }> {
  return nesRequest("POST", `/invoice/cancel`, { uuid, reason });
}

// ─── List Invoices ───
export async function listInvoices(params: {
  startDate: string;
  endDate: string;
  documentType?: DocumentType;
  page?: number;
  pageSize?: number;
}): Promise<{ invoices: InvoiceResult[]; total: number }> {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
    ...(params.documentType && { documentType: params.documentType === "e-Fatura" ? "EFATURA" : "EARSIV" }),
    page: String(params.page || 1),
    pageSize: String(params.pageSize || 20),
  });
  return nesRequest("GET", `/invoice/list?${query}`);
}

// ─── Helper: Create invoice from order ───
export async function createInvoiceFromOrder(order: {
  id: string;
  customer: InvoiceParty;
  items: { name: string; quantity: number; unitPrice: number; taxRate?: number }[];
  date?: string;
}): Promise<InvoiceResult> {
  const lines: InvoiceLine[] = order.items.map((item) => {
    const rate = item.taxRate ?? 20;
    const lineTotal = item.quantity * item.unitPrice;
    const taxAmount = lineTotal * (rate / 100);
    return {
      name: item.name,
      quantity: item.quantity,
      unitCode: "C62",
      unitPrice: item.unitPrice,
      taxRate: rate,
      taxAmount,
      lineTotal,
    };
  });

  const isEFaturaUser = order.customer.vkn
    ? (await checkEFaturaUser(order.customer.vkn)).isRegistered
    : false;

  const params: CreateInvoiceParams = {
    documentType: isEFaturaUser ? "e-Fatura" : "e-Arsiv",
    invoiceType: "SATIS",
    issueDate: order.date || new Date().toISOString().split("T")[0],
    receiver: order.customer,
    lines,
    orderNumber: order.id,
  };

  return isEFaturaUser ? createEFatura(params) : createEArsiv(params);
}
