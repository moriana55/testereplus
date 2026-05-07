export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  categorySlug: string;
  specs: Record<string, string>;
  description: string;
  inStock: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    slug: "daire-testere-bicaklari",
    name: "Daire Testere Bıçakları",
    description: "Ahşap, metal, aluminyum ve kompozit kesim için profesyonel daire testere bıçakları",
    image: "/images/cat-daire-testere.jpg",
    productCount: 48,
  },
  {
    slug: "freze-bicaklari",
    name: "Freze Bıçakları",
    description: "CNC ve el frezesi için göbekli, saplı ve değiştirilebilir jiletli freze bıçakları",
    image: "/images/cat-freze.jpg",
    productCount: 35,
  },
  {
    slug: "serit-testereler",
    name: "Şerit Testereler",
    description: "Ahşap, metal ve gıda sektörü için yüksek performanslı şerit testere bıçakları",
    image: "/images/cat-serit.jpg",
    productCount: 22,
  },
  {
    slug: "matkap-uclari",
    name: "Matkap Uçları",
    description: "HSS, karbür ve panç matkap uçları — her malzeme için doğru seçim",
    image: "/images/cat-matkap.jpg",
    productCount: 18,
  },
  {
    slug: "aksesuarlar",
    name: "Aksesuarlar",
    description: "CNC pensleri, bilezikler, anahtarlar ve montaj aparatları",
    image: "/images/cat-aksesuar.jpg",
    productCount: 28,
  },
  {
    slug: "jiletler-planyalar",
    name: "Jiletler & Planyalar",
    description: "Değiştirilebilir jiletler ve planya bıçakları",
    image: "/images/cat-jilet.jpg",
    productCount: 16,
  },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "freud-aluminyum-daire-testere-250x80",
    name: "Freud Alüminyum Daire Testere Bıçağı 250x2.8x30 Z80",
    brand: "Freud",
    price: 2450,
    oldPrice: 2890,
    image: "/images/product-1.jpg",
    category: "Daire Testere Bıçakları",
    categorySlug: "daire-testere-bicaklari",
    specs: {
      "Çap": "250 mm",
      "Kalınlık": "2.8 mm",
      "Delik": "30 mm",
      "Diş Sayısı": "80",
      "Malzeme": "Karbür uçlu",
      "Kullanım": "Alüminyum kesim",
    },
    description: "Freud LU5B serisi, alüminyum profil ve levha kesiminde üstün performans sunar. Negatif diş açısı sayesinde titreşimsiz, temiz kesim sağlar.",
    inStock: true,
  },
  {
    id: "2",
    slug: "netmak-cok-yonlu-daire-testere",
    name: "Netmak Çok Yönlü Kesim Daire Testere Bıçağı 300x96",
    brand: "Netmak",
    price: 1890,
    image: "/images/product-2.jpg",
    category: "Daire Testere Bıçakları",
    categorySlug: "daire-testere-bicaklari",
    specs: {
      "Çap": "300 mm",
      "Kalınlık": "3.2 mm",
      "Delik": "30 mm",
      "Diş Sayısı": "96",
      "Malzeme": "Karbür uçlu",
      "Kullanım": "Çok yönlü kesim",
    },
    description: "Netmak çok yönlü kesim testere bıçağı, ahşap, MDF, sunta ve laminant kesimlerinde mükemmel yüzey kalitesi sağlar.",
    inStock: true,
  },
  {
    id: "3",
    slug: "tideway-kanal-tarama-bicagi",
    name: "Tideway Kanal Tarama Bıçağı 12mm Saplı",
    brand: "Tideway",
    price: 340,
    oldPrice: 420,
    image: "/images/product-3.jpg",
    category: "Freze Bıçakları",
    categorySlug: "freze-bicaklari",
    specs: {
      "Sap Çapı": "12 mm",
      "Kesim Çapı": "18 mm",
      "Kesim Derinliği": "20 mm",
      "Malzeme": "Karbür uçlu",
    },
    description: "Tideway kanal tarama bıçağı, düz yüzey temizleme ve kanal tarama işlemleri için idealdir.",
    inStock: true,
  },
  {
    id: "4",
    slug: "kronberg-aluminyum-pvc-testere-350",
    name: "Kronberg Alüminyum & PVC Kesim Daire Testere 350x108",
    brand: "Kronberg",
    price: 3200,
    image: "/images/product-4.jpg",
    category: "Daire Testere Bıçakları",
    categorySlug: "daire-testere-bicaklari",
    specs: {
      "Çap": "350 mm",
      "Kalınlık": "3.5 mm",
      "Delik": "30 mm",
      "Diş Sayısı": "108",
      "Malzeme": "TCT Karbür",
      "Kullanım": "Alüminyum & PVC",
    },
    description: "Kronberg profesyonel seri, alüminyum ve PVC profil kesiminde çapaksız sonuç verir. Uzun ömürlü karbür dişler.",
    inStock: true,
  },
  {
    id: "5",
    slug: "gkg-hss-freze-testere-200",
    name: "GKG HSS Freze Testere 200x2.0x32 Z128",
    brand: "GKG",
    price: 1650,
    oldPrice: 1950,
    image: "/images/product-5.jpg",
    category: "Daire Testere Bıçakları",
    categorySlug: "daire-testere-bicaklari",
    specs: {
      "Çap": "200 mm",
      "Kalınlık": "2.0 mm",
      "Delik": "32 mm",
      "Diş Sayısı": "128",
      "Malzeme": "HSS",
    },
    description: "GKG HSS freze testere, metal profil ve boru kesiminde hassas ve temiz kesim sağlar.",
    inStock: true,
  },
  {
    id: "6",
    slug: "tideway-rulmanli-pah-bicagi",
    name: "Tideway Rulmanlı Pah Kırma Bıçağı 45°",
    brand: "Tideway",
    price: 280,
    image: "/images/product-6.jpg",
    category: "Freze Bıçakları",
    categorySlug: "freze-bicaklari",
    specs: {
      "Sap Çapı": "8 mm",
      "Açı": "45°",
      "Rulman": "Var",
      "Malzeme": "Karbür uçlu",
    },
    description: "Rulmanlı pah kırma bıçağı, kenar pahı ve dekoratif profil çalışmalarında hassas sonuç verir.",
    inStock: false,
  },
  {
    id: "7",
    slug: "piranha-ahsap-planya-bicagi-310",
    name: "Piranha Ahşap Planya Bıçağı 310x30x3mm",
    brand: "Piranha",
    price: 520,
    image: "/images/product-7.jpg",
    category: "Jiletler & Planyalar",
    categorySlug: "jiletler-planyalar",
    specs: {
      "Uzunluk": "310 mm",
      "Genişlik": "30 mm",
      "Kalınlık": "3 mm",
      "Malzeme": "HSS",
    },
    description: "Piranha HSS planya bıçağı, kalıp ve ahşap planya makineleri için yüksek dayanıklılık sunar.",
    inStock: true,
  },
  {
    id: "8",
    slug: "martin-miller-serit-testere-ahsap",
    name: "Martin Miller Ahşap Şerit Testere 4020x30x0.7",
    brand: "Martin Miller",
    price: 890,
    oldPrice: 1050,
    image: "/images/product-8.jpg",
    category: "Şerit Testereler",
    categorySlug: "serit-testereler",
    specs: {
      "Uzunluk": "4020 mm",
      "Genişlik": "30 mm",
      "Kalınlık": "0.7 mm",
      "Diş Tipi": "Kanca diş",
      "Menşei": "Avusturya",
    },
    description: "Martin Miller Avusturya üretimi ahşap şerit testere, masif ahşap ve kereste kesiminde üstün performans.",
    inStock: true,
  },
];

export const brands = [
  "Freud", "Netmak", "Kronberg", "Tideway", "GKG",
  "Piranha", "Martin Miller", "Bosch", "König",
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(price);
}
