import { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Testere Plus ile iletişime geçin. Telefon, e-posta, WhatsApp veya iletişim formu.",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "İletişim", url: "/iletisim" }]} />
      <nav className="text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
        <span className="mx-2 text-border">/</span>
        <span className="text-text-primary font-medium">İletişim</span>
      </nav>

      <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">İletişim</h1>
      <p className="text-text-secondary text-center mb-10">Size yardımcı olmaktan memnuniyet duyarız</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Contact info */}
        <div className="space-y-4">
          {[
            { icon: Phone, title: "Telefon", content: "0555 123 45 67", href: "tel:+905551234567" },
            { icon: Mail, title: "E-posta", content: "info@testereplus.com", href: "mailto:info@testereplus.com" },
            { icon: MapPin, title: "Adres", content: "İstanbul, Türkiye" },
            { icon: Clock, title: "Çalışma Saatleri", content: "Pzt - Cmt: 09:00 - 18:00" },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-border rounded-2xl p-5">
              <div className="w-10 h-10 bg-accent-bg rounded-xl flex items-center justify-center mb-3">
                <item.icon size={18} className="text-accent" />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
              {item.href ? (
                <a href={item.href} className="text-sm text-text-secondary hover:text-accent transition-colors">
                  {item.content}
                </a>
              ) : (
                <p className="text-sm text-text-secondary">{item.content}</p>
              )}
            </div>
          ))}

          <a
            href="https://wa.me/905551234567"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-2xl font-semibold transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.347 0-4.518-.809-6.235-2.16l-.436-.35-3.022 1.012 1.012-3.022-.35-.436A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            WhatsApp ile Yazın
          </a>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
