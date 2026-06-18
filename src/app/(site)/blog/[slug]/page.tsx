import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { posts } from "../page";
import { notFound } from "next/navigation";

const blogContent: Record<string, string[]> = {
  "cnc-freze-uclarinin-onemi": [
    "CNC makinelerde kullanılan freze uçları, işleme kalitesini doğrudan etkileyen en kritik bileşenlerdir. Doğru freze ucu seçimi, hem iş parçasının yüzey kalitesini hem de takım ömrünü önemli ölçüde artırır.",
    "Freze uçları genel olarak HSS (Yüksek Hız Çeliği) ve karbür uçlu olmak üzere iki ana kategoriye ayrılır. HSS uçlar daha ekonomik olmakla birlikte, karbür uçlar sertlik ve ısıya dayanıklılık konusunda üstün performans sunar.",
    "Malzeme seçiminde dikkat edilmesi gereken faktörler arasında işlenecek malzemenin türü, kesim hızı, ilerleme oranı ve istenilen yüzey kalitesi yer alır. Ahşap işleme için genellikle 2 ağızlı freze uçları tercih edilirken, metal işleme için 4 veya daha fazla ağızlı uçlar önerilir.",
    "Anti-vibrasyon teknolojisine sahip freze uçları, yüksek devirlerde bile titreşimi minimuma indirerek daha temiz kesimler sağlar. Bu özellik özellikle hassas CNC operasyonlarında büyük avantaj sunar.",
    "Freze uçlarının bakımı da performans açısından kritik öneme sahiptir. Düzenli bileme, doğru saklama koşulları ve uygun soğutma sıvısı kullanımı, takım ömrünü 2-3 kat artırabilir.",
  ],
  "daire-testere-bicagi-secimi": [
    "Daire testere bıçağı seçimi, kesim kalitesini ve verimliliğini doğrudan etkileyen önemli bir karardır. Yanlış bıçak seçimi malzeme israfına, kötü kesim kalitesine ve hatta güvenlik sorunlarına yol açabilir.",
    "Bıçak çapı, makinenizin teknik özelliklerine uygun olmalıdır. Yaygın çaplar 160mm, 200mm, 250mm, 300mm ve 350mm'dir. Daha büyük çap, daha derin kesim kapasitesi sağlar ancak daha güçlü bir motor gerektirir.",
    "Diş sayısı, kesim kalitesi ve hızı arasındaki dengeyi belirler. Az diş sayısı (24-40) hızlı ve kaba kesimler için, çok diş sayısı (60-96) ise yavaş ama temiz kesimler için idealdir. MDF ve laminant gibi malzemeler için yüksek diş sayısı tercih edilmelidir.",
    "Delik çapı (bore), bıçağın mile monte edilmesi için kritiktir. Standart delik çapları 20mm, 25.4mm ve 30mm'dir. Redüksiyon halkaları ile farklı çaplara uyum sağlanabilir.",
    "Karbür uç kalitesi ve geometrisi de kesim performansını etkiler. ATB (Alternate Top Bevel) diş geometrisi ahşap için, TCG (Triple Chip Grind) ise alüminyum ve kompozit malzemeler için daha uygundur.",
  ],
  "testere-bicagi-bakimi": [
    "Profesyonel testere bıçaklarınız doğru bakım ile çok daha uzun süre performansını korur. Bu rehberde, bıçak ömrünü uzatmanın kanıtlanmış yöntemlerini paylaşıyoruz.",
    "Kullanım sonrası temizlik en önemli bakım adımıdır. Reçine, yapışkan ve talaş kalıntıları bıçak yüzeyinde birikerek kesim kalitesini düşürür. Özel bıçak temizleme solüsyonları veya alkol bazlı temizleyiciler kullanarak düzenli temizlik yapın.",
    "Bıçakları saklarken birbirine temas ettirmekten kaçının. Her bıçak için ayrı koruyucu kılıf veya bölmeli saklama kutusu kullanın. Nemli ortamlardan uzak tutun; nem karbür uçlarda korozyona neden olabilir.",
    "Bileme zamanlaması kritik öneme sahiptir. Kesim kalitesi düşmeye başladığında, bıçağı zorlamak yerine hemen bileme yaptırın. Aşırı aşınmış bir bıçağı bilemek hem daha zor hem de daha maliyetlidir.",
    "Doğru kesim parametreleri kullanmak da bıçak ömrünü uzatır. Her malzeme için önerilen devir sayısı ve ilerleme hızına uyun. Aşırı yükleme hem bıçağa hem de makineye zarar verir.",
  ],
  "hss-vs-karbur-uclar": [
    "Kesici takım seçiminde HSS ve karbür uçlar arasındaki farkı anlamak, doğru yatırım kararı vermek için temel bilgidir. Her iki malzemenin kendine özgü avantaj ve dezavantajları vardır.",
    "HSS (High Speed Steel) uçlar, yüksek tokluk ve darbe dayanımı sunar. Daha ekonomik fiyatları ile hobi kullanıcıları ve düşük hacimli üretim için idealdir. Ancak yüksek sıcaklıklarda sertliğini kaybedebilir.",
    "Karbür uçlar, tungsten karbür alaşımından üretilir ve HSS'ye göre çok daha sert ve ısıya dayanıklıdır. CNC makinelerde yüksek devirli operasyonlar için vazgeçilmezdir. Ancak kırılganlıkları daha yüksektir ve darbeli kesimler için uygun olmayabilir.",
    "Maliyet-performans analizi yapıldığında, karbür uçlar başlangıç maliyeti yüksek olmasına rağmen, 3-5 kat daha uzun ömürleri sayesinde uzun vadede daha ekonomik olabilir. Özellikle seri üretimde bu fark belirginleşir.",
    "Sonuç olarak, az sayıda ve değişken malzemelerle çalışan atölyeler için HSS iyi bir seçenek olabilirken, seri üretim yapan ve yüksek yüzey kalitesi gerektiren operasyonlar için karbür uçlar tartışmasız daha iyi performans sunar.",
  ],,
  "serit-testere-bicagi-rehberi": [
    "Şerit testere bıçağı seçimi, makinenizin türüne ve kesilecek malzemeye göre doğru parametreler belirlenerek yapılmalıdır. TPI (diş/inç) değeri, bıçak genişliği ve diş geometrisi bu parametrelerin başında gelir.",
    "TPI değeri, kesim hızı ile kesim kalitesi arasındaki en kritik dengedir. Düşük TPI (2–6) kalın ahşap ve hızlı kesimler için idealdir; talaş boşluğu geniş olduğundan malzeme sıkışmaz. Orta TPI (6–14) genel ahşap kesimi için uygundur. Yüksek TPI (14–32) ince metal boru, profil ve ince ahşap için tercih edilir; temiz ve titreşimsiz yüzey sağlar.",
    "Bıçak genişliği ise kesim dönüşüm çapı ve kesim düzlüğünü belirler. Dar bıçaklar (3–6 mm) dar eğri kesimler için, geniş bıçaklar (13–25 mm) düz ve güçlü kesimler için kullanılır. Makine kılavuzunuzdaki maksimum bıçak genişliğini aşmamaya özen gösterin.",
    "Diş geometrisi de kesim kalitesini doğrudan etkiler. Standart diş (Regular) ahşap ve yumuşak malzemeler için; kanca diş (Hook / Positive Rake) hızlı ahşap ve et kesimi için; değişken diş (Variable Pitch) metal kesimde titreşim ve gürültüyü azaltmak için seçilir.",
    "Metalik malzemelerde bisetal şerit testere bıçakları (HSS diş + yay çeliği gövde) daha uzun ömür sunar. Alüminyum ve bakır gibi yapışkan metaller için özel kaplamalı veya yüksek hız çeliği bıçaklar tercih edilmelidir. Bıçak gerilimi ve kılavuz ayarları da kesim kalitesini doğrudan etkiler; makine kılavuzuna göre düzenli kontrol yapın.",
  ],
  "karbur-dis-geometrileri": [
    "Daire testere bıçaklarındaki karbür diş geometrisi, hangi malzemeyi nasıl kesiyor olduğunuza göre belirlenmelidir. Dört temel geometri bulunur: ATB, FTG, TCG ve Hi-ATB.",
    "ATB (Alternate Top Bevel — Alternatif Üst Eğim): Dişler sağ ve sol olmak üzere dönüşümlü açıyla bilenir. Bu geometri ahşap, kontrplak ve MDF'de hem yüzey hem de kenar kalitesini dengeleyerek en temiz sonuçları verir. Çoğu genel amaçlı bıçakta kullanılır.",
    "FTG (Flat Top Grind — Düz Üst Talaş): Dişler tamamen düz kesilir. Masif ahşapta pürüzsüz boyuna kesim ve kereste kesimi için idealdir. Altta life paralel kesimlerde mükemmel sonuç verir ancak çapraz kesimde ATB'ye göre daha kaba yüzey bırakır.",
    "TCG (Triple Chip Grind — Üçlü Talaş): Bir düz diş, bir köşe-kırpılmış diş şeklinde tekrarlanan kombinasyon. Alüminyum, PVC, fiber çimento ve sert plastik kesiminde idealdir; yapışmaz ve talaş sıkışmasını önler. Seramik ve asfalt kesimi için de kullanılır.",
    "Hi-ATB (Yüksek Açılı ATB): ATB'nin daha yüksek (typ. 40°) bevel açısıyla versiyonudur. Melamin, laminant ve çift yüzlü kaplama levhalarda parçalanmayı (tearout) en aza indirir; en temiz yüzeyi bu geometri verir. Ancak daha hızlı aşınır ve sadece temiz malzemelerde kullanılmalıdır.",
    "Özetle: Genel ahşap → ATB; boyuna ahşap → FTG; alüminyum, PVC → TCG; melamin, laminant → Hi-ATB seçin. Kombine ATB+R (Raker diş eklenmiş ATB) ise hem boyuna hem de çapraz kesimde dengeli performans isteyen atölyeler için üretilmiş karma bir çözümdür.",
  ],
};

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${slug}`,
      publishedTime: new Date(post.date).toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = blogContent[slug] || [post.excerpt];
  const otherPosts = posts.filter((p) => p.slug !== slug).slice(0, 3);

  // Article JSON-LD: blog yazısını yapısal veri olarak işaretler (zengin sonuç adayı).
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    articleSection: post.category,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://testereplus.com/blog/${slug}`,
    },
    author: { "@type": "Organization", name: "Testere Plus" },
    publisher: {
      "@type": "Organization",
      name: "Testere Plus",
      logo: {
        "@type": "ImageObject",
        url: "https://testereplus.com/images/logo.svg",
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <nav className="text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
        <span className="mx-2 text-border">/</span>
        <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
        <span className="mx-2 text-border">/</span>
        <span className="text-text-primary font-medium line-clamp-1">{post.title}</span>
      </nav>

      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent mb-6 transition-colors">
        <ArrowLeft size={14} /> Blog'a Dön
      </Link>

      <article>
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs bg-accent-bg text-accent px-3 py-1.5 rounded-lg font-semibold">
            <Tag size={12} />
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-text-muted">
            <Calendar size={14} />
            {new Date(post.date).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="bg-accent-bg border border-accent/10 rounded-2xl p-5 mb-8">
          <p className="text-text-secondary leading-relaxed font-medium">{post.excerpt}</p>
        </div>

        <div className="prose-custom space-y-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-text-secondary leading-relaxed text-[15px]">{p}</p>
          ))}
        </div>

        <div className="mt-10 p-6 bg-bg-secondary border border-border rounded-2xl text-center">
          <p className="text-text-primary font-semibold mb-2">Bu konuda teknik destek mi arıyorsunuz?</p>
          <p className="text-sm text-text-secondary mb-4">Uzman ekibimiz size yardımcı olmaktan memnuniyet duyar.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              İletişime Geç
            </Link>
            <a
              href="https://wa.me/905551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </article>

      {otherPosts.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-bold text-text-primary mb-6">Diğer Yazılar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="bg-white border border-border rounded-2xl p-5 hover:border-accent/40 hover:shadow-md transition-all group"
              >
                <span className="text-xs bg-accent-bg text-accent px-2 py-1 rounded-lg font-semibold">{p.category}</span>
                <h3 className="text-sm font-bold text-text-primary mt-3 group-hover:text-accent transition-colors line-clamp-2">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
