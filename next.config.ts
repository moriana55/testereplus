import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performans: gzip/br sıkıştırma açık, gereksiz header kapalı
  compress: true,
  poweredByHeader: false,
  // Modern görsel formatları (LCP/bant genişliği için)
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
