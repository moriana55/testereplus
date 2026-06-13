import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const IMG_DIR = path.join(DATA_DIR, "images");

fs.mkdirSync(IMG_DIR, { recursive: true });

const FREE_PROXIES = [
  null, // direct first
];

const BASE = "https://www.testereplus.com";

async function createBrowser(proxy) {
  const opts = {
    headless: true,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
    ],
  };
  if (proxy) opts.proxy = { server: proxy };

  const browser = await chromium.launch(opts);
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
    locale: "tr-TR",
  });
  return { browser, context };
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Step 1: Get all category links from nav menu
async function getCategories(page) {
  console.log("📂 Kategorileri çekiyorum...");
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(3000);

  const categories = await page.evaluate(() => {
    const cats = [];
    // IdeaSoft nav menu
    const links = document.querySelectorAll(
      'a[href*="/kategori/"], .navbar a, .menu a, nav a, .category a, #navigation a'
    );
    links.forEach((a) => {
      const href = a.href;
      const name = a.textContent?.trim();
      if (href && name && !cats.find((c) => c.url === href)) {
        cats.push({ name, url: href });
      }
    });
    return cats;
  });

  console.log(`  → ${categories.length} kategori bulundu`);
  return categories;
}

// Step 2: Get all product links from a category page (handles pagination)
async function getProductLinksFromCategory(page, catUrl, catName) {
  const productLinks = [];
  let pageNum = 1;

  while (true) {
    const url = pageNum === 1 ? catUrl : `${catUrl}?pg=${pageNum}`;
    console.log(`  📄 ${catName} sayfa ${pageNum}...`);

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await sleep(1500);
    } catch {
      break;
    }

    const links = await page.evaluate(() => {
      const items = [];
      document
        .querySelectorAll('a[href*="/urun/"]')
        .forEach((a) => {
          const href = a.href;
          if (href && !items.includes(href)) items.push(href);
        });
      return items;
    });

    if (links.length === 0) break;

    const newLinks = links.filter((l) => !productLinks.includes(l));
    if (newLinks.length === 0) break;

    productLinks.push(...newLinks);
    console.log(`    → ${newLinks.length} yeni ürün (toplam: ${productLinks.length})`);

    // Check if next page exists
    const hasNext = await page.evaluate(() => {
      const nextBtn = document.querySelector(
        '.pagination .next, .pagination a[rel="next"], a.next-page, .paginator .next'
      );
      return !!nextBtn;
    });

    if (!hasNext) break;
    pageNum++;
  }

  return productLinks;
}

// Step 3: Scrape a single product page
async function scrapeProduct(page, url) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await sleep(1500);

    const product = await page.evaluate(() => {
      const getText = (sel) =>
        document.querySelector(sel)?.textContent?.trim() || "";
      const getAttr = (sel, attr) =>
        document.querySelector(sel)?.getAttribute(attr) || "";

      // Title
      const title =
        getText("h1") ||
        getText(".product-title") ||
        getText(".product-name") ||
        getText('[itemprop="name"]');

      // Prices
      const priceEl =
        document.querySelector('[itemprop="price"]') ||
        document.querySelector(".product-price .price") ||
        document.querySelector(".current-price") ||
        document.querySelector(".product-price");
      const price = priceEl?.textContent?.trim() || "";
      const priceValue = priceEl?.getAttribute("content") || "";

      const oldPriceEl =
        document.querySelector(".old-price") ||
        document.querySelector(".price-old") ||
        document.querySelector("del");
      const oldPrice = oldPriceEl?.textContent?.trim() || "";

      // SKU
      const sku =
        getAttr('[itemprop="sku"]', "content") ||
        getText(".product-code") ||
        getText(".stock-code") ||
        "";

      // Brand
      const brand =
        getText('[itemprop="brand"]') ||
        getAttr('[itemprop="brand"]', "content") ||
        getText(".product-brand") ||
        "";

      // Description
      const desc =
        document.querySelector('[itemprop="description"]')?.innerHTML ||
        document.querySelector(".product-description")?.innerHTML ||
        document.querySelector(".product-detail-tab")?.innerHTML ||
        "";

      // Images
      const images = [];
      document
        .querySelectorAll(
          '.product-image img, .product-gallery img, [itemprop="image"], .product-detail img, .gallery img, .slider img'
        )
        .forEach((img) => {
          const src =
            img.getAttribute("data-original") ||
            img.getAttribute("data-src") ||
            img.getAttribute("data-zoom-image") ||
            img.getAttribute("src") ||
            "";
          if (src && !src.includes("loader.gif") && !src.includes("placeholder")) {
            const fullSrc = src.startsWith("//")
              ? "https:" + src
              : src.startsWith("/")
                ? window.location.origin + src
                : src;
            if (!images.includes(fullSrc)) images.push(fullSrc);
          }
        });

      // All images on the page that could be product images
      document.querySelectorAll("img").forEach((img) => {
        const src = img.src || img.dataset.src || img.dataset.original || "";
        if (
          src &&
          (src.includes("/urunler/") || src.includes("/products/") || src.includes("/upload/")) &&
          !src.includes("loader") &&
          !images.includes(src)
        ) {
          images.push(src);
        }
      });

      // Variants/options
      const variants = [];
      document
        .querySelectorAll(
          ".product-option, .variant-option, select.product-select, .option-group"
        )
        .forEach((opt) => {
          const label =
            opt.querySelector("label, .option-label")?.textContent?.trim() || "";
          const values = [];
          opt.querySelectorAll("option, .option-value, input").forEach((v) => {
            const val = v.textContent?.trim() || v.value || "";
            if (val && val !== "Seçiniz") values.push(val);
          });
          if (label || values.length) variants.push({ label, values });
        });

      // Specs table
      const specs = {};
      document
        .querySelectorAll(
          ".product-features tr, .product-specs tr, .spec-table tr, table tr"
        )
        .forEach((tr) => {
          const cells = tr.querySelectorAll("td, th");
          if (cells.length >= 2) {
            specs[cells[0].textContent.trim()] = cells[1].textContent.trim();
          }
        });

      // Category breadcrumb
      const breadcrumbs = [];
      document
        .querySelectorAll(".breadcrumb a, .breadcrumbs a, nav[aria-label='breadcrumb'] a")
        .forEach((a) => {
          breadcrumbs.push(a.textContent.trim());
        });

      // Stock status
      const inStock =
        document.querySelector('[itemprop="availability"]')?.getAttribute("href")?.includes("InStock") ||
        !!document.querySelector(".add-to-cart, .addToCart, #addToCart") ||
        false;

      return {
        title,
        price,
        priceValue,
        oldPrice,
        sku,
        brand,
        description: desc,
        images,
        variants,
        specs,
        breadcrumbs,
        inStock,
      };
    });

    product.url = url;
    product.slug = url.split("/urun/")[1] || "";
    return product;
  } catch (err) {
    console.error(`  ❌ Hata: ${url} - ${err.message}`);
    return null;
  }
}

