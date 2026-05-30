export interface MaterialCompatibility {
  name: string;
  rating: 1 | 2 | 3;
  notes?: string;
}

export interface DownloadItem {
  label: string;
  url: string;
  fileType: "pdf" | "dwg" | "other";
  sizeMb?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  category: string;
  categorySlug: string;
  categorySlugs: string[];
  breadcrumbPath: string[];
  specs: Record<string, string>;
  description: string;
  overview?: string;
  inStock: boolean;
  sku?: string;
  materials: MaterialCompatibility[];
  relatedProductIds: string[];
  accessoryIds: string[];
  downloads: DownloadItem[];
  bulletPoints: string[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  parentSlug?: string;
  children?: string[];
}

// Root categories
export const categories: Category[] = [
  {
    slug: "testere-bicaklari",
    name: "Testere Bıçakları",
    description: "Daire testere ve şerit testere bıçakları",
    image: "/images/cat-testere.jpg",
    productCount: 70,
    children: ["daire-testere-bicaklari", "serit-testereler"],
  },
  {
    slug: "daire-testere-bicaklari",
    name: "Daire Testere Bıçakları",
    description: "Ahşap, metal, aluminyum ve kompozit kesim için profesyonel daire testere bıçakları",
    image: "/images/cat-daire-testere.jpg",
    productCount: 48,
    parentSlug: "testere-bicaklari",
  },
  {
    slug: "serit-testereler",
    name: "Şerit Testereler",
    description: "Ahşap, metal ve gıda sektörü için yüksek performanslı şerit testere bıçakları",
    image: "/images/cat-serit.jpg",
    productCount: 22,
    parentSlug: "testere-bicaklari",
  },
  {
    slug: "freze-planya",
    name: "Freze & Planya",
    description: "Freze bıçakları, jiletler ve planya bıçakları",
    image: "/images/cat-freze.jpg",
    productCount: 51,
    children: ["freze-bicaklari", "jiletler-planyalar"],
  },
  {
    slug: "freze-bicaklari",
    name: "Freze Bıçakları",
    description: "CNC ve el frezesi için göbekli, saplı ve değiştirilebilir jiletli freze bıçakları",
    image: "/images/cat-freze.jpg",
    productCount: 35,
    parentSlug: "freze-planya",
  },
  {
    slug: "jiletler-planyalar",
    name: "Jiletler & Planyalar",
    description: "Değiştirilebilir jiletler ve planya bıçakları",
    image: "/images/cat-jilet.jpg",
    productCount: 16,
    parentSlug: "freze-planya",
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
    images: ["/images/product-1.jpg", "/images/freud-blade.jpg", "/images/freud-blade-lg.jpg"],
    category: "Daire Testere Bıçakları",
    categorySlug: "daire-testere-bicaklari",
    categorySlugs: ["daire-testere-bicaklari", "testere-bicaklari"],
    breadcrumbPath: ["testere-bicaklari", "daire-testere-bicaklari"],
    sku: "FRD-LU5B-250-80",
    specs: {
      "Çap": "250 mm",
      "Kalınlık": "2.8 mm",
      "Delik": "30 mm",
      "Diş Sayısı": "80",
      "Malzeme": "Karbür uçlu",
      "Kullanım": "Alüminyum kesim",
    },
    description: "Freud LU5B serisi, alüminyum profil ve levha kesiminde üstün performans sunar. Negatif diş açısı sayesinde titreşimsiz, temiz kesim sağlar.",
    overview: "Freud LU5B serisi, İtalya'da üretilen profesyonel alüminyum kesim bıçağıdır. Anti-Vibration teknolojisi ve Silver I.C.E. kaplama ile uzun ömürlü, titreşimsiz ve temiz kesim sağlar. Negatif diş açısı alüminyum profil ve levha kesiminde çapak oluşumunu minimize eder. 80 adet karbür uçlu diş, hassas ve düzgün yüzey kalitesi garanti eder.",
    inStock: true,
    materials: [
      { name: "Alüminyum", rating: 3, notes: "Profil ve levha" },
      { name: "PVC", rating: 3 },
      { name: "Bakır", rating: 2 },
      { name: "Pirinç", rating: 2 },
      { name: "Kompozit Panel", rating: 2 },
    ],
    relatedProductIds: ["4", "5"],
    accessoryIds: ["6"],
    downloads: [
      { label: "Freud LU5B Teknik Katalog", url: "/downloads/freud-lu5b-katalog.pdf", fileType: "pdf", sizeMb: 2.4 },
    ],
    bulletPoints: [
      "İtalya'da üretilen Freud LU5B serisi, profesyonel alüminyum kesim için tasarlanmıştır",
      "Anti-Vibration teknolojisi sayesinde titreşimsiz ve sessiz çalışma sağlar",
      "Silver I.C.E. kaplama ile 2 kat daha uzun ömür ve ısıya dayanıklılık sunar",
      "Negatif diş açısı (-6°) alüminyum profil ve levha kesiminde çapak oluşumunu engeller",
      "80 adet mikro taneli karbür diş ile hassas ve düzgün yüzey kalitesi garanti eder",
      "250mm çap ile endüstriyel panel ve kesim testerelerinde kullanıma uygundur",
      "Alüminyum, PVC, bakır ve kompozit panel kesiminde mükemmel performans",
    ],
  },
  {
    id: "2",
    slug: "netmak-cok-yonlu-daire-testere",
    name: "Netmak Çok Yönlü Kesim Daire Testere Bıçağı 300x96",
    brand: "Netmak",
    price: 1890,
    image: "/images/product-2.jpg",
    images: ["/images/product-2.jpg"],
    category: "Daire Testere Bıçakları",
    categorySlug: "daire-testere-bicaklari",
    categorySlugs: ["daire-testere-bicaklari", "testere-bicaklari"],
    breadcrumbPath: ["testere-bicaklari", "daire-testere-bicaklari"],
    sku: "NTM-CY-300-96",
    specs: {
      "Çap": "300 mm",
      "Kalınlık": "3.2 mm",
      "Delik": "30 mm",
      "Diş Sayısı": "96",
      "Malzeme": "Karbür uçlu",
      "Kullanım": "Çok yönlü kesim",
    },
    description: "Netmak çok yönlü kesim testere bıçağı, ahşap, MDF, sunta ve laminant kesimlerinde mükemmel yüzey kalitesi sağlar.",
    overview: "Netmak çok yönlü kesim serisi, tek bir bıçakla birden fazla malzemeyi kesebilmenizi sağlar. TCT karbür uçlu dişler uzun ömürlü kullanım sunarken, ATB diş geometrisi hem boyuna hem enine kesimlerde temiz yüzey elde etmenizi sağlar. Panel ebatlama, format kesim ve genel amaçlı ahşap işleme için ideal tercih.",
    inStock: true,
    materials: [
      { name: "Ahşap", rating: 3, notes: "Masif ve sert ahşap" },
      { name: "MDF", rating: 3 },
      { name: "Sunta", rating: 3 },
      { name: "Laminant", rating: 3 },
      { name: "Kontrplak", rating: 2 },
    ],
    relatedProductIds: ["1", "4"],
    accessoryIds: [],
    downloads: [],
    bulletPoints: [
      "Tek bıçakla ahşap, MDF, sunta ve laminant kesimi yapabilirsiniz",
      "TCT karbür uçlu dişler uzun ömürlü kullanım ve keskin kesim sağlar",
      "ATB diş geometrisi hem boyuna hem enine kesimlerde temiz yüzey verir",
      "Panel ebatlama, format kesim ve genel amaçlı işleme için ideal",
      "300mm çap ve 96 diş ile endüstriyel kesim makinelerine uygundur",
    ],
  },
  {
    id: "3",
    slug: "tideway-kanal-tarama-bicagi",
    name: "Tideway Kanal Tarama Bıçağı 12mm Saplı",
    brand: "Tideway",
    price: 340,
    oldPrice: 420,
    image: "/images/product-3.jpg",
    images: ["/images/product-3.jpg"],
    category: "Freze Bıçakları",
    categorySlug: "freze-bicaklari",
    categorySlugs: ["freze-bicaklari", "freze-planya"],
    breadcrumbPath: ["freze-planya", "freze-bicaklari"],
    sku: "TDW-KT-12-18",
    specs: {
      "Sap Çapı": "12 mm",
      "Kesim Çapı": "18 mm",
      "Kesim Derinliği": "20 mm",
      "Malzeme": "Karbür uçlu",
    },
    description: "Tideway kanal tarama bıçağı, düz yüzey temizleme ve kanal tarama işlemleri için idealdir.",
    inStock: true,
    materials: [
      { name: "Ahşap", rating: 3 },
      { name: "MDF", rating: 3 },
      { name: "Kontrplak", rating: 2 },
    ],
    relatedProductIds: ["6"],
    accessoryIds: [],
    downloads: [],
    bulletPoints: [
      "12mm saplı, CNC ve el frezesi ile uyumlu kanal tarama bıçağı",
      "18mm kesim çapı ve 20mm derinlik ile standart kanal işlemleri için ideal",
      "Karbür uçlu kesici ağız, MDF ve ahşapta temiz yüzey bırakır",
      "Düz yüzey temizleme ve kanal tarama işlemlerinde hassas sonuç",
    ],
  },
  {
    id: "4",
    slug: "kronberg-aluminyum-pvc-testere-350",
    name: "Kronberg Alüminyum & PVC Kesim Daire Testere 350x108",
    brand: "Kronberg",
    price: 3200,
    image: "/images/product-4.jpg",
    images: ["/images/product-4.jpg"],
    category: "Daire Testere Bıçakları",
    categorySlug: "daire-testere-bicaklari",
    categorySlugs: ["daire-testere-bicaklari", "testere-bicaklari"],
    breadcrumbPath: ["testere-bicaklari", "daire-testere-bicaklari"],
    sku: "KRN-AP-350-108",
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
    materials: [
      { name: "Alüminyum", rating: 3 },
      { name: "PVC", rating: 3 },
      { name: "Bakır", rating: 2 },
    ],
    relatedProductIds: ["1", "5"],
    accessoryIds: [],
    downloads: [],
    bulletPoints: [
      "Kronberg profesyonel seri, alüminyum ve PVC profil kesiminde çapaksız sonuç verir",
      "108 adet TCT karbür diş ile ince ve hassas kesim sağlar",
      "350mm çap, endüstriyel kesim testereleri ve çift kafa makinelere uygundur",
      "Negatif diş açısı ile güvenli ve titreşimsiz kesim deneyimi",
    ],
  },
  {
    id: "5",
    slug: "gkg-hss-freze-testere-200",
    name: "GKG HSS Freze Testere 200x2.0x32 Z128",
    brand: "GKG",
    price: 1650,
    oldPrice: 1950,
    image: "/images/product-5.jpg",
    images: ["/images/product-5.jpg"],
    category: "Daire Testere Bıçakları",
    categorySlug: "daire-testere-bicaklari",
    categorySlugs: ["daire-testere-bicaklari", "testere-bicaklari"],
    breadcrumbPath: ["testere-bicaklari", "daire-testere-bicaklari"],
    sku: "GKG-HSS-200-128",
    specs: {
      "Çap": "200 mm",
      "Kalınlık": "2.0 mm",
      "Delik": "32 mm",
      "Diş Sayısı": "128",
      "Malzeme": "HSS",
    },
    description: "GKG HSS freze testere, metal profil ve boru kesiminde hassas ve temiz kesim sağlar.",
    inStock: true,
    materials: [
      { name: "Metal Profil", rating: 3 },
      { name: "Boru", rating: 3 },
      { name: "Paslanmaz Çelik", rating: 1, notes: "Düşük hızda" },
    ],
    relatedProductIds: ["1", "4"],
    accessoryIds: [],
    downloads: [],
    bulletPoints: [
      "HSS (Yüksek Hız Çeliği) malzeme ile metal profil ve boru kesiminde üstün performans",
      "200mm çap ve 128 diş ile ince kesim kalınlığı ve pürüzsüz yüzey",
      "32mm delik çapı ile freze makinelerine doğrudan montaj",
      "2.0mm kalınlık sayesinde minimum malzeme kaybı",
    ],
  },
  {
    id: "6",
    slug: "tideway-rulmanli-pah-bicagi",
    name: "Tideway Rulmanlı Pah Kırma Bıçağı 45°",
    brand: "Tideway",
    price: 280,
    image: "/images/product-6.jpg",
    images: ["/images/product-6.jpg"],
    category: "Freze Bıçakları",
    categorySlug: "freze-bicaklari",
    categorySlugs: ["freze-bicaklari", "freze-planya"],
    breadcrumbPath: ["freze-planya", "freze-bicaklari"],
    sku: "TDW-PH-45-8",
    specs: {
      "Sap Çapı": "8 mm",
      "Açı": "45°",
      "Rulman": "Var",
      "Malzeme": "Karbür uçlu",
    },
    description: "Rulmanlı pah kırma bıçağı, kenar pahı ve dekoratif profil çalışmalarında hassas sonuç verir.",
    inStock: false,
    materials: [
      { name: "Ahşap", rating: 3 },
      { name: "MDF", rating: 2 },
    ],
    relatedProductIds: ["3"],
    accessoryIds: [],
    downloads: [],
    bulletPoints: [
      "45° açılı karbür uçlu pah kırma bıçağı ile temiz ve hassas kenar pahları",
      "Rulmanlı tasarım sayesinde iş parçası yüzeyinde iz bırakmadan çalışma",
      "8mm sap çapı ile CNC ve el tipi freze makinelerine uyumlu",
      "Ahşap, MDF ve sunta gibi levha malzemelerde dekoratif profil işleme",
    ],
  },
  {
    id: "7",
    slug: "piranha-ahsap-planya-bicagi-310",
    name: "Piranha Ahşap Planya Bıçağı 310x30x3mm",
    brand: "Piranha",
    price: 520,
    image: "/images/product-7.jpg",
    images: ["/images/product-7.jpg"],
    category: "Jiletler & Planyalar",
    categorySlug: "jiletler-planyalar",
    categorySlugs: ["jiletler-planyalar", "freze-planya"],
    breadcrumbPath: ["freze-planya", "jiletler-planyalar"],
    sku: "PRN-PL-310-30",
    specs: {
      "Uzunluk": "310 mm",
      "Genişlik": "30 mm",
      "Kalınlık": "3 mm",
      "Malzeme": "HSS",
    },
    description: "Piranha HSS planya bıçağı, kalıp ve ahşap planya makineleri için yüksek dayanıklılık sunar.",
    inStock: true,
    materials: [
      { name: "Ahşap", rating: 3, notes: "Masif ahşap" },
      { name: "Sert Ahşap", rating: 2 },
    ],
    relatedProductIds: [],
    accessoryIds: [],
    downloads: [],
    bulletPoints: [
      "HSS (Yüksek Hız Çeliği) planya bıçağı ile uzun ömür ve keskin kesim",
      "310x30x3mm boyut ile endüstriyel planya makinelerine tam uyum",
      "Masif ahşap ve sert ağaç türlerinde pürüzsüz yüzey kalitesi",
      "Bileme yapılabilir tasarım sayesinde ekonomik uzun vadeli kullanım",
    ],
  },
  {
    id: "8",
    slug: "martin-miller-serit-testere-ahsap",
    name: "Martin Miller Ahşap Şerit Testere 4020x30x0.7",
    brand: "Martin Miller",
    price: 890,
    oldPrice: 1050,
    image: "/images/product-8.jpg",
    images: ["/images/product-8.jpg"],
    category: "Şerit Testereler",
    categorySlug: "serit-testereler",
    categorySlugs: ["serit-testereler", "testere-bicaklari"],
    breadcrumbPath: ["testere-bicaklari", "serit-testereler"],
    sku: "MM-ST-4020-30",
    specs: {
      "Uzunluk": "4020 mm",
      "Genişlik": "30 mm",
      "Kalınlık": "0.7 mm",
      "Diş Tipi": "Kanca diş",
      "Menşei": "Avusturya",
    },
    description: "Martin Miller Avusturya üretimi ahşap şerit testere, masif ahşap ve kereste kesiminde üstün performans.",
    inStock: true,
    materials: [
      { name: "Masif Ahşap", rating: 3, notes: "Kereste, tomruk" },
      { name: "Sert Ahşap", rating: 3 },
      { name: "Yumuşak Ahşap", rating: 3 },
    ],
    relatedProductIds: [],
    accessoryIds: [],
    downloads: [],
    bulletPoints: [
      "Avusturya üretimi Martin Miller kalitesi ile profesyonel kereste ve tomruk kesimi",
      "4020x30x0.7mm boyut ile endüstriyel şerit testere makinelerine uyumlu",
      "Kanca diş geometrisi sayesinde hızlı talaş kaldırma ve temiz kesim",
      "0.7mm kalınlık ile minimum fire ve uzun bant ömrü",
      "Masif ahşap, sert ve yumuşak ağaç türlerinde yüksek performans",
    ],
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
  return products.filter((p) => p.categorySlugs.includes(categorySlug));
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getRootCategories(): Category[] {
  return categories.filter((c) => !c.parentSlug);
}

export function getChildCategories(parentSlug: string): Category[] {
  return categories.filter((c) => c.parentSlug === parentSlug);
}

export function getCategoryBreadcrumb(slug: string): Category[] {
  const result: Category[] = [];
  let current = getCategoryBySlug(slug);
  while (current) {
    result.unshift(current);
    current = current.parentSlug ? getCategoryBySlug(current.parentSlug) : undefined;
  }
  return result;
}

export function getRelatedProducts(productId: string): Product[] {
  const product = products.find((p) => p.id === productId);
  if (!product) return [];
  return product.relatedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);
}

export function getAccessories(productId: string): Product[] {
  const product = products.find((p) => p.id === productId);
  if (!product) return [];
  return product.accessoryIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(price);
}
