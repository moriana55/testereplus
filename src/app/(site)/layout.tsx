import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { CartDrawer } from "@/components/cart-drawer";
import { CookieBanner } from "@/components/cookie-banner";
import { NewsletterPopup } from "@/components/newsletter-popup";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <FavoritesProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <CookieBanner />
        <NewsletterPopup />
      </FavoritesProvider>
    </CartProvider>
  );
}
