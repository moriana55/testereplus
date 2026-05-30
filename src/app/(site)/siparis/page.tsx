"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function SiparisOnayPage() {
  const params = useSearchParams();
  const orderId = params.get("id") || "TP-XXXXX";

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-600" />
      </div>

      <h1 className="text-3xl font-bold mb-3">Siparişiniz Alındı!</h1>
      <p className="text-text-muted mb-2">Teşekkür ederiz. Siparişiniz başarıyla oluşturuldu.</p>

      <div className="inline-flex items-center gap-2 bg-bg-secondary border border-border rounded-xl px-5 py-3 mt-4 mb-8">
        <Package size={18} className="text-accent" />
        <span className="text-sm text-text-secondary">Sipariş No:</span>
        <span className="font-bold text-text-primary">{orderId}</span>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 text-left mb-8">
        <h2 className="font-bold mb-4">Sonraki Adımlar</h2>
        <ul className="space-y-3 text-sm text-text-secondary">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
            Siparişiniz en kısa sürede hazırlanacak.
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
            Kargoya verildiğinde SMS/e-posta ile bilgilendirileceksiniz.
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
            Sorularınız için WhatsApp üzerinden ulaşabilirsiniz.
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/urunler"
          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Alışverişe Devam Et
          <ArrowRight size={18} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 border border-border hover:bg-bg-secondary px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Ana Sayfa
        </Link>
      </div>
    </div>
  );
}
