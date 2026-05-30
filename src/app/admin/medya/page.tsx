"use client";

import { useState, useRef } from "react";
import { Upload, Grid, List, Search, Trash2, Download, Image as ImageIcon, FileText, Film, X, CheckCircle2 } from "lucide-react";

interface MediaFile {
  id: string;
  name: string;
  type: "image" | "pdf" | "video";
  size: string;
  date: string;
  dimensions: string;
}

const initialFiles: MediaFile[] = [
  { id: "1", name: "product-1.jpg", type: "image", size: "245 KB", date: "05.05.2026", dimensions: "800x800" },
  { id: "2", name: "product-2.jpg", type: "image", size: "312 KB", date: "05.05.2026", dimensions: "800x800" },
  { id: "3", name: "product-3.jpg", type: "image", size: "198 KB", date: "04.05.2026", dimensions: "800x800" },
  { id: "4", name: "product-4.jpg", type: "image", size: "267 KB", date: "04.05.2026", dimensions: "800x800" },
  { id: "5", name: "product-5.jpg", type: "image", size: "189 KB", date: "03.05.2026", dimensions: "800x800" },
  { id: "6", name: "product-6.jpg", type: "image", size: "223 KB", date: "03.05.2026", dimensions: "800x800" },
  { id: "7", name: "product-7.jpg", type: "image", size: "201 KB", date: "02.05.2026", dimensions: "800x800" },
  { id: "8", name: "product-8.jpg", type: "image", size: "278 KB", date: "02.05.2026", dimensions: "800x800" },
  { id: "9", name: "katalog-2026.pdf", type: "pdf", size: "4.2 MB", date: "01.05.2026", dimensions: "" },
  { id: "10", name: "banner-hero.jpg", type: "image", size: "1.1 MB", date: "28.04.2026", dimensions: "1920x600" },
  { id: "11", name: "logo-dark.png", type: "image", size: "34 KB", date: "15.04.2026", dimensions: "400x120" },
  { id: "12", name: "logo-light.png", type: "image", size: "32 KB", date: "15.04.2026", dimensions: "400x120" },
];

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>(initialFiles);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  const totalSize = files.reduce((s, f) => {
    const num = parseFloat(f.size);
    return s + (f.size.includes("MB") ? num * 1024 : num);
  }, 0);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleUpload() {
    fileInputRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;
    const newFiles: MediaFile[] = Array.from(fileList).map((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() || "";
      const type: MediaFile["type"] = ["pdf"].includes(ext) ? "pdf" : ["mp4", "webm", "mov"].includes(ext) ? "video" : "image";
      const sizeKB = f.size / 1024;
      const size = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`;
      return { id: Date.now().toString() + f.name, name: f.name, type, size, date: dateStr, dimensions: "" };
    });
    setFiles((prev) => [...newFiles, ...prev]);
    e.target.value = "";
    alert(`${newFiles.length} dosya yüklendi!`);
  }

  function downloadFile(file: MediaFile) {
    const blob = new Blob([`Demo file content for ${file.name}`], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadSelected() {
    const selectedFiles = files.filter((f) => selected.has(f.id));
    selectedFiles.forEach((f) => downloadFile(f));
    setSelected(new Set());
  }

  function deleteFile(id: string) {
    if (!confirm("Bu dosyayı silmek istediğinize emin misiniz?")) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }

  return (
    <div className="space-y-6">
      <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.mp4,.webm" className="hidden" onChange={onFileChange} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medya Kütüphanesi</h1>
          <p className="text-sm text-gray-500 mt-0.5">{files.length} dosya · {(totalSize / 1024).toFixed(1)} MB</p>
        </div>
        <button onClick={handleUpload} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
          <Upload size={16} /> Dosya Yükle
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Dosya adı ara..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
        </div>
        <div className="flex bg-white border border-gray-200 rounded-lg p-0.5">
          <button onClick={() => setView("grid")} className={`p-2 rounded-md ${view === "grid" ? "bg-gray-100" : ""}`}><Grid size={16} className="text-gray-500" /></button>
          <button onClick={() => setView("list")} className={`p-2 rounded-md ${view === "list" ? "bg-gray-100" : ""}`}><List size={16} className="text-gray-500" /></button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-orange-700">{selected.size} dosya seçildi</span>
          <button onClick={downloadSelected} className="text-sm text-orange-600 hover:underline">İndir</button>
          <button onClick={() => setSelected(new Set())} className="text-sm text-red-600 hover:underline">Seçimi Kaldır</button>
        </div>
      )}

      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.map((file) => (
            <div
              key={file.id}
              onClick={() => toggle(file.id)}
              className={`bg-white border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all ${selected.has(file.id) ? "border-orange-400 ring-2 ring-orange-200" : "border-gray-200"}`}
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                {selected.has(file.id) && <div className="absolute top-2 right-2"><CheckCircle2 size={18} className="text-orange-500" /></div>}
                {file.type === "image" ? <ImageIcon size={32} className="text-gray-300" /> : file.type === "pdf" ? <FileText size={32} className="text-red-300" /> : <Film size={32} className="text-blue-300" />}
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-[10px] text-gray-400">{file.size}{file.dimensions ? ` · ${file.dimensions}` : ""}</p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0 ml-1">
                  <button onClick={(e) => { e.stopPropagation(); downloadFile(file); }} className="p-1 rounded hover:bg-gray-100"><Download size={12} className="text-gray-400" /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }} className="p-1 rounded hover:bg-red-50"><Trash2 size={12} className="text-gray-400 hover:text-red-500" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-50">
          {filtered.map((file) => (
            <div key={file.id} onClick={() => toggle(file.id)} className={`flex items-center gap-4 px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${selected.has(file.id) ? "bg-orange-50" : ""}`}>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                {file.type === "image" ? <ImageIcon size={18} className="text-gray-400" /> : <FileText size={18} className="text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-400">{file.size}{file.dimensions ? ` · ${file.dimensions}` : ""}</p>
              </div>
              <span className="text-xs text-gray-400">{file.date}</span>
              <button onClick={(e) => { e.stopPropagation(); downloadFile(file); }} className="p-1.5 rounded-lg hover:bg-gray-200"><Download size={14} className="text-gray-400" /></button>
              <button onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 size={14} className="text-gray-400 hover:text-red-500" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