// Step 4: Download images
async function downloadImage(url, slug, index) {
  try {
    const ext = path.extname(new URL(url).pathname) || ".jpg";
    const filename = `${slug}_${index}${ext}`;
    const filepath = path.join(IMG_DIR, filename);

    if (fs.existsSync(filepath)) return filename;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Referer: BASE,
      },
    });

    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    return filename;
  } catch {
    return null;
  }
}

// Main
async function main() {
  console.log("🚀 TesterePlus Scraper Başlıyor...\n");

  const { browser, context } = await createBrowser(null);
  const page = await context.newPage();

  // 1. Kategorileri çek
  const categories = await getCategories(page);
  fs.writeFileSync(
    path.join(DATA_DIR, "categories.json"),
    JSON.stringify(categories, null, 2),
    "utf-8"
  );

  // 2. Tüm ürün linklerini topla
  console.log("\n🔗 Ürün linklerini topluyorum...");
  const allProductLinks = new Set();

  // Ana sayfadaki ürünler
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  const homeLinks = await page.evaluate(() => {
    return [...document.querySelectorAll('a[href*="/urun/"]')].map((a) => a.href);
  });
  homeLinks.forEach((l) => allProductLinks.add(l));
  console.log(`  Ana sayfa: ${homeLinks.length} ürün`);

  // Kategori sayfalarındaki ürünler
  for (const cat of categories) {
    try {
      const links = await getProductLinksFromCategory(page, cat.url, cat.name);
      links.forEach((l) => allProductLinks.add(l));
    } catch (err) {
      console.error(`  ⚠️ ${cat.name} atlandı: ${err.message}`);
    }
  }

  // Ayrıca tüm ürünler sayfası varsa
  for (const path of ["/tum-urunler", "/urunler", "/products"]) {
    try {
      await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 30000 });
      const links = await page.evaluate(() =>
        [...document.querySelectorAll('a[href*="/urun/"]')].map((a) => a.href)
      );
      links.forEach((l) => allProductLinks.add(l));
      if (links.length) console.log(`  ${path}: ${links.length} ürün`);
    } catch {}
  }

  const productUrls = [...allProductLinks];
  console.log(`\n📦 Toplam ${productUrls.length} benzersiz ürün bulundu\n`);

  // 3. Her ürünü scrape et
  console.log("🔍 Ürünleri çekiyorum...\n");
  const products = [];
  let success = 0;
  let fail = 0;

  for (let i = 0; i < productUrls.length; i++) {
    const url = productUrls[i];
    const slug = url.split("/urun/")[1] || `product_${i}`;
    console.log(`[${i + 1}/${productUrls.length}] ${slug}`);

    const product = await scrapeProduct(page, url);
    if (product) {
      // Download images
      const localImages = [];
      for (let j = 0; j < product.images.length; j++) {
        const filename = await downloadImage(product.images[j], slug, j);
        if (filename) localImages.push(filename);
      }
      product.localImages = localImages;
      products.push(product);
      success++;
    } else {
      fail++;
    }

    // Rate limiting
    if (i % 10 === 0 && i > 0) {
      console.log(`  💤 Biraz bekliyorum... (${success} başarılı, ${fail} başarısız)`);
      await sleep(3000);
    } else {
      await sleep(800 + Math.random() * 700);
    }
  }

  // 4. Kaydet
  fs.writeFileSync(
    path.join(DATA_DIR, "products.json"),
    JSON.stringify(products, null, 2),
    "utf-8"
  );

  fs.writeFileSync(
    path.join(DATA_DIR, "product_urls.json"),
    JSON.stringify(productUrls, null, 2),
    "utf-8"
  );

  // Summary
  const summary = {
    totalCategories: categories.length,
    totalProductUrls: productUrls.length,
    successfulScrapes: success,
    failedScrapes: fail,
    totalImages: products.reduce((acc, p) => acc + (p.localImages?.length || 0), 0),
    scrapedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(DATA_DIR, "summary.json"),
    JSON.stringify(summary, null, 2),
    "utf-8"
  );

  console.log(`\n✅ Tamamlandı!`);
  console.log(`  📂 Kategoriler: ${categories.length}`);
  console.log(`  📦 Ürünler: ${success}/${productUrls.length}`);
  console.log(`  🖼️  Görseller: ${summary.totalImages}`);
  console.log(`  📁 Veriler: ${DATA_DIR}`);

  await browser.close();
}

main().catch(console.error);
