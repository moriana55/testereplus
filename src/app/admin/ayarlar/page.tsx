"use client";

import { useState } from "react";
import { Save, Globe, CreditCard, Truck, Bell, Check } from "lucide-react";

interface Field {
  label: string;
  key: string;
  value: string;
  type: "text" | "email" | "tel" | "password" | "select";
  options?: string[];
}

interface Section {
  title: string;
  icon: typeof Globe;
  fields: Field[];
}

const initialSections: Section[] = [
  {
    title: "Mağaza Bilgileri",
    icon: Globe,
    fields: [
      { label: "Mağaza Adı", key: "storeName", value: "Testere Plus", type: "text" },
      { label: "Site URL", key: "siteUrl", value: "https://testereplus.com", type: "text" },
      { label: "İletişim Email", key: "email", value: "info@testereplus.com", type: "email" },
      { label: "Telefon", key: "phone", value: "0555 123 45 67", type: "tel" },
      { label: "Adres", key: "address", value: "İstanbul, Türkiye", type: "text" },
    ],
  },
  {
    title: "Ödeme Ayarları",
    icon: CreditCard,
    fields: [
      { label: "iyzico API Key", key: "iyzicoApi", value: "sandbox-xxxxx", type: "password" },
      { label: "iyzico Secret Key", key: "iyzicoSecret", value: "sandbox-xxxxx", type: "password" },
      { label: "Kapıda Ödeme", key: "cod", value: "Aktif", type: "select", options: ["Aktif", "Pasif"] },
      { label: "Havale/EFT", key: "eft", value: "Aktif", type: "select", options: ["Aktif", "Pasif"] },
    ],
  },
  {
    title: "Kargo Ayarları",
    icon: Truck,
    fields: [
      { label: "Varsayılan Kargo Firması", key: "defaultCarrier", value: "Yurtiçi Kargo", type: "select", options: ["Yurtiçi Kargo", "Aras Kargo", "MNG Kargo", "Sürat Kargo"] },
      { label: "Ücretsiz Kargo Limiti", key: "freeShipping", value: "0 ₺ (Her zaman ücretsiz)", type: "text" },
      { label: "Kargo API Entegrasyonu", key: "cargoApi", value: "Aktif", type: "select", options: ["Aktif", "Pasif"] },
    ],
  },
  {
    title: "Bildirim Ayarları",
    icon: Bell,
    fields: [
      { label: "Yeni Sipariş Bildirimi", key: "notifOrder", value: "Aktif", type: "select", options: ["Aktif", "Pasif"] },
      { label: "Stok Uyarı Bildirimi", key: "notifStock", value: "Aktif", type: "select", options: ["Aktif", "Pasif"] },
      { label: "WhatsApp Bildirimi", key: "notifWhatsapp", value: "Aktif", type: "select", options: ["Aktif", "Pasif"] },
      { label: "Email Bildirimi", key: "notifEmail", value: "Aktif", type: "select", options: ["Aktif", "Pasif"] },
    ],
  },
];

function loadSettings(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("tp-settings") || "{}");
  } catch { return {}; }
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const stored = loadSettings();
    const defaults: Record<string, string> = {};
    initialSections.forEach((s) => s.fields.forEach((f) => { defaults[f.key] = stored[f.key] || f.value; }));
    return defaults;
  });

  function handleSave() {
    localStorage.setItem("tp-settings", JSON.stringify(values));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateField(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Mağaza ve sistem ayarlarını yapılandır</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium transition-colors ${saved ? "bg-green-500" : "bg-orange-500 hover:bg-orange-600"}`}>
          {saved ? <><Check size={16} /> Kaydedildi!</> : <><Save size={16} /> Kaydet</>}
        </button>
      </div>

      {initialSections.map((section) => (
        <div key={section.title} className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <section.icon size={20} className="text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">{section.title}</h2>
          </div>
          <div className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.key} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-sm font-medium text-gray-700">{field.label}</label>
                <div className="sm:col-span-2">
                  {field.type === "select" && field.options ? (
                    <select value={values[field.key]} onChange={(e) => updateField(field.key, e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                      {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={values[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
