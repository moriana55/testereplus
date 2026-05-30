"use client";

import { useState, useEffect, type FormEvent } from "react";
import { X, Mail, CheckCircle } from "lucide-react";

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("newsletter-dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem("newsletter-dismissed", "true");
    setVisible(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    localStorage.setItem("newsletter-dismissed", "true");
    localStorage.setItem("newsletter-email", email);
    setSubmitted(true);
    setTimeout(() => setVisible(false), 2000);
  }

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={dismiss} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
          <div className="bg-accent p-6 text-center text-white relative">
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
            <Mail size={36} className="mx-auto mb-3" />
            <h2 className="text-xl font-bold">Fırsatları Kaçırmayın!</h2>
            <p className="text-sm text-white/80 mt-1">Kampanya ve yeni ürünlerden ilk siz haberdar olun.</p>
          </div>

          <div className="p-6">
            {submitted ? (
              <div className="text-center py-4">
                <CheckCircle size={40} className="mx-auto text-green-500 mb-3" />
                <p className="font-semibold">Teşekkürler!</p>
                <p className="text-sm text-text-muted">Bültenimize kaydınız alındı.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  required
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  Abone Ol
                </button>
                <p className="text-xs text-text-muted text-center">
                  İstediğiniz zaman abonelikten çıkabilirsiniz.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
