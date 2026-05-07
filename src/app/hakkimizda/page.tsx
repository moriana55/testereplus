import { Metadata } from "next";
import Link from "next/link";
import { Award, Users, Truck, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Testere Plus — Türkiye'nin güvenilir kesici takım tedarikçisi.",
};

const stats = [
  { icon: Clock, value: "15+", label: "Yıllık Deneyim" },
  { icon: Users, value: "5.000+", label: "Mutlu Müşteri" },
  { icon: Award, value: "10+", label: "Dünya Markası" },
  { icon: Truck, value: "50.000+", label: "Teslimat" },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
        <span className="mx-2 text-border">/</span>
        <span className="text-text-primary font-medium">Hakkımızda</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-text-primary">
          Profesyonel Kesici Takımlarda <span className="text-accent">Güvenilir Adres</span>
        </h1>

        <p className="text-text-secondary text-center mb-12 leading-relaxed">
          Testere Plus olarak, endüstriyel kesici takımlar ve aksesuarlar konusunda yılların deneyimiyle
          müşterilerimize en kaliteli ürünleri sunuyoruz. Freud, Netmak, Kronberg, Bosch gibi dünya
          markalarının yetkili distribütörüyüz.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-border rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-accent-bg rounded-xl mx-auto mb-3 flex items-center justify-center">
                <stat.icon size={24} className="text-accent" />
              </div>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-border rounded-2xl p-7">
            <h2 className="text-lg font-bold text-text-primary mb-3">Misyonumuz</h2>
            <p className="text-text-secondary leading-relaxed">
              Türkiye&apos;deki ahşap, metal ve kompozit işleme sektörüne en kaliteli kesici takımları,
              uygun fiyatlarla ve hızlı teslimatla ulaştırmak. Müşterilerimizin üretim verimliliğini
              artırmak için teknik destek ve danışmanlık hizmeti sunuyoruz.
            </p>
          </div>

          <div className="bg-white border border-border rounded-2xl p-7">
            <h2 className="text-lg font-bold text-text-primary mb-3">Neden Biz?</h2>
            <ul className="space-y-3 text-text-secondary">
              {[
                "Orijinal ve garantili ürünler",
                "Tüm siparişlerde ücretsiz kargo",
                "Teknik danışmanlık ve ürün seçim desteği",
                "Hızlı teslimat ve kapıda ödeme imkanı",
                "7/24 WhatsApp üzerinden iletişim",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
