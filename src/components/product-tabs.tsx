"use client";

import { useState } from "react";
import { FileText, MessageSquare, HelpCircle, Download } from "lucide-react";
import { type Product, type DownloadItem, type MaterialCompatibility } from "@/lib/data";
import { MaterialCompatibilityBadges } from "./material-compatibility";

interface Props {
  description: string;
  overview?: string;
  specs: Record<string, string>;
  materials: MaterialCompatibility[];
  downloads: DownloadItem[];
}

const tabs = [
  { id: "overview", label: "Genel Bakış", icon: FileText },
  { id: "reviews", label: "Yorumlar", icon: MessageSquare },
  { id: "qa", label: "Soru & Cevap", icon: HelpCircle },
  { id: "downloads", label: "İndirmeler", icon: Download },
];

export function ProductTabs({ description, overview, specs, materials, downloads }: Props) {
  const [active, setActive] = useState("overview");

  return (
    <div className="mt-12">
      {/* Tab headers */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                active === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-text-primary hover:border-border"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.id === "downloads" && downloads.length > 0 && (
                <span className="bg-accent-bg text-accent text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {downloads.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="py-8">
        {active === "overview" && (
          <div className="space-y-8">
            {/* Description */}
            <div className="max-w-3xl">
              <p className="text-text-secondary leading-relaxed text-base">
                {overview || description}
              </p>
            </div>

            {/* Specs table */}
            <div>
              <h3 className="text-base font-bold text-text-primary mb-4">Teknik Özellikler</h3>
              <div className="bg-white border border-border rounded-2xl overflow-hidden max-w-2xl">
                <table className="w-full">
                  <tbody>
                    {Object.entries(specs).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? "bg-bg-secondary" : "bg-white"}>
                        <td className="px-5 py-3.5 text-sm text-text-muted font-medium w-1/3">{key}</td>
                        <td className="px-5 py-3.5 text-sm text-text-primary font-semibold">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Materials */}
            {materials.length > 0 && (
              <MaterialCompatibilityBadges materials={materials} />
            )}
          </div>
        )}

        {active === "reviews" && (
          <div className="text-center py-12 max-w-md mx-auto">
            <MessageSquare size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-bold text-text-primary mb-2">Henüz Yorum Yok</h3>
            <p className="text-sm text-text-muted mb-6">
              Bu ürünü kullanan ilk kişi siz olun ve deneyiminizi paylaşın.
            </p>
            <a
              href="https://wa.me/905551234567?text=Merhaba, ürün hakkında yorum bırakmak istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Yorum Yaz
            </a>
          </div>
        )}

        {active === "qa" && (
          <div className="text-center py-12 max-w-md mx-auto">
            <HelpCircle size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-bold text-text-primary mb-2">Soru Sorun</h3>
            <p className="text-sm text-text-muted mb-6">
              Bu ürün hakkında merak ettiğiniz her şeyi WhatsApp üzerinden sorabilirsiniz.
            </p>
            <a
              href="https://wa.me/905551234567?text=Merhaba, ürün hakkında bir sorum var."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.347 0-4.518-.809-6.235-2.16l-.436-.35-3.022 1.012 1.012-3.022-.35-.436A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              WhatsApp ile Sor
            </a>
          </div>
        )}

        {active === "downloads" && (
          <div>
            {downloads.length > 0 ? (
              <div className="space-y-3 max-w-2xl">
                {downloads.map((dl, i) => (
                  <a
                    key={i}
                    href={dl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl hover:border-accent/40 hover:shadow-sm transition-all group"
                  >
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={22} className="text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {dl.label}
                      </p>
                      <p className="text-xs text-text-muted">
                        {dl.fileType.toUpperCase()}
                        {dl.sizeMb && ` · ${dl.sizeMb} MB`}
                      </p>
                    </div>
                    <Download size={18} className="text-text-muted group-hover:text-accent transition-colors" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Download size={48} className="mx-auto text-text-muted mb-4" />
                <p className="text-text-muted">Bu ürün için indirilebilir dosya bulunamadı.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
