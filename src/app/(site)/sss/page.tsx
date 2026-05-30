"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

const faqData = [
  {
    category: "Sipariş & Ödeme",
    items: [
      { q: "Nasıl sipariş verebilirim?", a: "Ürünleri sepete ekleyip ödeme adımlarını tamamlayabilir veya WhatsApp üzerinden doğrudan sipariş verebilirsiniz." },
      { q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?", a: "Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerimiz mevcuttur." },
      { q: "Fatura kesiliyor mu?", a: "Evet, tüm siparişlere e-fatura kesilmektedir. Kurumsal fatura için sipariş notuna şirket bilgilerinizi yazabilirsiniz." },
      { q: "Taksit imkânı var mı?", a: "Kredi kartı ile yapılan ödemelerde 3, 6 ve 9 taksit seçenekleri mevcuttur." },
    ],
  },
  {
    category: "Kargo & Teslimat",
    items: [
      { q: "Kargo ücreti ne kadar?", a: "Tüm siparişlerde kargo ücretsizdir." },
      { q: "Kargom ne zaman gelir?", a: "Siparişler genellikle 1-3 iş günü içinde teslim edilmektedir. Hızlı kargo seçeneği ile 1-2 iş günü içinde teslimat yapılır." },
      { q: "Kargo takibi yapabilir miyim?", a: "Evet, siparişiniz kargoya verildikten sonra takip numarası SMS ve e-posta ile paylaşılır. Kargo Takip sayfamızdan da sorgulayabilirsiniz." },
      { q: "Hangi kargo firması ile gönderim yapıyorsunuz?", a: "Yurtiçi Kargo ve Aras Kargo ile çalışmaktayız." },
    ],
  },
  {
    category: "İade & Değişim",
    items: [
      { q: "İade koşulları nelerdir?", a: "Ürünü teslim aldıktan sonra 14 gün içinde, kullanılmamış ve orijinal ambalajında iade edebilirsiniz." },
      { q: "İade kargo ücreti kime ait?", a: "Ürün ayıplı veya hatalı gönderilmişse iade kargo ücreti bize aittir. Cayma hakkı kapsamındaki iadelerde kargo ücreti müşteriye aittir." },
      { q: "İade işlemi ne kadar sürer?", a: "Ürün elimize ulaştıktan sonra 3 iş günü içinde kontrol edilir ve iade işlemi başlatılır. Ödeme iadesi 5-10 iş günü içinde gerçekleşir." },
    ],
  },
  {
    category: "Ürünler",
    items: [
      { q: "Ürünler orijinal mi?", a: "Evet, tüm ürünlerimiz orijinaldir ve yetkili distribütörlerden temin edilmektedir. Orijinallik garantisi sunuyoruz." },
      { q: "Toplu alım indirimi var mı?", a: "Evet, 10 adet ve üzeri siparişlerde toplu alım indirimi uygulanmaktadır. Detaylı bilgi için bizimle iletişime geçin." },
      { q: "Hangi malzeme için hangi testere bıçağını kullanmalıyım?", a: "Ürün detay sayfalarında malzeme uyumluluk tablosu bulunmaktadır. Ayrıca WhatsApp üzerinden danışmanlık hizmeti alabilirsiniz." },
    ],
  },
];

export default function SSSPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const filtered = faqData.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        !search.trim() ||
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-3">Sıkça Sorulan Sorular</h1>
      <p className="text-text-muted text-center mb-8">Merak ettiğiniz soruların yanıtlarını burada bulabilirsiniz.</p>

      <div className="relative mb-10">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Soru ara..."
          className="w-full pl-11 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-text-muted py-10">Aramanızla eşleşen soru bulunamadı.</p>
      ) : (
        <div className="space-y-8">
          {filtered.map((cat) => (
            <div key={cat.category}>
              <h2 className="text-lg font-bold mb-4 text-accent">{cat.category}</h2>
              <div className="space-y-2">
                {cat.items.map((item, i) => {
                  const key = `${cat.category}-${i}`;
                  const isOpen = openItems.has(key);
                  return (
                    <div key={key} className="border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-secondary transition-colors"
                      >
                        <span className="font-medium text-sm pr-4">{item.q}</span>
                        <ChevronDown
                          size={18}
                          className={`text-text-muted shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-bg-secondary rounded-2xl p-6 text-center">
        <p className="font-medium mb-2">Sorunuza yanıt bulamadınız mı?</p>
        <p className="text-sm text-text-muted mb-4">WhatsApp üzerinden bize ulaşın, hemen yardımcı olalım.</p>
        <a
          href="https://wa.me/905551234567?text=Merhaba%2C%20bir%20sorum%20var."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          WhatsApp ile Sorun
        </a>
      </div>
    </div>
  );
}
