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
      <div className="bg-gradient-to-r from-bg-dark to-bg-dark-light rounded-2xl p-8 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Toplu Sipariş / Teklif İste</h1>
        <p className="text-gray-400 max-w-2xl">
          Atölyeniz, üretiminiz veya toptan alımlarınız için birden fazla ürünü adetleriyle birlikte ekleyin;
          size özel B2B teklifi hazırlayalım. Ödeme gerektirmez — yalnızca teklif talebi oluşturursunuz.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {perks.map((p) => (
          <div key={p.title} className="bg-white border border-border rounded-xl p-4">
            <p.icon size={22} className="text-accent mb-2" />
            <p className="font-semibold text-sm text-text-primary">{p.title}</p>
            <p className="text-xs text-text-muted mt-0.5">{p.desc}</p>
          </div>
        ))}
      </div>

      <QuoteForm />
    </div>
  );
}
