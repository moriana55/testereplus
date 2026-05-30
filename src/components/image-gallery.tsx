"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

interface Props {
  images: string[];
  alt: string;
  discount?: number;
}

function Placeholder({ className }: { className?: string }) {
  return (
    <svg className={className || "w-32 h-32 text-gray-200"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

export function ImageGallery({ images, alt, discount }: Props) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const [hoverZoom, setHoverZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainRef = useRef<HTMLDivElement>(null);

  const handleError = useCallback((index: number) => {
    setImgErrors((prev) => new Set(prev).add(index));
  }, []);

  const hasValidImages = images.length > 0;
  const currentImageValid = hasValidImages && !imgErrors.has(selected);

  function handleMouseMove(e: React.MouseEvent) {
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  return (
    <>
      <div className="flex gap-3">
        {/* Vertical thumbnails — left side */}
        {images.length > 1 && (
          <div className="flex flex-col gap-2 shrink-0">
            {images.map((img, i) => (
              <button
                key={i}
                onMouseEnter={() => setSelected(i)}
                onClick={() => setSelected(i)}
                className={`w-16 h-16 border-2 rounded-lg overflow-hidden flex items-center justify-center transition-all ${
                  i === selected
                    ? "border-accent shadow-sm"
                    : "border-border hover:border-accent/40"
                }`}
              >
                {!imgErrors.has(i) ? (
                  <Image
                    src={img}
                    alt={`${alt} - ${i + 1}`}
                    width={64}
                    height={64}
                    className="object-contain p-1"
                    onError={() => handleError(i)}
                  />
                ) : (
                  <Placeholder className="w-6 h-6 text-gray-200" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div
          ref={mainRef}
          className="flex-1 bg-white border border-border rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden cursor-crosshair"
          onMouseEnter={() => currentImageValid && setHoverZoom(true)}
          onMouseLeave={() => setHoverZoom(false)}
          onMouseMove={handleMouseMove}
          onClick={() => currentImageValid && setZoomed(true)}
        >
          {currentImageValid ? (
            <Image
              src={images[selected]}
              alt={alt}
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              onError={() => handleError(selected)}
            />
          ) : (
            <Placeholder />
          )}
          {discount && (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded">
              %{discount} İndirim
            </span>
          )}
          {currentImageValid && !hoverZoom && (
            <div className="absolute bottom-3 right-3 bg-black/40 text-white p-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
              <ZoomIn size={16} />
            </div>
          )}
        </div>

        {/* Hover zoom panel — right side */}
        {hoverZoom && currentImageValid && (
          <div className="hidden lg:block w-[500px] h-[500px] border border-border rounded-2xl overflow-hidden relative bg-white shrink-0 shadow-xl">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${images[selected]})`,
                backgroundSize: "250%",
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        )}
      </div>

      {/* Fullscreen zoom overlay */}
      {zoomed && currentImageValid && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
          >
            <X size={24} />
          </button>
          <div className="relative w-[90vw] h-[90vh]">
            <Image
              src={images[selected]}
              alt={alt}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
