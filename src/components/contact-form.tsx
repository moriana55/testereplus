"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
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
          onClick={() => setSubmitted(false)}
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
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              placeholder="Adınız"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">E-posta</label>
            <input
              type="email"
              required
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              placeholder="ornek@email.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Telefon</label>
          <input
            type="tel"
            className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            placeholder="05XX XXX XX XX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Konu</label>
          <select className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all">
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
            className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
            placeholder="Mesajınızı buraya yazın..."
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-accent/20"
        >
          <Send size={18} />
          Gönder
        </button>
      </form>
    </div>
  );
}
