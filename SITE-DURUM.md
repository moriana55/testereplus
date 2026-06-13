# Site (Frontend) Durum Raporu

Son güncelleme: 2026-06-09

## Tüm Sayfalar

| Sayfa | Yol | Durum |
|-------|-----|-------|
| Ana Sayfa | `/` | Tam — Hero slider, kategoriler, fırsat ürünleri, en çok satanlar, markalar, CTA |
| Ürünler | `/urunler` | Tam — ProductListing, arama, filtre, BreadcrumbSchema |
| Ürün Detay | `/urunler/[slug]` | Tam — Galeri, buy box, sepete ekle, WhatsApp, karşılaştırma, tabs, ilgili ürünler, schema.org, stok bildirimi, yorumlar |
| Kategori | `/kategori/[slug]` | Tam — Breadcrumb, ürün listesi, kategori banner, BreadcrumbSchema |
| Blog | `/blog` | Tam — Kart listesi, kategori badge, tarih, BreadcrumbSchema |
| Blog Yazı | `/blog/[slug]` | Tam — İçerik, ilgili yazılar, CTA |
| Hakkımızda | `/hakkimizda` | Tam — İstatistikler, misyon, neden biz, BreadcrumbSchema |
| İletişim | `/iletisim` | Tam — İletişim formu, bilgiler, WhatsApp, BreadcrumbSchema |
| Sepet | `/sepet` | Tam — Miktar değiştirme, silme, toplam, kupon kodu, WhatsApp sipariş |
| Ödeme | `/odeme` | Tam — 3 adımlı checkout (Adres → Kargo → Ödeme), sipariş özeti |
| Sipariş Onay | `/siparis` | Tam — Teşekkür sayfası, sipariş no, sonraki adımlar |
| Hesabım | `/hesabim` | Tam — Giriş/Kayıt, profil düzenleme, sipariş geçmişi, adres yönetimi |
| Favoriler | `/favorilerim` | Tam — Favori ürün listesi |
| Arama | `/ara?q=` | Tam — Dedicated arama sayfası |
| SSS | `/sss` | Tam — Accordion FAQ |
| Kargo Takip | `/kargo-takip` | Tam — Sipariş no ile kargo sorgulama |
| Karşılaştırma | `/karsilastir` | Tam — Ürün karşılaştırma tablosu |
| 404 | global | Tam — Animasyonlu 404 sayfası |
| sitemap.xml | `/sitemap.xml` | Tam — Dinamik (ürünler + blog + kategoriler) |
| robots.txt | `/robots.txt` | Tam — Search engine yönlendirmesi |

## Componentler

- Header (mega menu, arama, favoriler, hesabım, sepet)
- Footer
- CartDrawer, CartProvider (context)
- AuthProvider (localStorage tabanlı auth)
- FavoritesProvider, FavoriteButton
- ProductCard, ProductListing (filtre/sıralama/grid)
- HeroSlider, ImageGallery, ProductTabs
- AddToCartButton, ContactForm
- ProductSchema, BreadcrumbSchema (JSON-LD)
- ProductReviews (yorum yazma, puan dağılımı)
- StockAlert (stok bildirimi email toplama)
- RecommendedProducts, ComplementaryProduct
- CategoryTree, VariantPicker, MaterialCompatibility
- WhatsAppFloat (floating buton)
- CookieBanner (KVKK uyumlu)
- NewsletterPopup (email toplama)

## Teknik Notlar

- **Veri:** Tüm ürünler `src/lib/data.ts` içinde statik. DB yok.
- **Sepet:** `cart-context.tsx` ile client-side state (localStorage).
- **Auth:** `auth-context.tsx` ile localStorage tabanlı. Backend geçişinde API'ye bağlanacak.
- **Kupon:** Sepet sayfasında çalışan kupon sistemi (hardcoded kuponlar).
- **SEO:** ProductSchema + BreadcrumbSchema tüm sayfalarda. sitemap + robots aktif.
- **Responsive:** Tailwind breakpoints, mobil uyumlu.

## Kalan İşler

| # | İş | Açıklama |
|---|-----|----------|
| 1 | Ödeme Entegrasyonu | iyzico/Stripe API bağlantısı (şu an placeholder) |
| 2 | Ürün Görselleri | Tüm ürünler placeholder icon — gerçek fotoğraf eklenmeli |
| 3 | Backend API | Statik veri → Neon/Supabase DB geçişi |
| 4 | Email Bildirimleri | Sipariş onay, kargo, stok bildirim mailleri (MailPilot ile) |
