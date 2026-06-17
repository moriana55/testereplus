"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Genel Bilgi",
    message: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Mesaj gönderilemedi. Lütfen tekrar deneyin.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border border-border rounded-2xl p-7 md:p-8 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Mesajınız Alındı!</h2>
        <p className="text-text-secondary mb-6">En kısa sürede size geri dönüş yapacağız.</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", phone: "", subject: "Genel Bilgi", message: "" });
          }}
          className="text-accent hover:text-accent-hover font-semibold text-sm"
        >
          Yeni Mesaj Gönder
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-7 md:p-8">
      <h2 className="text-xl font-bold text-text-primary mb-6">Bize Yazın</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Ad Soyad</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              placeholder="Adınız"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">E-posta</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              placeholder="ornek@email.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Telefon</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            placeholder="05XX XXX XX XX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Konu</label>
          <select
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
          >
            <option>Genel Bilgi</option>
            <option>Toplu Sipariş / Teklif</option>
            <option>Teknik Destek</option>
            <option>Sipariş Takibi</option>
            <option>İade / Değişim</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Mesajınız</label>
          <textarea
            rows={5}
            required
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
            placeholder="Mesajınızı buraya yazın..."
          />
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
          className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-accent/20 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            <>
              <Send size={18} />
              Gönder
            </>
          )}
        </button>
      </form>
    </div>
  );
}
