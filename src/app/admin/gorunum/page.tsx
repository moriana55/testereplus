"use client";

import { useState, useEffect } from "react";
import { Palette, Save, Monitor, Sun, Moon, Check } from "lucide-react";

function loadThemeSettings() {
  if (typeof window === "undefined") return { accent: "#ea580c", theme: "light" };
  try {
    const stored = JSON.parse(localStorage.getItem("tp-theme") || "{}");
    return { accent: stored.accent || "#ea580c", theme: stored.theme || "light" };
  } catch { return { accent: "#ea580c", theme: "light" }; }
}

export default function AppearancePage() {
  const [accent, setAccent] = useState("#ea580c");
  const [theme, setTheme] = useState("light");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = loadThemeSettings();
    setAccent(s.accent);
    setTheme(s.theme);
  }, []);

  const colors = [
    { value: "#ea580c", label: "Turuncu" },
    { value: "#2563eb", label: "Mavi" },
    { value: "#16a34a", label: "Yeşil" },
    { value: "#dc2626", label: "Kırmızı" },
    { value: "#7c3aed", label: "Mor" },
    { value: "#0891b2", label: "Teal" },
  ];

  function handleSave() {
    localStorage.setItem("tp-theme", JSON.stringify({ accent, theme }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Görünüm</h1>
          <p className="text-sm text-gray-500 mt-0.5">Site tema ve renk ayarları</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium transition-colors ${saved ? "bg-green-500" : "bg-orange-500 hover:bg-orange-600"}`}>
          {saved ? <><Check size={16} /> Kaydedildi!</> : <><Save size={16} /> Kaydet</>}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Palette size={20} className="text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Accent Renk</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => setAccent(c.value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${accent === c.value ? "border-gray-900 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="w-10 h-10 rounded-full shadow-inner" style={{ backgroundColor: c.value }} />
              <span className="text-xs font-medium text-gray-600">{c.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm text-gray-600">Özel renk:</label>
          <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
          <span className="text-xs font-mono text-gray-400">{accent}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Monitor size={20} className="text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Tema</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "light", label: "Açık", icon: Sun },
            { value: "dark", label: "Koyu", icon: Moon },
            { value: "system", label: "Sistem", icon: Monitor },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${theme === t.value ? "border-gray-900 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
            >
              <t.icon size={24} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Önizleme</h2>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="h-10 flex items-center px-4" style={{ backgroundColor: accent }}>
            <span className="text-white text-sm font-bold">TESTERE PLUS</span>
          </div>
          <div className="p-4 bg-gray-50">
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-2 bg-gray-100 rounded w-1/2 mb-3" />
                <button className="px-3 py-1.5 text-white text-xs rounded-lg font-medium" style={{ backgroundColor: accent }}>
                  Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
