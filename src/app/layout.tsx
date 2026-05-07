import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/cart-drawer";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Testere Plus — Profesyonel Kesici Takımlar",
    template: "%s | Testere Plus",
  },
  description:
    "Daire testere bıçakları, freze uçları, şerit testereler ve aksesuarlar. Freud, Netmak, Kronberg markalarında profesyonel kesici takımlar.",
  keywords: [
    "testere bıçağı",
    "daire testere",
    "freze bıçağı",
    "şerit testere",
    "kesici takım",
    "CNC freze",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary font-[var(--font-inter)]">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
