import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://testereplus.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Testere Plus — Profesyonel Kesici Takımlar",
    template: "%s | Testere Plus",
  },
  description:
    "Daire testere bıçakları, freze uçları, şerit testereler ve aksesuarlar. Freud, Netmak, Kronberg markalarında profesyonel kesici takımlar.",
  keywords: [
    "testere bıçağı",
    "daire testere bıçağı fiyatları",
    "profesyonel freze bıçağı",
    "şerit testere",
    "kesici takım",
    "CNC freze ucu",
    "ahşap kesim bıçağı",
    "Freud daire testere",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Testere Plus",
    url: SITE_URL,
    title: "Testere Plus — Profesyonel Kesici Takımlar",
    description:
      "Daire testere bıçakları, freze uçları, şerit testereler ve aksesuarlar. Freud, Netmak, Kronberg markalarında profesyonel kesici takımlar.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Testere Plus — Profesyonel Kesici Takımlar",
    description:
      "Daire testere bıçakları, freze uçları, şerit testereler ve aksesuarlar. Profesyonel kesici takımlar.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary font-[var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
