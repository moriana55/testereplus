"use client";

import { useState } from "react";
import {
  Globe,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  FileText,
  Link2,
  Zap,
} from "lucide-react";

interface SeoScore {
  page: string;
  url: string;
  score: number;
  issues: number;
  status: string;
}

const initialScores: SeoScore[] = [
  { page: "Ana Sayfa", url: "/", score: 92, issues: 1, status: "good" },
  { page: "Freud Daire Testere 250x80", url: "/urunler/freud-aluminyum-daire-testere-250x80", score: 88, issues: 2, status: "good" },
  { page: "Daire Testere Bıçakları", url: "/kategori/daire-testere-bicaklari", score: 75, issues: 4, status: "warning" },
  { page: "Tüm Ürünler", url: "/urunler", score: 82, issues: 3, status: "good" },
  { page: "CNC Freze Uçlarının Önemi", url: "/blog/cnc-freze-uclarinin-onemi", score: 95, issues: 0, status: "good" },
  { page: "İletişim", url: "/iletisim", score: 68, issues: 5, status: "warning" },
  { page: "Hakkımızda", url: "/hakkimizda", score: 71, issues: 3, status: "warning" },
];

const issues = [
  { type: "error", icon: AlertTriangle, message: "3 sayfada meta description eksik", pages: ["/iletisim", "/hakkimizda", "/kategori/metal-testere-bicaklari"] },
  { type: "warning", icon: AlertTriangle, message: "5 üründe alt text eksik görseller var", pages: ["Ürün görselleri"] },
  { type: "warning", icon: AlertTriangle, message: "2 sayfada H1 etiketi birden fazla", pages: ["/urunler", "/kategori/daire-testere-bicaklari"] },
  { type: "info", icon: Zap, message: "Sitemap.xml güncel", pages: [] },
  { type: "info", icon: CheckCircle2, message: "robots.txt doğru yapılandırılmış", pages: [] },
];

const keywords = [
  { keyword: "daire testere bıçağı", position: 8, change: 3, volume: 2400 },
  { keyword: "testere bıçağı fiyatları", position: 12, change: -2, volume: 1800 },
  { keyword: "freud testere", position: 5, change: 1, volume: 890 },
  { keyword: "cnc freze ucu", position: 15, change: 5, volume: 720 },
  { keyword: "şerit testere bıçağı", position: 18, change: 0, volume: 640 },
  { keyword: "ahşap kesme testere", position: 22, change: -1, volume: 1200 },
];

export default function SeoPage() {
  const [scores, setScores] = useState<SeoScore[]>(initialScores);
  const [scanning, setScanning] = useState(false);

  function handleScan() {
    setScanning(true);
    setTimeout(() => {
      setScores((prev) =>
        prev.map((s) => {
          const delta = Math.floor(Math.random() * 5) - 2;
          const newScore = Math.min(100, Math.max(0, s.score + delta));
          const newIssues = Math.max(0, s.issues + (delta < 0 ? 1 : delta > 0 ? -1 : 0));
          return { ...s, score: newScore, issues: newIssues };
        })
      );
      setScanning(false);
      alert("SEO taraması tamamlandı!");
    }, 1500);
  }

  const avgScore = Math.round(scores.reduce((s, p) => s + p.score, 0) / scores.length);
  const totalIssues = scores.reduce((s, p) => s + p.issues, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Site SEO performansını izle ve optimize et</p>
        </div>
        <button onClick={handleScan} disabled={scanning} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50">
          <RefreshCw size={16} className={scanning ? "animate-spin" : ""} />
          {scanning ? "Taranıyor..." : "Yeniden Tara"}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Globe size={16} className="text-green-500" /><span className="text-xs text-gray-500 font-medium">Genel SEO Skoru</span></div>
          <p className="text-3xl font-bold text-green-600">{avgScore}<span className="text-sm font-normal text-gray-400">/100</span></p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><FileText size={16} className="text-blue-500" /><span className="text-xs text-gray-500 font-medium">İndeksli Sayfa</span></div>
          <p className="text-2xl font-bold text-gray-900">24</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle size={16} className="text-amber-500" /><span className="text-xs text-gray-500 font-medium">Sorunlar</span></div>
          <p className="text-2xl font-bold text-amber-600">{totalIssues}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Link2 size={16} className="text-purple-500" /><span className="text-xs text-gray-500 font-medium">Backlink</span></div>
          <p className="text-2xl font-bold text-gray-900">47</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Sayfa SEO Skorları</h2>
          <div className="space-y-3">
            {scores.map((page) => (
              <div key={page.url} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                  page.score >= 80 ? "bg-green-50 text-green-600" : page.score >= 60 ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"
                }`}>
                  {page.score}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{page.page}</p>
                  <p className="text-xs text-gray-400 truncate">{page.url}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {page.issues > 0 && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{page.issues} sorun</span>
                  )}
                  <a href={page.url} target="_blank" className="p-1 rounded hover:bg-gray-100">
                    <ExternalLink size={14} className="text-gray-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Anahtar Kelime Sıralamaları</h2>
          <div className="space-y-3">
            {keywords.map((kw) => (
              <div key={kw.keyword} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-600">#{kw.position}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{kw.keyword}</p>
                  <p className="text-xs text-gray-400">Aylık arama: {kw.volume.toLocaleString()}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  kw.change > 0 ? "bg-green-50 text-green-600" : kw.change < 0 ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"
                }`}>
                  {kw.change > 0 ? `+${kw.change}` : kw.change === 0 ? "—" : kw.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">SEO Sorunları & Öneriler</h2>
        <div className="space-y-2">
          {issues.map((issue, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
              issue.type === "error" ? "bg-red-50" : issue.type === "warning" ? "bg-amber-50" : "bg-green-50"
            }`}>
              <issue.icon size={16} className={`shrink-0 mt-0.5 ${
                issue.type === "error" ? "text-red-500" : issue.type === "warning" ? "text-amber-500" : "text-green-500"
              }`} />
              <div>
                <p className="text-sm font-medium text-gray-800">{issue.message}</p>
                {issue.pages.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">{issue.pages.join(", ")}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
