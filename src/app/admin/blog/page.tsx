"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  Search, Plus, Edit2, Trash2, Eye, Clock, CheckCircle2, FileText, X,
  Image as ImageIcon, Bold, Italic, Heading1, Heading2, Heading3, List,
  ListOrdered, Link as LinkIcon, Quote, Code, Minus, Undo2, Redo2,
  ArrowLeft, Save, Globe, Tag, TrendingUp, AlertCircle, CheckCircle,
  Target, Type, FileImage, ExternalLink, ChevronDown, Sparkles,
} from "lucide-react";
import { useLocalState } from "@/lib/use-local-state";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: "Yayında" | "Taslak";
  author: string;
  category: string;
  tags: string[];
  views: number;
  date: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  focusKeyword: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonical: string;
  readingTime: number;
}

const defaultPost: Omit<BlogPost, "id" | "date" | "views"> = {
  title: "", slug: "", status: "Taslak", author: "Yiğit Ertürk", category: "Rehber",
  tags: [], content: "", excerpt: "", featuredImage: "", seoTitle: "", seoDescription: "",
  seoKeywords: [], focusKeyword: "", ogTitle: "", ogDescription: "", ogImage: "", canonical: "", readingTime: 0,
};

const initialPosts: BlogPost[] = [
  { id: "1", title: "CNC Freze Uçlarının Önemi ve Seçim Rehberi", slug: "cnc-freze-uclarinin-onemi", status: "Yayında", author: "Yiğit Ertürk", category: "Rehber", tags: ["cnc", "freze"], views: 1248, date: "01.05.2026", content: "CNC freze uçları, işleme sürecinde kritik rol oynar. Doğru uç seçimi, iş parçasının kalitesini doğrudan etkiler.\n\n## Freze Ucu Türleri\n\nFarklı malzemeler için farklı freze uçları kullanılır. Karbür uçlar sert malzemelerde, HSS uçlar ise yumuşak malzemelerde tercih edilir.\n\n### Karbür Freze Uçları\n\nKarbür uçlar yüksek sertlik ve aşınma direnci sunar. CNC tezgahlarında en çok tercih edilen uç tipidir.\n\n### HSS Freze Uçları\n\nHSS uçlar daha ekonomiktir ancak ömürleri karbür uçlara göre kısadır.", excerpt: "CNC freze uçlarının seçim rehberi ve türleri hakkında kapsamlı bilgi.", featuredImage: "", seoTitle: "CNC Freze Uçları Seçim Rehberi 2026 | Testere Plus", seoDescription: "CNC freze uçlarının türleri, seçim kriterleri ve kullanım önerileri. Karbür ve HSS freze uçları karşılaştırması.", seoKeywords: ["cnc freze", "freze ucu", "karbür freze"], focusKeyword: "cnc freze uçları", ogTitle: "", ogDescription: "", ogImage: "", canonical: "", readingTime: 4 },
  { id: "2", title: "Daire Testere Bıçağı Nasıl Seçilir?", slug: "daire-testere-bicagi-secimi", status: "Yayında", author: "Yiğit Ertürk", category: "Rehber", tags: ["testere", "bıçak"], views: 856, date: "28.04.2026", content: "Daire testere bıçağı seçerken dikkat edilmesi gerekenler...", excerpt: "", featuredImage: "", seoTitle: "", seoDescription: "", seoKeywords: [], focusKeyword: "", ogTitle: "", ogDescription: "", ogImage: "", canonical: "", readingTime: 3 },
  { id: "3", title: "Testere Bıçağı Bakım ve Bileme Rehberi", slug: "testere-bicagi-bakimi", status: "Yayında", author: "Yiğit Ertürk", category: "Bakım", tags: ["bakım", "bileme"], views: 623, date: "20.04.2026", content: "Testere bıçaklarınızın ömrünü uzatmak için...", excerpt: "", featuredImage: "", seoTitle: "", seoDescription: "", seoKeywords: [], focusKeyword: "", ogTitle: "", ogDescription: "", ogImage: "", canonical: "", readingTime: 5 },
  { id: "4", title: "HSS vs Karbür Uçlar: Hangisini Seçmelisiniz?", slug: "hss-vs-karbur-uclar", status: "Yayında", author: "Yiğit Ertürk", category: "Karşılaştırma", tags: ["hss", "karbür"], views: 412, date: "15.04.2026", content: "HSS ve karbür uçların karşılaştırması...", excerpt: "", featuredImage: "", seoTitle: "", seoDescription: "", seoKeywords: [], focusKeyword: "", ogTitle: "", ogDescription: "", ogImage: "", canonical: "", readingTime: 3 },
  { id: "5", title: "Şerit Testere ile Düz Kesim Nasıl Yapılır?", slug: "serit-testere-duz-kesim", status: "Taslak", author: "Yiğit Ertürk", category: "Rehber", tags: ["şerit testere"], views: 0, date: "10.05.2026", content: "Şerit testere ile düz kesim teknikleri...", excerpt: "", featuredImage: "", seoTitle: "", seoDescription: "", seoKeywords: [], focusKeyword: "", ogTitle: "", ogDescription: "", ogImage: "", canonical: "", readingTime: 4 },
  { id: "6", title: "2026'nın En İyi Daire Testere Bıçakları", slug: "en-iyi-daire-testere-2026", status: "Taslak", author: "Yiğit Ertürk", category: "Liste", tags: ["2026", "en iyi"], views: 0, date: "08.05.2026", content: "2026 yılının en iyi daire testere bıçakları...", excerpt: "", featuredImage: "", seoTitle: "", seoDescription: "", seoKeywords: [], focusKeyword: "", ogTitle: "", ogDescription: "", ogImage: "", canonical: "", readingTime: 6 },
];

