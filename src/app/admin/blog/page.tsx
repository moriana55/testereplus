"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Clock,
  CheckCircle2,
  FileText,
  X,
  Image as ImageIcon,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: "Yayında" | "Taslak";
  author: string;
  category: string;
  views: number;
  date: string;
  content: string;
}

const initialPosts: Post[] = [
  { id: "1", title: "CNC Freze Uçlarının Önemi ve Seçim Rehberi", slug: "cnc-freze-uclarinin-onemi", status: "Yayında", author: "Yiğit Ertürk", category: "Rehber", views: 1248, date: "01.05.2026", content: "CNC freze uçları, işleme sürecinde kritik rol oynar..." },
  { id: "2", title: "Daire Testere Bıçağı Nasıl Seçilir?", slug: "daire-testere-bicagi-secimi", status: "Yayında", author: "Yiğit Ertürk", category: "Rehber", views: 856, date: "28.04.2026", content: "Daire testere bıçağı seçerken dikkat edilmesi gerekenler..." },
  { id: "3", title: "Testere Bıçağı Bakım ve Bileme Rehberi", slug: "testere-bicagi-bakimi", status: "Yayında", author: "Yiğit Ertürk", category: "Bakım", views: 623, date: "20.04.2026", content: "Testere bıçaklarınızın ömrünü uzatmak için..." },
  { id: "4", title: "HSS vs Karbür Uçlar: Hangisini Seçmelisiniz?", slug: "hss-vs-karbur-uclar", status: "Yayında", author: "Yiğit Ertürk", category: "Karşılaştırma", views: 412, date: "15.04.2026", content: "HSS ve karbür uçların karşılaştırması..." },
  { id: "5", title: "Şerit Testere ile Düz Kesim Nasıl Yapılır?", slug: "serit-testere-duz-kesim", status: "Taslak", author: "Yiğit Ertürk", category: "Rehber", views: 0, date: "10.05.2026", content: "Şerit testere ile düz kesim teknikleri..." },
  { id: "6", title: "2026'nın En İyi Daire Testere Bıçakları", slug: "en-iyi-daire-testere-2026", status: "Taslak", author: "Yiğit Ertürk", category: "Liste", views: 0, date: "08.05.2026", content: "2026 yılının en iyi daire testere bıçakları..." },
];

const categories = ["Rehber", "Bakım", "Karşılaştırma", "Liste", "Haber"];

function toSlug(s: string) {
  return s.toLowerCase().replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const emptyForm: { title: string; slug: string; category: string; status: "Yayında" | "Taslak"; content: string } = { title: "", slug: "", category: "Rehber", status: "Taslak", content: "" };

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [viewPost, setViewPost] = useState<Post | null>(null);

  const filtered = posts
    .filter((p) => statusFilter === "all" || p.status === statusFilter)
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  function openNew() {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(p: Post) {
    setForm({ title: p.title, slug: p.slug, category: p.category, status: p.status, content: p.content });
    setEditId(p.id);
    setShowForm(true);
  }

  function handleSubmit() {
    if (!form.title.trim()) return;
    const slug = form.slug || toSlug(form.title);
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;
    if (editId) {
      setPosts((prev) => prev.map((p) => p.id === editId ? { ...p, title: form.title, slug, category: form.category, status: form.status, content: form.content } : p));
    } else {
      setPosts((prev) => [...prev, { id: Date.now().toString(), title: form.title, slug, status: form.status, author: "Yiğit Ertürk", category: form.category, views: 0, date: dateStr, content: form.content }]);
    }
    setShowForm(false);
  }

  function deletePost(id: string) {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  const publishedCnt = posts.filter((p) => p.status === "Yayında").length;
  const draftCnt = posts.filter((p) => p.status === "Taslak").length;
  const totalViews = posts.reduce((s, p) => s + p.views, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Yazıları</h1>
          <p className="text-sm text-gray-500 mt-0.5">{posts.length} yazı</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
          <Plus size={16} /> Yeni Yazı
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><FileText size={16} className="text-blue-500" /><span className="text-xs text-gray-500 font-medium">Toplam Yazı</span></div>
          <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><CheckCircle2 size={16} className="text-green-500" /><span className="text-xs text-gray-500 font-medium">Yayında</span></div>
          <p className="text-2xl font-bold text-gray-900">{publishedCnt}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Clock size={16} className="text-yellow-500" /><span className="text-xs text-gray-500 font-medium">Taslak</span></div>
          <p className="text-2xl font-bold text-gray-900">{draftCnt}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Eye size={16} className="text-purple-500" /><span className="text-xs text-gray-500 font-medium">Toplam Görüntülenme</span></div>
          <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString("tr-TR")}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Yazı başlığı ara..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none">
          <option value="all">Tüm Durumlar</option>
          <option value="Yayında">Yayında</option>
          <option value="Taslak">Taslak</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((post) => (
          <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <ImageIcon size={24} className="text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{post.title}</h3>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${post.status === "Yayında" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{post.status}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{post.author}</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded">{post.category}</span>
                <span className="flex items-center gap-1"><Eye size={11} /> {post.views}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {post.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => openEdit(post)} className="p-2 rounded-lg hover:bg-gray-100" title="Düzenle"><Edit2 size={16} className="text-gray-400" /></button>
              <button onClick={() => setViewPost(post)} className="p-2 rounded-lg hover:bg-gray-100" title="Görüntüle"><Eye size={16} className="text-gray-400" /></button>
              <button onClick={() => deletePost(post.id)} className="p-2 rounded-lg hover:bg-red-50" title="Sil"><Trash2 size={16} className="text-gray-400 hover:text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editId ? "Yazı Düzenle" : "Yeni Yazı"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Başlık</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: toSlug(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Kategori</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Durum</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "Yayında" | "Taslak" })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
                    <option value="Taslak">Taslak</option>
                    <option value="Yayında">Yayında</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">İçerik</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">İptal</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">{editId ? "Güncelle" : "Yayınla"}</button>
            </div>
          </div>
        </div>
      )}

      {viewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{viewPost.title}</h2>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>{viewPost.author}</span>
                  <span>{viewPost.date}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded">{viewPost.category}</span>
                  <span className={`px-2 py-0.5 rounded-full ${viewPost.status === "Yayında" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{viewPost.status}</span>
                </div>
              </div>
              <button onClick={() => setViewPost(null)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              <p>{viewPost.content}</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setViewPost(null); openEdit(viewPost); }} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1"><Edit2 size={14} /> Düzenle</button>
              <button onClick={() => setViewPost(null)} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
