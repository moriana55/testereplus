# Site (Frontend) Durum Raporu

Son güncelleme: 2026-05-17

## Mevcut Sayfalar

| Sayfa | Yol | Durum |
|-------|-----|-------|
| Ana Sayfa | `/` | Tam — Hero slider, kategoriler, fırsat ürünleri, en çok satanlar, markalar, CTA |
| Ürünler | `/urunler` | Tam — ProductListing component, arama, filtre |
| Ürün Detay | `/urunler/[slug]` | Tam — Galeri, buy box, sepete ekle, WhatsApp, karşılaştırma tablosu, tabs, ilgili ürünler, schema.org |
| Kategori | `/kategori/[slug]` | Tam — Breadcrumb, ürün listesi, kategori banner |
| Blog | `/blog` | Tam — Kart listesi, kategori badge, tarih |
| Blog Yazı | `/blog/[slug]` | Tam — İçerik, ilgili yazılar, CTA |
| Hakkımızda | `/hakkimizda` | Tam — İstatistikler, misyon, neden biz |
| İletişim | `/iletisim` | Tam — İletişim formu, bilgiler, WhatsApp |
| 404 | global | Tam — Animasyonlu 404 sayfası |

## Mevcut Componentler

- Header, Footer, CartDrawer, CartProvider (context)
- ProductCard, ProductListing (filtre/sıralama/grid)
- HeroSlider, ImageGallery, ProductTabs
- AddToCartButton, ContactForm
- ProductSchema (JSON-LD)
- RecommendedProducts, ComplementaryProduct
- CategoryTree, VariantPicker, MaterialCompatibility

## Eksikler & Yapılması Gerekenler

### Kritik (E-ticaret için şart)

| # | Eksik | Açıklama |
|---|-------|----------|
| 1 | **Sepet Sayfası** | `/sepet` — CartDrawer var ama ayrı sayfa yok. Miktar değiştirme, silme, toplam vs. |
| 2 | **Ödeme/Checkout** | `/odeme` — Adres formu, kargo seçimi, ödeme yöntemi (iyzico), sipariş özeti |
| 3 | **Sipariş Onay** | `/siparis/[id]` — Başarılı ödeme sonrası teşekkür & sipariş detayı |
| 4 | **Hesabım** | `/hesabim` — Kullanıcı auth, sipariş geçmişi, adres defteri, şifre değiştir |
| 5 | **Ödeme Entegrasyonu** | iyzico/Stripe API bağlantısı (şu an admin ayarlarda key var ama bağlı değil) |

### Önemli (Conversion & SEO)

| # | Eksik | Açıklama |
|---|-------|----------|
| 6 | **Arama Sayfası** | `/ara?q=` — Dedicated search results page (şu an sadece ürünler içi filtre) |
| 7 | **sitemap.xml** | Dinamik sitemap (ürünler + blog + kategoriler) — şu an yok |
| 8 | **robots.txt** | Yok — search engine yönlendirmesi eksik |
| 9 | **Ürün Görselleri** | Tüm ürünler placeholder icon gösteriyor, gerçek görsel yok |
| 10 | **Favoriler/Wishlist** | Ürün kartında kalp var mı yok mu? Favorileme sistemi |
| 11 | **Ürün Yorumları** | Detay sayfada rating gösteriliyor (hardcoded 4.0) ama yorum sistemi yok |
| 12 | **Stok bildirimi** | "Stokta yok" ürünler için email ile bilgilendirme |

### Nice to Have

| # | Eksik | Açıklama |
|---|-------|----------|
| 13 | **Karşılaştırma Sayfası** | `/karsilastir` — Birden fazla ürünü yan yana kıyasla |
| 14 | **Kupon/İndirim Kodu** | Sepet/ödeme'de kupon girişi (admin'de kupon yönetimi var) |
| 15 | **SSS / FAQ** | `/sss` — Sıkça sorulan sorular |
| 16 | **Kargo Takibi (site)** | `/kargo-takip` — Müşterinin sipariş no ile kargo sorgulaması |
| 17 | **Cookie Banner** | KVKK/GDPR uyumlu çerez bildirimi |
| 18 | **WhatsApp Floating** | Sabit floating WhatsApp butonu (her sayfada) |
| 19 | **Newsletter Popup** | Email toplama popup/banner |
| 20 | **Breadcrumb Schema** | Tüm sayfalara BreadcrumbList JSON-LD (şu an sadece Product var) |

## Teknik Notlar

- **Veri:** Tüm ürünler `src/lib/data.ts` içinde statik (486 satır). DB yok.
- **Sepet:** `cart-context.tsx` ile client-side state (localStorage). Çalışıyor.
- **Auth:** Site tarafında kullanıcı auth sistemi yok. Admin ayrı.
- **API Routes:** Site tarafında hiçbir API route yok. Tamamı statik/client.
- **SEO:** Ürün detayda ProductSchema (JSON-LD) var. Diğer sayfalarda Metadata export var. sitemap/robots eksik.
- **Responsive:** Tailwind breakpoints kullanılıyor, mobil uyumlu.
- **Görsel:** Ürün görselleri placeholder icon — gerçek fotoğraf eklenmeli.

## Öncelik Sırası

1. sitemap.xml + robots.txt (5 dk, SEO için şart)
2. Sepet sayfası (CartDrawer'dan genişlet)
3. Arama sayfası
4. WhatsApp floating button
5. Checkout flow (iyzico entegrasyonu ile birlikte)
6. Hesabım (auth gerekli)
7. Ürün yorumları
8. Gerçek ürün görselleri (content işi)
