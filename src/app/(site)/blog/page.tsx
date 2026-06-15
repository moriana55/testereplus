import { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Blog",
  description: "Kesici takımlar hakkında teknik yazılar, rehberler ve sektör haberleri.",
};

export const posts = [
  {
    slug: "cnc-freze-uclarinin-onemi",
    title: "CNC Makinelerde Freze Uçlarının Önemi ve Doğru Seçim Rehberi",
    excerpt: "CNC makinelerde kullanılan freze uçlarının türleri, malzeme seçimi ve performans faktörleri hakkında kapsamlı bir rehber.",
    date: "2024-12-15",
    category: "Rehber",
  },
  {
    slug: "daire-testere-bicagi-secimi",
    title: "Daire Testere Bıçağı Nasıl Seçilir? Diş Sayısı ve Çap Rehberi",
    excerpt: "Ahşap, metal ve alüminyum kesim için doğru daire testere bıçağı seçiminde dikkat edilmesi gereken teknik detaylar.",
    date: "2024-11-28",
    category: "Rehber",
  },
  {
    slug: "testere-bicagi-bakimi",
    title: "Testere Bıçağı Bakımı: Ömrünü 2 Katına Çıkarın",
    excerpt: "Profesyonel kesici takımlarınızın ömrünü uzatmak için uygulamanız gereken bakım ve saklama yöntemleri.",
    date: "2024-10-10",
    category: "İpucu",
  },
  {
    slug: "hss-vs-karbur-uclar",
    title: "HSS vs Karbür Uçlar: Hangisi Sizin İçin Doğru?",
    excerpt: "HSS ve karbür uçlu takımların avantaj ve dezavantajlarını karşılaştırarak ihtiyacınıza en uygun seçimi yapın.",
    date: "2024-09-05",
    category: "Karşılaştırma",
  },
  {
    slug: "serit-testere-bicagi-rehberi",
    title: "Şerit Testere Bıçağı Seçim Rehberi: TPI, Genişlik ve Malzeme",
    excerpt: "Ahşap, et ve metal kesiminde şerit testere bıçağı seçerken dikkat etmeniz gereken TPI değeri, bıçak genişliği ve diş geometrisi hakkında kapsamlı rehber.",
    date: "2025-03-18",
    category: "Rehber",
  },
  {
    slug: "karbur-dis-geometrileri",
    title: "Karbür Diş Geometrileri: ATB, TCG, FTG ve Hi-ATB Farkları",
    excerpt: "Daire testere bıçaklarındaki karbür diş geometrilerini tanıyın: hangi geometri hangi malzeme ve kesim tipi için idealdir?",
    date: "2025-02-05",
    category: "Teknik",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Blog", url: "/blog" }]} />
      <nav className="text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
        <span className="mx-2 text-border">/</span>
        <span className="text-text-primary font-medium">Blog</span>
      </nav>

      <h1 className="text-3xl font-bold text-text-primary mb-2">Blog</h1>
      <p className="text-text-secondary mb-10">Teknik rehberler, ipuçları ve sektör haberleri</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <article className="bg-white border border-border rounded-2xl p-6 hover:border-accent/40 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 h-full">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs bg-accent-bg text-accent px-2.5 py-1 rounded-lg font-semibold">
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Calendar size={12} />
                  {new Date(post.date).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h2 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">{post.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-sm text-accent font-semibold group-hover:gap-2 transition-all">
                Devamını Oku <ArrowRight size={14} />
              </span>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
