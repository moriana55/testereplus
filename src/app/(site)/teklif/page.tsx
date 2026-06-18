import { Metadata } from "next";
import { QuoteForm } from "@/components/quote-form";
import { FileText, Truck, Percent, Headset } from "lucide-react";

export const metadata: Metadata = {
  title: "Toplu Sipariş ve Teklif İste | B2B Kesici Takım Tedariği | Testere Plus",
  description:
    "Atölye, üretim ve toptan alımlarınız için toplu sipariş teklifi alın. Daire testere bıçağı, freze bıçağı ve kesici takımlarda kurumsal/B2B fiyat avantajı. Birden fazla ürün ve adet girerek hızlıca teklif isteyin.",
  alternates: { canonical: "/teklif" },
};

const perks = [
  { icon: Percent, title: "Toplu Alım İndirimi", desc: "Adede göre özel B2B fiyatlandırma" },
  { icon: FileText, title: "Hızlı Teklif", desc: "Talebiniz aynı gün değerlendirilir" },
  { icon: Truck, title: "Kurumsal Sevkiyat", desc: "Toplu sevkiyat ve faturalı satış" },
  { icon: Headset, title: "Teknik Danışmanlık", desc: "Doğru kesici takım seçimi için destek" },
];

export default function TeklifPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="relative bg-gradient-to-r from-bg-dark to-bg-dark-light rounded-2xl p-8 mb-8 overflow-hidden border-l-4 border-accent">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-xs font-medium text-gray-300 mb-3">
            B2B · Kurumsal
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Toplu Sipariş / Teklif İste</h1>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            Atölyeniz, üretiminiz veya toptan alımlarınız için birden fazla ürünü adetleriyle birlikte ekleyin;
            size özel B2B teklifi hazırlayalım. Ödeme gerektirmez — yalnızca teklif talebi oluşturursunuz.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {perks.map((p) => (
          <div key={p.title} className="bg-white border border-border rounded-xl p-4 hover:border-accent/40 hover:shadow-sm transition-all">
            <div className="w-10 h-10 bg-accent-bg rounded-lg flex items-center justify-center mb-3">
              <p.icon size={20} className="text-accent" />
            </div>
            <p className="font-semibold text-sm text-text-primary">{p.title}</p>
            <p className="text-xs text-text-muted mt-0.5">{p.desc}</p>
          </div>
        ))}
      </div>

      <QuoteForm />
    </div>
  );
}
