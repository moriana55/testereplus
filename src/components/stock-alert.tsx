"use client";

import { useState } from "react";
import { Bell, CheckCircle } from "lucide-react";

export function StockAlert({ productId, productName }: { productId: string; productName: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const alerts = JSON.parse(localStorage.getItem("tp_stock_alerts") || "[]");
    alerts.push({ productId, productName, email, date: new Date().toISOString() });
    localStorage.setItem("tp_stock_alerts", JSON.stringify(alerts));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
        <CheckCircle size={16} />
        Stok geldiğinde bilgilendirileceksiniz.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Bell size={16} className="text-amber-600" />
        <span className="text-sm font-medium text-amber-800">Stok Bildirimi Al</span>
      </div>
      <p className="text-xs text-amber-700 mb-3">Bu ürün stoğa geldiğinde size e-posta ile bildirim gönderelim.</p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta adresiniz"
          className="flex-1 px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
        />
        <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Bildir
        </button>
      </div>
    </form>
  );
}
