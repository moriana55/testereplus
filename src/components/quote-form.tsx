"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Trash2, Send, CheckCircle, AlertCircle, Loader2, FileText } from "lucide-react";

interface Line {
  name: string;
  sku: string;
  quantity: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emptyLine(): Line {
  return { name: "", sku: "", quantity: 1 };
}

export function QuoteForm() {
  const searchParams = useSearchParams();
  const [lines, setLines] = useState<Line[]>([emptyLine()]);
  const [contact, setContact] = useState({ company: "", contactName: "", email: "", phone: "", note: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Ürün sayfasındaki "Teklif İste" bağlantısından ön-doldurma.
  useEffect(() => {
    const urun = searchParams.get("urun");
    const sku = searchParams.get("sku");
    if (urun) {
      setLines([{ name: urun, sku: sku || "", quantity: 10 }]);
    }
  }, [searchParams]);

  const totalUnits = lines.reduce((s, l) => s + (Number.isFinite(l.quantity) ? Math.max(0, l.quantity) : 0), 0);
  const validLineCount = lines.filter((l) => l.name.trim() && l.quantity >= 1).length;

  function updateLine(i: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }
  function addLine() {
    setLines((prev) => [...prev, emptyLine()]);
  }
  function removeLine(i: number) {
    setLines((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (contact.contactName.trim().length < 2) return setError("Yetkili adı zorunludur.");
    if (!EMAIL_RE.test(contact.email.trim())) return setError("Geçerli bir e-posta giriniz.");
    const items = lines.filter((l) => l.name.trim() && l.quantity >= 1);
    if (items.length === 0) return setError("En az bir ürün ve adet giriniz.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, items }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Teklif gönderilemedi. Lütfen tekrar deneyin.");
        setSubmitting(false);
        return;
      }
      setSuccess(data.message || "Teklif talebiniz alındı.");
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white border border-border rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Teklif Talebiniz Alındı!</h2>
        <p className="text-text-secondary">{success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
      {/* Ürün kalemleri */}
      <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FileText size={20} /> Ürünler
        </h2>
        <div className="space-y-3">
          {lines.map((line, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-7">
                <input
                  type="text"
                  value={line.name}
                  onChange={(e) => updateLine(i, { name: e.target.value })}
                  placeholder="Ürün adı / model"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                />
                <input
                  type="text"
                  value={line.sku}
                  onChange={(e) => updateLine(i, { sku: e.target.value })}
                  placeholder="SKU / kod (opsiyonel)"
                  className="w-full mt-2 px-3 py-2 border border-border rounded-lg text-xs focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => updateLine(i, { quantity: Math.max(1, Math.floor(Number(e.target.value) || 1)) })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  aria-label="Adet"
                />
                <span className="block text-[10px] text-text-muted text-center mt-1">adet</span>
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeLine(i)}
                  disabled={lines.length === 1}
                  className="p-2.5 text-text-muted hover:text-red-500 disabled:opacity-30 transition-colors"
                  aria-label="Kalemi sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLine}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          <Plus size={16} /> Ürün Ekle
        </button>
      </div>

      {/* İletişim + özet */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-bold mb-1">İletişim</h2>
          <input
            type="text"
            value={contact.company}
            onChange={(e) => setContact({ ...contact, company: e.target.value })}
            placeholder="Firma (opsiyonel)"
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
          />
          <input
            type="text"
            required
            value={contact.contactName}
            onChange={(e) => setContact({ ...contact, contactName: e.target.value })}
            placeholder="Yetkili Adı *"
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
          />
          <input
            type="email"
            required
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            placeholder="E-posta *"
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
          />
          <input
            type="tel"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            placeholder="Telefon (opsiyonel)"
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
          />
          <textarea
            rows={3}
            value={contact.note}
            onChange={(e) => setContact({ ...contact, note: e.target.value })}
            placeholder="Not / özel talep (opsiyonel)"
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm resize-none focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
          />
        </div>

        <div className="bg-bg-secondary border border-border rounded-2xl p-5">
          <h3 className="text-sm font-bold mb-2">Teklif Özeti</h3>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-secondary">Kalem sayısı</span>
            <span className="font-semibold">{validLineCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Toplam adet</span>
            <span className="font-semibold">{totalUnits}</span>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 border border-red-200 bg-red-50 text-red-700 rounded-xl p-3 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover text-white py-3.5 rounded-xl font-semibold transition-all disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Gönderiliyor...
            </>
          ) : (
            <>
              <Send size={18} /> Teklif Gönder
            </>
          )}
        </button>
      </div>
    </form>
  );
}
