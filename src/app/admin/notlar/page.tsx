"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pin, PinOff, X, Check, StickyNote, Search, Calendar } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  author: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "testereplus_notes";
const COLORS = [
  { value: "bg-yellow-50 border-yellow-200", dot: "bg-yellow-400" },
  { value: "bg-blue-50 border-blue-200", dot: "bg-blue-400" },
  { value: "bg-green-50 border-green-200", dot: "bg-green-400" },
  { value: "bg-pink-50 border-pink-200", dot: "bg-pink-400" },
  { value: "bg-purple-50 border-purple-200", dot: "bg-purple-400" },
  { value: "bg-orange-50 border-orange-200", dot: "bg-orange-400" },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState(COLORS[0].value);
  const [author, setAuthor] = useState("Yiğit");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) try { setNotes(JSON.parse(stored)); } catch {}
  }, []);

  const save = useCallback((data: Note[]) => {
    setNotes(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  function resetForm() {
    setTitle(""); setContent(""); setColor(COLORS[0].value); setAuthor("Yiğit"); setEditId(null);
  }

  function handleSubmit() {
    if (!title.trim()) return;
    if (editId) {
      save(notes.map((n) => n.id === editId ? { ...n, title, content, color, author, updatedAt: Date.now() } : n));
    } else {
      save([{
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        title, content, color, pinned: false, author,
        createdAt: Date.now(), updatedAt: Date.now(),
      }, ...notes]);
    }
    resetForm();
    setShowForm(false);
  }

  function startEdit(n: Note) {
    setTitle(n.title); setContent(n.content); setColor(n.color); setAuthor(n.author); setEditId(n.id);
    setShowForm(true);
  }

  function togglePin(id: string) {
    save(notes.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n));
  }

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
  );
  const pinned = filtered.filter((n) => n.pinned);
  const unpinned = filtered.filter((n) => !n.pinned);

  function timeAgo(ts: number) {
    const diff = Date.now() - ts;
    if (diff < 60000) return "Az önce";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} dk önce`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} saat önce`;
    return new Date(ts).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Hızlı notlar ve yapılacaklar</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
          <Plus size={16} /> Yeni Not
        </button>
      </div>

      {notes.length > 3 && (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Notlarda ara..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
        </div>
      )}

      {notes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-4">
            <StickyNote size={28} className="text-yellow-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">Henüz not yok</p>
          <p className="text-xs text-gray-400 mb-4">İlk notunuzu ekleyerek başlayın</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">Yeni Not</button>
        </div>
      )}

      {pinned.length > 0 && (
        <>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Pin size={12} /> Sabitlenmiş</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinned.map((note) => (
              <NoteCard key={note.id} note={note} onEdit={startEdit} onDelete={(id) => save(notes.filter((n) => n.id !== id))} onTogglePin={togglePin} timeAgo={timeAgo} />
            ))}
          </div>
        </>
      )}

      {unpinned.length > 0 && (
        <>
          {pinned.length > 0 && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Diğer</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unpinned.map((note) => (
              <NoteCard key={note.id} note={note} onEdit={startEdit} onDelete={(id) => save(notes.filter((n) => n.id !== id))} onTogglePin={togglePin} timeAgo={timeAgo} />
            ))}
          </div>
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowForm(false); resetForm(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{editId ? "Not Düzenle" : "Yeni Not"}</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Başlık" autoFocus className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Not içeriği..." rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Renk</label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button key={c.value} onClick={() => setColor(c.value)} className={`w-8 h-8 rounded-full border-2 transition-all ${c.dot} ${color === c.value ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Yazan</label>
                <div className="flex gap-2">
                  {["Yiğit", "Ortak"].map((p) => (
                    <button key={p} onClick={() => setAuthor(p)} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${author === p ? "border-orange-300 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">İptal</button>
              <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"><Check size={16} /> Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NoteCard({ note, onEdit, onDelete, onTogglePin, timeAgo }: { note: Note; onEdit: (n: Note) => void; onDelete: (id: string) => void; onTogglePin: (id: string) => void; timeAgo: (ts: number) => string }) {
  return (
    <div className={`border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer ${note.color}`} onClick={() => onEdit(note)}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-800 flex-1">{note.title}</h3>
        <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onTogglePin(note.id)} className="p-1 rounded hover:bg-white/50">
            {note.pinned ? <PinOff size={13} className="text-gray-500" /> : <Pin size={13} className="text-gray-400" />}
          </button>
          <button onClick={() => onDelete(note.id)} className="p-1 rounded hover:bg-red-100">
            <Trash2 size={13} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>
      {note.content && <p className="text-xs text-gray-600 mb-3 line-clamp-3 whitespace-pre-wrap">{note.content}</p>}
      <div className="flex items-center justify-between text-[10px] text-gray-400">
        <span>{note.author}</span>
        <span>{timeAgo(note.updatedAt)}</span>
      </div>
    </div>
  );
}
