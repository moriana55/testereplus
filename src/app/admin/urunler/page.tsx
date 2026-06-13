"use client";

import { useState, useMemo, useRef, type ChangeEvent, type DragEvent } from "react";
import {
  Search, Download, Plus, Edit2, Trash2, Copy, ChevronLeft, ChevronRight,
  ArrowUpDown, Image as ImageIcon, X, GripVertical, Upload, Eye, Save,
  ArrowLeft, PlusCircle, Layers, FileText, Tag, Settings2, BarChart3, FileUp,
} from "lucide-react";
import rawProducts from "@/data/ideasoft-products.json";
import rawBrands from "@/data/ideasoft-brands.json";
import { useLocalState } from "@/lib/use-local-state";
import { SearchableSelect } from "@/components/admin/searchable-select";

// ─── Types ───
interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  image: string;
  attributes: Record<string, string>;
}

interface Product {
  id: number;
  slug: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  subCategory: string;
  price: number;
  oldPrice: number;
  stock: number;
  status: string;
  url: string;
  image: string;
  images: string[];
  description: string;
  overview: string;
  specs: Record<string, string>;
  bulletPoints: string[];
  variants: Variant[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  seoCanonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  altText: string;
  weight: string;
  barcode: string;
}

const initialProducts: Product[] = (rawProducts as any[]).map((p, i) => ({
  id: i + 1,
  slug: p.slug || "",
  name: p.name || "",
  sku: p.sku || "",
  brand: p.brand || "",
  category: p.category || "",
  subCategory: p.subCategory || "",
  price: p.price || 0,
  oldPrice: p.oldPrice || 0,
  stock: p.stock || 0,
  status: p.status || "active",
  url: p.url || "",
  image: p.image || "",
  images: p.images || [],
  description: p.description || "",
  overview: p.overview || "",
  specs: p.specs || {},
  bulletPoints: p.bulletPoints || [],
  variants: p.variants || [],
  seoTitle: p.seoTitle || "",
  seoDescription: p.seoDescription || "",
  seoKeywords: p.seoKeywords || [],
  seoCanonical: p.seoCanonical || "",
  ogTitle: p.ogTitle || "",
  ogDescription: p.ogDescription || "",
  ogImage: p.ogImage || "",
  altText: p.altText || "",
  weight: p.weight || "",
  barcode: p.barcode || "",
}));

const allBrands = (rawBrands as { name: string }[]).map((b) => b.name);
const allCategories = [...new Set(initialProducts.map((p) => p.category).filter(Boolean))].sort();
const PER_PAGE = 20;

function toSlug(s: string) {
  return s.toLowerCase().replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

type SortKey = "name" | "price" | "stock";

// ─── Image Upload Component ───
function ImageUploader({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newImages = [...images];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      newImages.push(url);
    });
    onChange(newImages);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function reorder(from: number, to: number) {
    const arr = [...images];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    onChange(arr);
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragOver ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <Upload size={32} className="mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-500 font-medium">Görselleri sürükle veya tıkla</p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP — max 5MB</p>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-3 mt-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (dragIdx !== null) reorder(dragIdx, idx); setDragIdx(null); }}
              className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <GripVertical size={16} className="text-white cursor-grab" />
                <button onClick={() => onChange(images.filter((_, i) => i !== idx))} className="p-1 bg-red-500 rounded-lg text-white hover:bg-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">ANA</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Variant Editor ───
function VariantEditor({ variants, onChange }: { variants: Variant[]; onChange: (v: Variant[]) => void }) {
  const [attrKeys, setAttrKeys] = useState<string[]>(() => {
    const keys = new Set<string>();
    variants.forEach((v) => Object.keys(v.attributes).forEach((k) => keys.add(k)));
    return keys.size > 0 ? [...keys] : ["Çap", "Diş Sayısı"];
  });
  const [newKey, setNewKey] = useState("");

  function addAttrKey() {
    if (newKey.trim() && !attrKeys.includes(newKey.trim())) {
      setAttrKeys([...attrKeys, newKey.trim()]);
      setNewKey("");
    }
  }

  function addVariant() {
    const attrs: Record<string, string> = {};
    attrKeys.forEach((k) => (attrs[k] = ""));
    onChange([...variants, { id: genId(), name: "", sku: "", price: 0, stock: 0, image: "", attributes: attrs }]);
  }

  function updateVariant(idx: number, field: string, value: any) {
    const updated = [...variants];
    if (field.startsWith("attr:")) {
      updated[idx] = { ...updated[idx], attributes: { ...updated[idx].attributes, [field.slice(5)]: value } };
    } else {
      (updated[idx] as any)[field] = value;
    }
    onChange(updated);
  }

  function removeVariant(idx: number) {
    onChange(variants.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      {/* Attribute Keys */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Varyant Özellikleri</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {attrKeys.map((key) => (
            <span key={key} className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-full">
              {key}
              <button onClick={() => setAttrKeys(attrKeys.filter((k) => k !== key))} className="hover:text-red-500">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAttrKey())}
            placeholder="Yeni özellik ekle (ör: Renk, Boyut)"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
          <button onClick={addAttrKey} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">Ekle</button>
        </div>
      </div>

      {/* Variant Table */}
      {variants.length > 0 && (
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {attrKeys.map((key) => (
                  <th key={key} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">{key}</th>
                ))}
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Fiyat</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Stok</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Görsel</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v, idx) => (
                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  {attrKeys.map((key) => (
                    <td key={key} className="px-3 py-2">
                      <input
                        value={v.attributes[key] || ""}
                        onChange={(e) => updateVariant(idx, `attr:${key}`, e.target.value)}
                        placeholder={key}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <input
                      value={v.sku}
                      onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                      placeholder="SKU"
                      className="w-24 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/30"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={v.price || ""}
                      onChange={(e) => updateVariant(idx, "price", Number(e.target.value))}
                      className="w-24 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-orange-500/30"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={v.stock || ""}
                      onChange={(e) => updateVariant(idx, "stock", Number(e.target.value))}
                      className="w-20 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-orange-500/30"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <label className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 mx-auto">
                      {v.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={v.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <ImageIcon size={14} className="text-gray-300" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) updateVariant(idx, "image", URL.createObjectURL(f));
                        }}
                      />
                    </label>
                  </td>
                  <td className="px-2">
                    <button onClick={() => removeVariant(idx)} className="p-1.5 rounded-lg hover:bg-red-50">
                      <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button onClick={addVariant} className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium">
        <PlusCircle size={16} />
        Varyant Ekle
      </button>
    </div>
  );
}

// ─── Spec Editor ───
function SpecEditor({ specs, onChange }: { specs: Record<string, string>; onChange: (s: Record<string, string>) => void }) {
  const entries = Object.entries(specs);

  function update(oldKey: string, newKey: string, value: string) {
    const updated = { ...specs };
    if (oldKey !== newKey) delete updated[oldKey];
    updated[newKey] = value;
    onChange(updated);
  }

  function add() {
    onChange({ ...specs, "": "" });
  }

  function remove(key: string) {
    const updated = { ...specs };
    delete updated[key];
    onChange(updated);
  }

  return (
    <div className="space-y-2">
      {entries.map(([key, value], idx) => (
        <div key={idx} className="flex gap-2">
          <input
            value={key}
            onChange={(e) => update(key, e.target.value, value)}
            placeholder="Özellik adı"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500"
          />
          <input
            value={value}
            onChange={(e) => update(key, key, e.target.value)}
            placeholder="Değer"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500"
          />
          <button onClick={() => remove(key)} className="p-2 hover:bg-red-50 rounded-lg">
            <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 font-medium">
        <PlusCircle size={14} />
        Özellik Ekle
      </button>
    </div>
  );
}

// ─── Bullet Points Editor ───
function BulletEditor({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <span className="text-gray-300 text-sm mt-2.5">•</span>
          <input
            value={item}
            onChange={(e) => { const arr = [...items]; arr[idx] = e.target.value; onChange(arr); }}
            placeholder="Öne çıkan özellik"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500"
          />
          <button onClick={() => onChange(items.filter((_, i) => i !== idx))} className="p-2 hover:bg-red-50 rounded-lg">
            <X size={14} className="text-gray-400" />
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ""])} className="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 font-medium">
        <PlusCircle size={14} />
        Madde Ekle
      </button>
    </div>
  );
}

// ─── Main Page ───
export default function ProductsPage() {
  const [products, setProducts] = useLocalState<Product[]>("tp_admin_products", initialProducts);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  // Editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editorTab, setEditorTab] = useState<"general" | "images" | "variants" | "specs" | "seo">("general");
  const [form, setForm] = useState<Omit<Product, "id">>({
    slug: "", name: "", sku: "", brand: "", category: "", subCategory: "",
    price: 0, oldPrice: 0, stock: 0, status: "active", url: "", image: "",
    images: [], description: "", overview: "", specs: {}, bulletPoints: [],
    variants: [], seoTitle: "", seoDescription: "", seoKeywords: [], seoCanonical: "", ogTitle: "", ogDescription: "", ogImage: "", altText: "", weight: "", barcode: "",
  });

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
      if (catFilter !== "all" && p.category !== catFilter) return false;
      if (brandFilter !== "all" && p.brand !== brandFilter) return false;
      if (statusFilter === "active" && p.status !== "active") return false;
      if (statusFilter === "passive" && p.status !== "passive") return false;
      if (statusFilter === "nostock" && p.stock > 0) return false;
      return true;
    });
    list.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") return sortAsc ? (av as string).localeCompare(bv as string, "tr") : (bv as string).localeCompare(av as string, "tr");
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return list;
  }, [products, search, catFilter, brandFilter, statusFilter, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }

  function openNew() {
    setForm({
      slug: "", name: "", sku: "", brand: "", category: "", subCategory: "",
      price: 0, oldPrice: 0, stock: 0, status: "active", url: "", image: "",
      images: [], description: "", overview: "", specs: {}, bulletPoints: [],
      variants: [], seoTitle: "", seoDescription: "", seoKeywords: [], seoCanonical: "", ogTitle: "", ogDescription: "", ogImage: "", altText: "", weight: "", barcode: "",
    });
    setEditId(null);
    setEditorTab("general");
    setEditorOpen(true);
  }

  function openEdit(p: Product) {
    setForm({ ...p });
    setEditId(p.id);
    setEditorTab("general");
    setEditorOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;
    const slug = form.slug || toSlug(form.name);
    const mainImage = form.images.length > 0 ? form.images[0] : form.image;
    if (editId) {
      setProducts((prev) => prev.map((p) => p.id === editId ? { ...p, ...form, slug, image: mainImage } : p));
    } else {
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
      setProducts((prev) => [...prev, { ...form, id: newId, slug, image: mainImage }]);
    }
    setEditorOpen(false);
  }

  function deleteProduct(id: number) {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function duplicateProduct(p: Product) {
    const newId = Math.max(0, ...products.map((x) => x.id)) + 1;
    setProducts((prev) => [...prev, { ...p, id: newId, sku: p.sku + "-COPY", name: p.name + " (Kopya)" }]);
  }

  function exportCSV() {
    const header = "SKU,Ürün Adı,Marka,Kategori,Alt Kategori,Fiyat,Eski Fiyat,Stok,Durum,Slug,Açıklama,Ağırlık,Barkod\n";
    const rows = products.map((p) =>
      `"${p.sku}","${p.name}","${p.brand}","${p.category}","${p.subCategory}",${p.price},${p.oldPrice},${p.stock},"${p.status}","${p.slug}","${(p.description || "").replace(/"/g, '""')}","${p.weight}","${p.barcode}"`
    ).join("\n");
    const bom = "﻿";
    const blob = new Blob([bom + header + rows], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "urunler.csv"; a.click();
  }

  const csvInputRef = useRef<HTMLInputElement>(null);

  function importCSV(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim());
      if (lines.length < 2) { alert("CSV dosyası boş veya hatalı"); return; }
      const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
      const nameIdx = headers.findIndex((h) => /ürün adı|name/i.test(h));
      const skuIdx = headers.findIndex((h) => /sku/i.test(h));
      const brandIdx = headers.findIndex((h) => /marka|brand/i.test(h));
      const catIdx = headers.findIndex((h) => /kategori|category/i.test(h));
      const subCatIdx = headers.findIndex((h) => /alt kategori|subcategory/i.test(h));
      const priceIdx = headers.findIndex((h) => /fiyat|price/i.test(h));
      const oldPriceIdx = headers.findIndex((h) => /eski fiyat|old.?price/i.test(h));
      const stockIdx = headers.findIndex((h) => /stok|stock/i.test(h));
      const statusIdx = headers.findIndex((h) => /durum|status/i.test(h));
      const slugIdx = headers.findIndex((h) => /slug/i.test(h));
      const descIdx = headers.findIndex((h) => /açıklama|description/i.test(h));
      const weightIdx = headers.findIndex((h) => /ağırlık|weight/i.test(h));
      const barcodeIdx = headers.findIndex((h) => /barkod|barcode/i.test(h));

      if (nameIdx === -1) { alert("CSV'de 'Ürün Adı' sütunu bulunamadı"); return; }

      function parseCSVLine(line: string): string[] {
        const cols: string[] = [];
        let cur = "", inQuote = false;
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (ch === '"') { if (inQuote && line[i + 1] === '"') { cur += '"'; i++; } else inQuote = !inQuote; }
          else if (ch === ',' && !inQuote) { cols.push(cur); cur = ""; }
          else cur += ch;
        }
        cols.push(cur);
        return cols;
      }

      let maxId = Math.max(0, ...products.map((p) => p.id));
      const newProducts: Product[] = [];
      let updated = 0;
      const existingMap = new Map(products.map((p) => [p.sku, p]));

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        const name = cols[nameIdx]?.trim();
        if (!name) continue;
        const sku = skuIdx >= 0 ? cols[skuIdx]?.trim() || "" : "";
        const existing = sku ? existingMap.get(sku) : undefined;

        const product: Product = {
          ...(existing || {
            id: ++maxId, images: [], description: "", overview: "", specs: {}, bulletPoints: [],
            variants: [], seoTitle: "", seoDescription: "", seoKeywords: [], seoCanonical: "",
            ogTitle: "", ogDescription: "", ogImage: "", altText: "", url: "", image: "",
          }),
          name,
          sku,
          slug: slugIdx >= 0 && cols[slugIdx]?.trim() ? cols[slugIdx].trim() : toSlug(name),
          brand: brandIdx >= 0 ? cols[brandIdx]?.trim() || "" : "",
          category: catIdx >= 0 ? cols[catIdx]?.trim() || "" : "",
          subCategory: subCatIdx >= 0 ? cols[subCatIdx]?.trim() || "" : "",
          price: priceIdx >= 0 ? parseFloat(cols[priceIdx]) || 0 : 0,
          oldPrice: oldPriceIdx >= 0 ? parseFloat(cols[oldPriceIdx]) || 0 : 0,
          stock: stockIdx >= 0 ? parseInt(cols[stockIdx]) || 0 : 0,
          status: statusIdx >= 0 ? cols[statusIdx]?.trim() || "active" : "active",
          description: descIdx >= 0 ? cols[descIdx]?.trim() || (existing?.description || "") : (existing?.description || ""),
          weight: weightIdx >= 0 ? cols[weightIdx]?.trim() || "" : "",
          barcode: barcodeIdx >= 0 ? cols[barcodeIdx]?.trim() || "" : "",
        };

        if (existing) {
          existingMap.set(sku, product);
          updated++;
        } else {
          newProducts.push(product);
        }
      }

      setProducts((prev) => {
        const updatedList = prev.map((p) => existingMap.get(p.sku) || p);
        return [...updatedList, ...newProducts];
      });

      alert(`${newProducts.length} yeni ürün eklendi, ${updated} ürün güncellendi.`);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function bulkDelete() {
    if (!confirm(`${selected.size} ürünü silmek istediğinize emin misiniz?`)) return;
    setProducts((prev) => prev.filter((p) => !selected.has(p.id)));
    setSelected(new Set());
  }

  function bulkToggleStatus() {
    setProducts((prev) => prev.map((p) => selected.has(p.id) ? { ...p, status: p.status === "active" ? "passive" : "active" } : p));
    setSelected(new Set());
  }

  // ─── EDITOR VIEW ───
  if (editorOpen) {
    const tabs = [
      { id: "general" as const, label: "Genel", icon: FileText },
      { id: "images" as const, label: "Görseller", icon: ImageIcon },
      { id: "variants" as const, label: "Varyantlar", icon: Layers },
      { id: "specs" as const, label: "Özellikler", icon: Settings2 },
      { id: "seo" as const, label: "SEO", icon: BarChart3 },
    ];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setEditorOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} className="text-gray-500" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{editId ? "Ürün Düzenle" : "Yeni Ürün"}</h1>
              {form.name && <p className="text-sm text-gray-500">{form.name}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditorOpen(false)} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
              İptal
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold">
              <Save size={16} />
              {editId ? "Güncelle" : "Kaydet"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setEditorTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                editorTab === id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={16} />
              {label}
              {id === "variants" && form.variants.length > 0 && (
                <span className="bg-orange-100 text-orange-600 text-xs px-1.5 py-0.5 rounded-full font-bold">{form.variants.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl">
          {editorTab === "general" && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Temel Bilgiler</h3>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Ürün Adı *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Örn: Freud Çok Amaçlı Daire Testere Bıçağı 250mm"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">SKU</label>
                    <input
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      placeholder="TP-00001"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Barkod</label>
                    <input
                      value={form.barcode}
                      onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                      placeholder="8690000000000"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Slug</label>
                    <input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="otomatik oluşturulur"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-400"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <SearchableSelect
                    label="Marka"
                    value={form.brand}
                    onChange={(v) => setForm({ ...form, brand: v })}
                    options={allBrands.map((b) => ({ value: b, label: b }))}
                    placeholder="Marka seçin..."
                  />
                  <SearchableSelect
                    label="Kategori"
                    value={form.category}
                    onChange={(v) => setForm({ ...form, category: v })}
                    options={allCategories.map((c) => ({ value: c, label: c }))}
                    placeholder="Kategori seçin..."
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Fiyat ve Stok</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Satış Fiyatı (₺) *</label>
                    <input
                      type="number"
                      value={form.price || ""}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Eski Fiyat (₺)</label>
                    <input
                      type="number"
                      value={form.oldPrice || ""}
                      onChange={(e) => setForm({ ...form, oldPrice: Number(e.target.value) })}
                      placeholder="İndirimli ise"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Stok</label>
                    <input
                      type="number"
                      value={form.stock || ""}
                      onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Ağırlık (kg)</label>
                    <input
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                      placeholder="0.5"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Durum</label>
                  <div className="flex gap-3">
                    {[
                      { id: "active", label: "Aktif", color: "bg-green-50 border-green-200 text-green-700" },
                      { id: "passive", label: "Pasif", color: "bg-gray-50 border-gray-200 text-gray-500" },
                    ].map((s) => (
                      <label
                        key={s.id}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                          form.status === s.id ? s.color + " ring-2 ring-offset-1 ring-orange-500/20" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={s.id}
                          checked={form.status === s.id}
                          onChange={(e) => setForm({ ...form, status: e.target.value })}
                          className="accent-orange-500"
                        />
                        <span className="text-sm font-medium">{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Açıklama</h3>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Kısa Açıklama</label>
                  <textarea
                    value={form.overview}
                    onChange={(e) => setForm({ ...form, overview: e.target.value })}
                    rows={3}
                    placeholder="Ürünün kısa tanıtımı — listeleme sayfalarında görünür"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Detaylı Açıklama</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={8}
                    placeholder="Ürünün detaylı açıklaması — HTML desteklenir"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-y"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Öne Çıkan Özellikler</label>
                  <BulletEditor items={form.bulletPoints} onChange={(items) => setForm({ ...form, bulletPoints: items })} />
                </div>
              </div>
            </div>
          )}

          {editorTab === "images" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Ürün Görselleri</h3>
              <p className="text-sm text-gray-500 mb-4">İlk görsel ana görsel olarak kullanılır. Sürükleyerek sıralayabilirsiniz.</p>
              <ImageUploader images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} />
            </div>
          )}

          {editorTab === "variants" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Varyantlar</h3>
                  <p className="text-sm text-gray-500 mt-1">Çap, diş sayısı, renk gibi seçenekler ekleyin. Her varyantın kendi SKU, fiyat, stok ve görseli olabilir.</p>
                </div>
              </div>
              <VariantEditor variants={form.variants} onChange={(v) => setForm({ ...form, variants: v })} />
            </div>
          )}

          {editorTab === "specs" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Teknik Özellikler</h3>
              <p className="text-sm text-gray-500 mb-4">Ürün detay sayfasında tablo olarak gösterilir.</p>
              <SpecEditor specs={form.specs} onChange={(s) => setForm({ ...form, specs: s })} />
            </div>
          )}

          {editorTab === "seo" && (() => {
            const title = form.seoTitle || form.name || "";
            const desc = form.seoDescription || form.overview || form.description?.slice(0, 160) || "";
            const slug = form.slug || toSlug(form.name || "urun-adi");
            const keywords = form.seoKeywords || [];

            // SEO Score
            const checks = [
              { label: "SEO Başlık doldurulmuş", ok: title.length > 0, tip: "Başlık boş — ürün adı kullanılacak" },
              { label: "Başlık 30-60 karakter arası", ok: title.length >= 30 && title.length <= 60, tip: `Şu an ${title.length} karakter` },
              { label: "Meta açıklama doldurulmuş", ok: desc.length > 0, tip: "Açıklama boş — kısa açıklama kullanılacak" },
              { label: "Açıklama 120-160 karakter arası", ok: desc.length >= 120 && desc.length <= 160, tip: `Şu an ${desc.length} karakter` },
              { label: "En az 3 anahtar kelime", ok: keywords.length >= 3, tip: `Şu an ${keywords.length} kelime` },
              { label: "Başlıkta anahtar kelime var", ok: keywords.length > 0 && keywords.some((k) => title.toLowerCase().includes(k.toLowerCase())), tip: "Ana anahtar kelimeyi başlığa ekle" },
              { label: "Açıklamada anahtar kelime var", ok: keywords.length > 0 && keywords.some((k) => desc.toLowerCase().includes(k.toLowerCase())), tip: "Ana anahtar kelimeyi açıklamaya ekle" },
              { label: "Slug SEO uyumlu", ok: slug.length > 0 && slug.length <= 75, tip: "Kısa ve anahtar kelime içeren slug kullan" },
              { label: "Görsel alt text doldurulmuş", ok: (form.altText || "").length > 0, tip: "Ana görsel için alt text ekle" },
              { label: "Ürün açıklaması 300+ karakter", ok: (form.description || "").length >= 300, tip: `Şu an ${(form.description || "").length} karakter — daha uzun açıklama yaz` },
            ];
            const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
            const scoreColor = score >= 80 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-red-500";
            const scoreBg = score >= 80 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";

            return (
            <div className="space-y-6">
              {/* SEO Score */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">SEO Skoru</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${scoreColor}`}>{score}</span>
                    <span className="text-sm text-gray-400">/100</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                  <div className={`h-2.5 rounded-full transition-all ${scoreBg}`} style={{ width: `${score}%` }} />
                </div>
                <div className="space-y-2">
                  {checks.map((c, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs shrink-0 ${c.ok ? "bg-green-500" : "bg-gray-300"}`}>
                        {c.ok ? "✓" : "!"}
                      </span>
                      <div>
                        <p className={`text-sm ${c.ok ? "text-gray-700" : "text-gray-500"}`}>{c.label}</p>
                        {!c.ok && <p className="text-xs text-amber-600 mt-0.5">{c.tip}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Preview */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Google Önizleme</h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-blue-800 text-[18px] font-medium leading-tight truncate hover:underline cursor-default">
                    {title || "Ürün Başlığı"} | TesterePlus
                  </p>
                  <p className="text-green-800 text-[13px] mt-0.5">https://testereplus.com/urunler/{slug}</p>
                  <p className="text-gray-600 text-[13px] mt-1 line-clamp-2 leading-relaxed">
                    {desc || "Ürün açıklaması buraya gelecek..."}
                  </p>
                </div>
              </div>

              {/* SEO Title */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Arama Motoru Ayarları</h3>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">SEO Başlık (Title Tag)</label>
                  <input
                    value={form.seoTitle}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                    placeholder={form.name || "Otomatik: ürün adı kullanılır"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-gray-400">Google&apos;da görünen başlık. Ana anahtar kelimeyi ekle.</p>
                    <span className={`text-xs font-medium ${title.length > 60 ? "text-red-500" : title.length >= 30 ? "text-green-600" : "text-amber-500"}`}>
                      {title.length}/60
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Meta Açıklama (Description)</label>
                  <textarea
                    value={form.seoDescription}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                    rows={3}
                    placeholder={form.overview || "Otomatik: kısa açıklama kullanılır"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-gray-400">Arama sonuçlarındaki açıklama. Tıklanma oranını artırmak için CTA ekle.</p>
                    <span className={`text-xs font-medium ${desc.length > 160 ? "text-red-500" : desc.length >= 120 ? "text-green-600" : "text-amber-500"}`}>
                      {desc.length}/160
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">URL Slug</label>
                  <div className="flex items-center gap-0 border border-gray-200 rounded-lg overflow-hidden">
                    <span className="bg-gray-50 text-gray-400 text-sm px-3 py-3 border-r border-gray-200 whitespace-nowrap">/urunler/</span>
                    <input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder={toSlug(form.name || "urun-adi")}
                      className="flex-1 px-3 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">Kısa, anahtar kelime içeren slug SEO&apos;ya iyi gelir. Otomatik oluşturulur.</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Canonical URL</label>
                  <input
                    value={form.seoCanonical}
                    onChange={(e) => setForm({ ...form, seoCanonical: e.target.value })}
                    placeholder="https://testereplus.com/urunler/..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Aynı ürün birden fazla URL&apos;de varsa, ana URL&apos;yi belirt. Genelde boş bırakılır.</p>
                </div>
              </div>

              {/* Keywords */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Anahtar Kelimeler</h3>
                <p className="text-sm text-gray-500">Bu ürünün Google&apos;da hangi aramalarda çıkmasını istiyorsun? Ana kelimeyi ilk sıraya koy.</p>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((kw, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full">
                      {idx === 0 && <span className="w-4 h-4 bg-blue-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">1</span>}
                      {kw}
                      <button onClick={() => setForm({ ...form, seoKeywords: keywords.filter((_, i) => i !== idx) })} className="hover:text-red-500 ml-0.5">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    placeholder="Anahtar kelime ekle (Enter ile)"
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const v = (e.target as HTMLInputElement).value.trim();
                        if (v && !keywords.includes(v)) {
                          setForm({ ...form, seoKeywords: [...keywords, v] });
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                </div>
                {form.category && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Önerilen kelimeler (tıkla ekle):</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        form.category.toLowerCase(),
                        form.brand ? `${form.brand.toLowerCase()} testere` : "",
                        form.category.toLowerCase() + " fiyat",
                        form.category.toLowerCase() + " satın al",
                        form.brand ? `${form.brand.toLowerCase()} ${form.category.toLowerCase()}` : "",
                        "profesyonel testere",
                        "kesici takım",
                        "endüstriyel testere bıçağı",
                        form.name.toLowerCase().split(" ").slice(0, 3).join(" "),
                      ].filter(Boolean).filter((s) => !keywords.includes(s)).slice(0, 8).map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setForm({ ...form, seoKeywords: [...keywords, suggestion] })}
                          className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-500 px-2.5 py-1 rounded-full border border-gray-200 hover:border-blue-200 transition-colors"
                        >
                          + {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Open Graph */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Sosyal Medya (Open Graph)</h3>
                <p className="text-sm text-gray-500">Ürün linki WhatsApp, Facebook, Twitter&apos;da paylaşıldığında görünen bilgiler.</p>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">WhatsApp / Facebook Önizleme</p>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-sm">
                    <div className="h-32 bg-gray-200 flex items-center justify-center">
                      {(form.ogImage || form.images?.[0]) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={form.ogImage || form.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={32} className="text-gray-300" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-400 uppercase">testereplus.com</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{form.ogTitle || title || "Ürün Başlığı"}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{form.ogDescription || desc || "Açıklama"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">OG Başlık</label>
                  <input
                    value={form.ogTitle}
                    onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
                    placeholder={title || "Boş bırakılırsa SEO başlığı kullanılır"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">OG Açıklama</label>
                  <textarea
                    value={form.ogDescription}
                    onChange={(e) => setForm({ ...form, ogDescription: e.target.value })}
                    rows={2}
                    placeholder={desc || "Boş bırakılırsa meta açıklama kullanılır"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">OG Görsel URL</label>
                  <input
                    value={form.ogImage}
                    onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
                    placeholder="Boş bırakılırsa ana ürün görseli kullanılır (1200x630 ideal)"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Image SEO */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Görsel SEO</h3>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Ana Görsel Alt Text</label>
                  <input
                    value={form.altText}
                    onChange={(e) => setForm({ ...form, altText: e.target.value })}
                    placeholder={form.name || "Ürünü tanımlayan kısa metin — Google Görseller için önemli"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Google Görseller&apos;de sıralama için kritik. Ürün adı + ana özellik yaz.</p>
                </div>
              </div>
            </div>
            );
          })()}
        </div>
      </div>
    );
  }

  // ─── LIST VIEW ───
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} / {products.length} ürün</p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={csvInputRef} type="file" accept=".csv" onChange={importCSV} className="hidden" />
          <button onClick={() => csvInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <FileUp size={16} /><span className="hidden sm:inline">İçe Aktar</span>
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download size={16} /><span className="hidden sm:inline">Dışa Aktar</span>
          </button>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
            <Plus size={16} /> Yeni Ürün
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Ürün adı, SKU veya marka ara..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
        </div>
        <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1); }} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none hidden sm:block">
          <option value="all">Tüm Kategoriler</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={brandFilter} onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none hidden md:block">
          <option value="all">Tüm Markalar</option>
          {allBrands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none hidden md:block">
          <option value="all">Tüm Durumlar</option>
          <option value="active">Aktif</option>
          <option value="passive">Pasif</option>
          <option value="nostock">Stok Yok</option>
        </select>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-orange-700">{selected.size} ürün seçildi</span>
          <div className="h-4 w-px bg-orange-200" />
          <button onClick={bulkToggleStatus} className="text-sm text-orange-600 hover:underline">Aktif/Pasif</button>
          <button onClick={bulkDelete} className="text-sm text-red-600 hover:underline">Sil</button>
          <button onClick={() => setSelected(new Set())} className="text-sm text-gray-500 hover:underline ml-auto">Seçimi Kaldır</button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={paginated.length > 0 && selected.size === paginated.length} onChange={() => setSelected(selected.size === paginated.length ? new Set() : new Set(paginated.map((p) => p.id)))} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                </th>
                <th className="w-12 py-3"></th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4">
                  <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-gray-700">Ürün <ArrowUpDown size={12} /></button>
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden lg:table-cell">SKU</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden xl:table-cell">Kategori</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4">
                  <button onClick={() => toggleSort("price")} className="flex items-center gap-1 hover:text-gray-700 ml-auto">Fiyat <ArrowUpDown size={12} /></button>
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">
                  <button onClick={() => toggleSort("stock")} className="flex items-center gap-1 hover:text-gray-700 mx-auto">Stok <ArrowUpDown size={12} /></button>
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden md:table-cell">Varyant</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Durum</th>
                <th className="w-24 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => openEdit(p)}>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(p.id)} onChange={() => { const n = new Set(selected); n.has(p.id) ? n.delete(p.id) : n.add(p.id); setSelected(n); }} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                  </td>
                  <td className="py-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                      ) : (
                        <ImageIcon size={16} className="text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[280px]">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.brand}</p>
                  </td>
                  <td className="py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-500 font-mono">{p.sku}</span>
                  </td>
                  <td className="py-3 hidden xl:table-cell">
                    {p.category && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{p.category}</span>}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    {p.price > 0 ? (
                      <div>
                        <p className="text-sm font-bold text-gray-800">₺{p.price.toLocaleString("tr-TR")}</p>
                        {p.oldPrice > 0 && <p className="text-xs text-gray-400 line-through">₺{p.oldPrice.toLocaleString("tr-TR")}</p>}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">—</p>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`text-sm font-semibold ${p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-amber-500" : "text-gray-700"}`}>{p.stock}</span>
                  </td>
                  <td className="py-3 text-center hidden md:table-cell">
                    {p.variants.length > 0 ? (
                      <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full font-medium">{p.variants.length}</span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.status === "active" ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="pr-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100" title="Düzenle"><Edit2 size={14} className="text-gray-400" /></button>
                      <button onClick={() => duplicateProduct(p)} className="p-1.5 rounded-lg hover:bg-gray-100" title="Kopyala"><Copy size={14} className="text-gray-400" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg hover:bg-red-50" title="Sil"><Trash2 size={14} className="text-gray-400 hover:text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">{(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, filtered.length)} / {filtered.length} ürün</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30"><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
              if (p < 1 || p > totalPages) return null;
              return <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? "bg-orange-500 text-white" : "hover:bg-gray-100 text-gray-600"}`}>{p}</button>;
            })}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