const blogCategories = ["Rehber", "Bakım", "Karşılaştırma", "Liste", "Haber", "Teknik", "İnceleme"];

function toSlug(s: string) {
  return s.toLowerCase().replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function wordCount(text: string) { return text.trim().split(/\s+/).filter(Boolean).length; }

function calcReadingTime(text: string) { return Math.max(1, Math.ceil(wordCount(text) / 200)); }

// ─── SEO Analyzer (RankMath-style) ───
interface SEOCheck { label: string; passed: boolean; tip: string; weight: number; }

function analyzeSEO(post: typeof defaultPost & { focusKeyword: string }): SEOCheck[] {
  const fk = post.focusKeyword.toLowerCase().trim();
  const title = post.seoTitle || post.title;
  const desc = post.seoDescription;
  const content = post.content.toLowerCase();
  const words = wordCount(post.content);
  const headingMatch = post.content.match(/^##\s/gm);
  const h2Count = headingMatch ? headingMatch.length : 0;
  const linkMatch = post.content.match(/\[.*?\]\(.*?\)/g);
  const linkCount = linkMatch ? linkMatch.length : 0;
  const imgMatch = post.content.match(/!\[.*?\]\(.*?\)/g);
  const imgCount = imgMatch ? imgMatch.length : 0;

  const checks: SEOCheck[] = [
    { label: "Focus keyword belirli", passed: fk.length > 0, tip: "Bir focus keyword belirleyin.", weight: 10 },
    { label: "Focus keyword başlıkta", passed: fk.length > 0 && title.toLowerCase().includes(fk), tip: "Focus keyword'ü SEO başlığına ekleyin.", weight: 10 },
    { label: "Focus keyword açıklamada", passed: fk.length > 0 && desc.toLowerCase().includes(fk), tip: "Focus keyword'ü meta açıklamaya ekleyin.", weight: 8 },
    { label: "Focus keyword slug'da", passed: fk.length > 0 && post.slug.includes(toSlug(fk)), tip: "Focus keyword'ü URL slug'ına ekleyin.", weight: 8 },
    { label: "Focus keyword ilk paragrafta", passed: fk.length > 0 && content.slice(0, 500).includes(fk), tip: "Focus keyword ilk 500 karakterde geçmeli.", weight: 7 },
    { label: `Focus keyword yoğunluğu (${fk ? ((content.split(fk).length - 1) / Math.max(1, words) * 100).toFixed(1) : 0}%)`, passed: fk.length > 0 && (content.split(fk).length - 1) >= 2 && (content.split(fk).length - 1) / Math.max(1, words) * 100 < 3, tip: "Focus keyword %0.5-2.5 arası yoğunlukta olmalı.", weight: 7 },
    { label: `SEO başlık uzunluğu (${title.length} karakter)`, passed: title.length >= 30 && title.length <= 60, tip: "SEO başlığı 30-60 karakter arasında olmalı.", weight: 8 },
    { label: `Meta açıklama uzunluğu (${desc.length} karakter)`, passed: desc.length >= 120 && desc.length <= 160, tip: "Meta açıklama 120-160 karakter arasında olmalı.", weight: 8 },
    { label: `İçerik uzunluğu (${words} kelime)`, passed: words >= 300, tip: "İçerik en az 300 kelime olmalı. İdeal: 1000+ kelime.", weight: 9 },
    { label: `H2 başlık kullanımı (${h2Count} adet)`, passed: h2Count >= 1, tip: "En az 1 H2 başlık kullanın (## ile).", weight: 6 },
    { label: `İç/dış link (${linkCount} adet)`, passed: linkCount >= 1, tip: "İçerikte en az 1 link olmalı.", weight: 5 },
    { label: `Görsel kullanımı (${imgCount} adet)`, passed: imgCount >= 1, tip: "İçerikte en az 1 görsel ekleyin.", weight: 5 },
    { label: "Slug oluşturulmuş", passed: post.slug.length > 0, tip: "SEO uyumlu bir URL slug'ı oluşturun.", weight: 4 },
    { label: "Özet (excerpt) yazılmış", passed: (post.excerpt || "").length > 0, tip: "Bir özet yazın — arama sonuçlarında snippet olarak görünür.", weight: 5 },
  ];
  return checks;
}

function getSEOScore(checks: SEOCheck[]): number {
  const maxWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks.filter((c) => c.passed).reduce((s, c) => s + c.weight, 0);
  return Math.round((earned / maxWeight) * 100);
}

function getSEOColor(score: number) {
  if (score >= 80) return { bg: "bg-green-500", text: "text-green-600", label: "İyi" };
  if (score >= 50) return { bg: "bg-orange-500", text: "text-orange-600", label: "Orta" };
  return { bg: "bg-red-500", text: "text-red-600", label: "Zayıf" };
}

// ─── Rich Text Toolbar ───
function ToolbarButton({ icon: Icon, label, onClick, active }: { icon: any; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} title={label} className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${active ? "bg-gray-200 text-orange-600" : "text-gray-500"}`}>
      <Icon size={16} />
    </button>
  );
}

// ─── Main Component ───
export default function BlogPage() {
  const [posts, setPosts] = useLocalState<BlogPost[]>("tp_admin_blog", initialPosts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof defaultPost>(defaultPost);
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "social">("content");
  const [seoExpanded, setSeoExpanded] = useState(true);
  const [keywordInput, setKeywordInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const filtered = posts
    .filter((p) => statusFilter === "all" || p.status === statusFilter)
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const publishedCnt = posts.filter((p) => p.status === "Yayında").length;
  const draftCnt = posts.filter((p) => p.status === "Taslak").length;
  const totalViews = posts.reduce((s, p) => s + p.views, 0);

  function openNew() {
    setForm(defaultPost);
    setEditId(null);
    setActiveTab("content");
    setEditorOpen(true);
  }

  function openEdit(p: BlogPost) {
    setForm({ title: p.title, slug: p.slug, status: p.status, author: p.author, category: p.category, tags: p.tags || [], content: p.content, excerpt: p.excerpt || "", featuredImage: p.featuredImage || "", seoTitle: p.seoTitle || "", seoDescription: p.seoDescription || "", seoKeywords: p.seoKeywords || [], focusKeyword: p.focusKeyword || "", ogTitle: p.ogTitle || "", ogDescription: p.ogDescription || "", ogImage: p.ogImage || "", canonical: p.canonical || "", readingTime: p.readingTime || 0 });
    setEditId(p.id);
    setActiveTab("content");
    setEditorOpen(true);
  }

  function handleSave() {
    if (!form.title.trim()) return;
    const slug = form.slug || toSlug(form.title);
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;
    const readingTime = calcReadingTime(form.content);

    if (editId) {
      setPosts((prev) => prev.map((p) => p.id === editId ? { ...p, ...form, slug, readingTime } : p));
    } else {
      setPosts((prev) => [...prev, { ...form, id: Date.now().toString(), slug, date: dateStr, views: 0, readingTime }]);
    }
    setEditorOpen(false);
  }

  function deletePost(id: string) {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  function insertMarkdown(before: string, after: string = "") {
    const ta = editorRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = form.content.substring(start, end);
    const newContent = form.content.substring(0, start) + before + sel + after + form.content.substring(end);
    setForm({ ...form, content: newContent });
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + before.length, start + before.length + sel.length); }, 0);
  }

  function addKeyword() {
    const kw = keywordInput.trim();
    if (kw && !form.seoKeywords.includes(kw)) {
      setForm({ ...form, seoKeywords: [...form.seoKeywords, kw] });
    }
    setKeywordInput("");
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
    }
    setTagInput("");
  }

  const seoChecks = analyzeSEO(form);
  const seoScore = getSEOScore(seoChecks);
  const seoColor = getSEOColor(seoScore);

  // ─── EDITOR VIEW ───
  if (editorOpen) {
    const words = wordCount(form.content);
    const readTime = calcReadingTime(form.content);

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setEditorOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} className="text-gray-500" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{editId ? "Yazı Düzenle" : "Yeni Yazı"}</h1>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                <span>{words} kelime</span>
                <span>{readTime} dk okuma</span>
                <span className={`flex items-center gap-1 ${seoColor.text} font-medium`}>
                  <Target size={11} /> SEO: {seoScore}/100
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="Taslak">Taslak</option>
              <option value="Yayında">Yayında</option>
            </select>
            <button onClick={() => setEditorOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">İptal</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
              <Save size={16} /> Kaydet
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Main Content Area */}
          <div className="xl:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              {[
                { id: "content" as const, label: "İçerik", icon: FileText },
                { id: "seo" as const, label: "SEO", icon: Globe },
                { id: "social" as const, label: "Sosyal Medya", icon: ExternalLink },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-lg transition-all ${activeTab === tab.id ? "bg-white shadow-sm font-medium text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                  <tab.icon size={14} />
                  {tab.label}
                  {tab.id === "seo" && (
                    <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${seoColor.bg}`}>
                      {seoScore >= 80 ? "✓" : seoScore}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === "content" && (
              <div className="space-y-4">
                {/* Title */}
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || toSlug(e.target.value) })}
                  placeholder="Yazı Başlığını Girin..."
                  className="w-full text-2xl font-bold text-gray-900 placeholder:text-gray-300 border-0 focus:outline-none bg-transparent"
                />

                {/* Slug */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">testereplus.com/blog/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="text-green-600 font-mono text-sm border-b border-dashed border-gray-200 focus:outline-none focus:border-orange-400 bg-transparent"
                    placeholder={toSlug(form.title || "slug")}
                  />
                </div>

                {/* Toolbar */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-100 flex-wrap">
                    <ToolbarButton icon={Bold} label="Kalın" onClick={() => insertMarkdown("**", "**")} />
                    <ToolbarButton icon={Italic} label="İtalik" onClick={() => insertMarkdown("*", "*")} />
                    <div className="w-px h-5 bg-gray-200 mx-1" />
                    <ToolbarButton icon={Heading1} label="H1" onClick={() => insertMarkdown("# ")} />
                    <ToolbarButton icon={Heading2} label="H2" onClick={() => insertMarkdown("## ")} />
                    <ToolbarButton icon={Heading3} label="H3" onClick={() => insertMarkdown("### ")} />
                    <div className="w-px h-5 bg-gray-200 mx-1" />
                    <ToolbarButton icon={List} label="Liste" onClick={() => insertMarkdown("- ")} />
                    <ToolbarButton icon={ListOrdered} label="Numaralı Liste" onClick={() => insertMarkdown("1. ")} />
                    <ToolbarButton icon={Quote} label="Alıntı" onClick={() => insertMarkdown("> ")} />
                    <div className="w-px h-5 bg-gray-200 mx-1" />
                    <ToolbarButton icon={LinkIcon} label="Link" onClick={() => insertMarkdown("[", "](url)")} />
                    <ToolbarButton icon={ImageIcon} label="Görsel" onClick={() => insertMarkdown("![alt](", ")")} />
                    <ToolbarButton icon={Code} label="Kod" onClick={() => insertMarkdown("`", "`")} />
                    <ToolbarButton icon={Minus} label="Ayraç" onClick={() => insertMarkdown("\n---\n")} />
                  </div>
                  <textarea
                    ref={editorRef}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={20}
                    className="w-full px-4 py-3 text-sm text-gray-800 leading-relaxed focus:outline-none resize-none font-mono"
                    placeholder="Markdown formatında içerik yazın...&#10;&#10;## Başlık&#10;&#10;Paragraf metni...&#10;&#10;- Madde 1&#10;- Madde 2"
                  />
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                    <span>{words} kelime · {form.content.length} karakter · {readTime} dk okuma</span>
                    <span>Markdown destekli</span>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Özet (Excerpt)</label>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    rows={2}
                    maxLength={300}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                    placeholder="Kısa bir özet yazın — arama sonuçlarında görünür"
                  />
                  <p className="text-xs text-gray-400 mt-1">{form.excerpt.length}/300</p>
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-5">
                {/* SEO Score */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl ${seoColor.bg} flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">{seoScore}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">SEO Skoru</h3>
                        <p className={`text-sm ${seoColor.text} font-medium`}>{seoColor.label}</p>
                      </div>
                    </div>
                    <button onClick={() => setSeoExpanded(!seoExpanded)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${seoExpanded ? "" : "-rotate-90"}`} />
                    </button>
                  </div>

                  {seoExpanded && (
                    <div className="space-y-2">
                      {seoChecks.map((check, i) => (
                        <div key={i} className={`flex items-start gap-2.5 py-2 ${i < seoChecks.length - 1 ? "border-b border-gray-50" : ""}`}>
                          {check.passed ? (
                            <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className={`text-sm ${check.passed ? "text-gray-600" : "text-gray-800 font-medium"}`}>{check.label}</p>
                            {!check.passed && <p className="text-xs text-gray-400 mt-0.5">{check.tip}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Focus Keyword */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <label className="text-sm font-semibold text-gray-800 block mb-2 flex items-center gap-2">
                    <Target size={14} className="text-orange-500" /> Focus Keyword
                  </label>
                  <input
                    type="text"
                    value={form.focusKeyword}
                    onChange={(e) => setForm({ ...form, focusKeyword: e.target.value })}
                    placeholder="Ana anahtar kelime (ör: daire testere bıçağı)"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                {/* SEO Title & Description */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Globe size={14} className="text-blue-500" /> Google Önizleme
                  </h3>

                  {/* Preview */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-blue-700 text-lg font-medium leading-tight truncate">{form.seoTitle || form.title || "Başlık ekleyin"}</p>
                    <p className="text-green-700 text-xs mt-1 truncate">testereplus.com/blog/{form.slug || "slug"}</p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{form.seoDescription || form.excerpt || "Meta açıklama ekleyin..."}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">SEO Başlık</label>
                    <input
                      type="text"
                      value={form.seoTitle}
                      onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                      placeholder={form.title || "SEO başlığı"}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-400">{(form.seoTitle || form.title).length}/60 karakter</p>
                      <p className={`text-xs ${(form.seoTitle || form.title).length >= 30 && (form.seoTitle || form.title).length <= 60 ? "text-green-500" : "text-red-400"}`}>
                        {(form.seoTitle || form.title).length >= 30 && (form.seoTitle || form.title).length <= 60 ? "✓ İdeal" : "30-60 karakter önerilir"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Meta Açıklama</label>
                    <textarea
                      value={form.seoDescription}
                      onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                      rows={3}
                      placeholder="Bu yazının kısa açıklaması..."
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-400">{form.seoDescription.length}/160 karakter</p>
                      <p className={`text-xs ${form.seoDescription.length >= 120 && form.seoDescription.length <= 160 ? "text-green-500" : "text-red-400"}`}>
                        {form.seoDescription.length >= 120 && form.seoDescription.length <= 160 ? "✓ İdeal" : "120-160 karakter önerilir"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">SEO Keywords</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                        placeholder="Keyword ekle ve Enter'a bas"
                        className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                    {form.seoKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {form.seoKeywords.map((kw, i) => (
                          <span key={i} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                            {kw}
                            <button onClick={() => setForm({ ...form, seoKeywords: form.seoKeywords.filter((_, j) => j !== i) })} className="hover:text-red-500"><X size={10} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Canonical URL</label>
                    <input
                      type="text"
                      value={form.canonical}
                      onChange={(e) => setForm({ ...form, canonical: e.target.value })}
                      placeholder="https://testereplus.com/blog/..."
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-5">
                <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <ExternalLink size={14} className="text-blue-500" /> Open Graph (Facebook / LinkedIn)
                  </h3>

                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                      {form.ogImage ? (
                        <img src={form.ogImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={32} className="text-gray-300" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-400 uppercase">testereplus.com</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">{form.ogTitle || form.seoTitle || form.title || "Başlık"}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{form.ogDescription || form.seoDescription || "Açıklama"}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">OG Başlık</label>
                    <input type="text" value={form.ogTitle} onChange={(e) => setForm({ ...form, ogTitle: e.target.value })} placeholder={form.seoTitle || form.title} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">OG Açıklama</label>
                    <textarea value={form.ogDescription} onChange={(e) => setForm({ ...form, ogDescription: e.target.value })} rows={2} placeholder={form.seoDescription} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">OG Görsel URL</label>
                    <input type="text" value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} placeholder="https://..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* SEO Score Ring */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={seoScore >= 80 ? "#22c55e" : seoScore >= 50 ? "#f97316" : "#ef4444"} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${seoScore * 2.64} 264`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${seoColor.text}`}>{seoScore}</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">SEO Skoru</p>
                <p className={`text-xs ${seoColor.text} font-medium`}>{seoColor.label}</p>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Geçen</span>
                  <span className="text-green-600 font-medium">{seoChecks.filter((c) => c.passed).length}/{seoChecks.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Kalan</span>
                  <span className="text-red-500 font-medium">{seoChecks.filter((c) => !c.passed).length}/{seoChecks.length}</span>
                </div>
              </div>
            </div>

            {/* Post Settings */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">Yazı Ayarları</h3>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Kategori</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {blogCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Etiketler</label>
                <div className="flex items-center gap-2">
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Etiket ekle" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.tags.map((t, i) => (
                      <span key={i} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                        #{t}
                        <button onClick={() => setForm({ ...form, tags: form.tags.filter((_, j) => j !== i) })}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Öne Çıkan Görsel</label>
                <input type="text" value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} placeholder="Görsel URL" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                {form.featuredImage && (
                  <div className="mt-2 rounded-lg overflow-hidden bg-gray-50 h-32">
                    <img src={form.featuredImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Suggestions */}
            {seoChecks.filter((c) => !c.passed).length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-orange-800 flex items-center gap-2 mb-3">
                  <Sparkles size={14} /> İyileştirme Önerileri
                </h3>
                <div className="space-y-2">
                  {seoChecks.filter((c) => !c.passed).slice(0, 5).map((check, i) => (
                    <p key={i} className="text-xs text-orange-700 flex items-start gap-2">
                      <AlertCircle size={12} className="shrink-0 mt-0.5" />
                      {check.tip}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── LIST VIEW ───
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
        {filtered.map((post) => {
          const checks = analyzeSEO(post);
          const score = getSEOScore(checks);
          const color = getSEOColor(score);
          return (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {post.featuredImage ? (
                  <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} className="text-gray-300" />
                )}
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
                  <span className={`flex items-center gap-1 ${color.text} font-medium`}>
                    <Target size={11} /> SEO: {score}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(post)} className="p-2 rounded-lg hover:bg-gray-100" title="Düzenle"><Edit2 size={16} className="text-gray-400" /></button>
                <button onClick={() => deletePost(post.id)} className="p-2 rounded-lg hover:bg-red-50" title="Sil"><Trash2 size={16} className="text-gray-400 hover:text-red-500" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
