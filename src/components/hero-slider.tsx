"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SawBladeAnimation } from "./saw-blade-animation";

interface Slide {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  cta: string;
  href: string;
  accent: string;
  bgPattern: string;
  image: string;
  imageAlt: string;
  animation: "spin" | "float" | "pulse" | "tilt";
  svgBlade?: boolean;
  svgColor?: string;
  framed?: boolean;
}

const slides: Slide[] = [
  {
    badge: "Freud — Made in Italy",
    title: "Profesyonel",
    highlight: "Daire Testere Bıçakları",
    description: "Freud LU3D serisi, Anti-Vibration teknolojisi ve Silver I.C.E. kaplama ile üstün performans. 96 diş, 6500 RPM.",
    cta: "Testere Bıçakları",
    href: "/kategori/daire-testere-bicaklari",
    accent: "from-orange-500 to-red-600",
    bgPattern: "radial-gradient(ellipse at 70% 50%, rgba(234,88,12,0.12) 0%, transparent 55%)",
    image: "/images/slide-testere.png",
    imageAlt: "Freud Kırmızı Daire Testere Bıçağı",
    animation: "spin",
  },
  {
    badge: "CNC & El Frezesi",
    title: "Hassas Kesim",
    highlight: "Freze Bıçakları",
    description: "Netmak saplı freze bıçakları — rulmanlı, karbür uçlu, hassas profil ve kanal işleme için profesyonel çözüm.",
    cta: "Freze Bıçakları",
    href: "/kategori/freze-bicaklari",
    accent: "from-blue-500 to-indigo-600",
    bgPattern: "radial-gradient(ellipse at 70% 50%, rgba(59,130,246,0.10) 0%, transparent 55%)",
    image: "/images/slide-freze.png",
    imageAlt: "Saplı Freze Bıçağı",
    animation: "float",
  },
  {
    badge: "Kampanya",
    title: "Göbekli Freze",
    highlight: "%45'e Varan İndirim",
    description: "Seçili göbekli freze bıçakları, kanal açma ve profil bıçaklarında büyük fırsat. Stoklar sınırlı!",
    cta: "Fırsatları Gör",
    href: "/urunler",
    accent: "from-emerald-500 to-teal-600",
    bgPattern: "radial-gradient(ellipse at 70% 50%, rgba(16,185,129,0.10) 0%, transparent 55%)",
    image: "/images/freze-gobek-nobg.png",
    imageAlt: "Göbekli Freze Bıçağı",
    animation: "pulse",
  },
  {
    badge: "Aksiyonda",
    title: "Güç & Hassasiyet",
    highlight: "Her Kesimde Kalite",
    description: "Profesyonel el tipi daire testere makineleri için özel üretim bıçaklar. Ahşap, MDF, laminant — temiz kesim garantisi.",
    cta: "Tüm Ürünler",
    href: "/urunler",
    accent: "from-amber-500 to-orange-600",
    bgPattern: "radial-gradient(ellipse at 70% 50%, rgba(245,158,11,0.10) 0%, transparent 55%)",
    image: "/images/ahsap-testere.jpg",
    imageAlt: "Daire Testere ile Ahşap Kesim",
    animation: "tilt",
    framed: true,
  },
];

function SlideImage({ slide }: { slide: Slide }) {
  if (slide.svgBlade) {
    return <SawBladeAnimation color={slide.svgColor || "#f97316"} />;
  }

  const animationClass = {
    spin: "animate-[spin_12s_linear_infinite]",
    float: "animate-[float_3s_ease-in-out_infinite]",
    pulse: "animate-[pulseScale_3s_ease-in-out_infinite]",
    tilt: "animate-[tiltRock_4s_ease-in-out_infinite]",
  }[slide.animation];

  if (slide.framed) {
    return (
      <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center">
        <div className={animationClass}>
          <div className="relative w-56 h-56 lg:w-72 lg:h-72 rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl shadow-black/40">
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 256px, 320px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
      </div>
    );
  }

  const glowColor = slide.accent.includes("orange") ? "#f9731633" :
    slide.accent.includes("blue") ? "#3b82f633" :
    slide.accent.includes("emerald") ? "#10b98133" :
    "#f59e0b33";

  return (
    <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full opacity-40 blur-3xl -z-10"
        style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
      />
      <div className={animationClass}>
        <div className="relative w-56 h-56 lg:w-72 lg:h-72">
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            sizes="(max-width: 1024px) 256px, 320px"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative bg-bg-dark overflow-hidden h-[520px] md:h-[540px] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 transition-all duration-700" style={{ background: slide.bgPattern }} />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 35px, white 35px, white 36px)",
      }} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 relative w-full">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Left — text (3 cols) */}
          <div className="lg:col-span-3">
            <div
              key={`badge-${current}`}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-5 animate-[fadeSlideUp_0.5s_ease-out]"
            >
              <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${slide.accent}`} />
              <span className="text-sm text-gray-300 font-medium">{slide.badge}</span>
            </div>

            <h1
              key={`title-${current}`}
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.1] mb-5 text-white animate-[fadeSlideUp_0.5s_ease-out_0.1s_both]"
            >
              {slide.title}
              <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.accent}`}>
                {slide.highlight}
              </span>
            </h1>

            <p
              key={`desc-${current}`}
              className="text-base md:text-lg text-gray-400 mb-8 max-w-md leading-relaxed animate-[fadeSlideUp_0.5s_ease-out_0.2s_both]"
            >
              {slide.description}
            </p>

            <div
              key={`cta-${current}`}
              className="flex flex-wrap gap-3 mb-8 animate-[fadeSlideUp_0.5s_ease-out_0.3s_both]"
            >
              <Link
                href={slide.href}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${slide.accent} text-white px-7 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
              >
                {slide.cta}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-7 py-3.5 rounded-xl font-semibold transition-all backdrop-blur-sm"
              >
                Teklif Al
              </Link>
            </div>

            {/* Brand logos */}
            <div className="flex items-center gap-5 pt-6 border-t border-white/10">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest shrink-0">Markalar</span>
              <div className="flex items-center gap-4 flex-wrap">
                {["FREUD", "NETMAK", "KRONBERG", "BOSCH", "KÖNIG"].map((brand) => (
                  <span
                    key={brand}
                    className="text-xs font-bold text-gray-500 hover:text-white transition-colors cursor-pointer tracking-wider px-2 py-1 border border-white/5 rounded-md hover:border-white/20"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — product image (2 cols) */}
          <div className="lg:col-span-2 hidden lg:flex items-center justify-center">
            <div key={`img-${current}`} className="animate-[fadeSlideUp_0.6s_ease-out]">
              <SlideImage slide={slide} />
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="relative"
          >
            <span className={`block transition-all duration-300 rounded-full ${
              i === current
                ? "w-10 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
            }`} />
            {i === current && (
              <span className="absolute inset-0 rounded-full" style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 5s linear infinite",
              }} />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
