"use client";

import { useState } from "react";
import { Search, Star, Clock, X } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  starred: boolean;
}

const initialMessages: Message[] = [
  { id: "1", sender: "Mehmet Yılmaz", subject: "Freud 250x80 stok durumu", preview: "Merhaba, Freud 250x80 daire testere bıçağı stokta var mı? Ne zaman gelecek acaba...", date: "2 saat önce", read: false, starred: false },
  { id: "2", sender: "Ali Kaya", subject: "Toplu sipariş indirimi", preview: "30 adet Kronberg HM daire testere almak istiyoruz. Toplu alım için indirim yapabilir misiniz?", date: "5 saat önce", read: false, starred: true },
  { id: "3", sender: "Hasan Demir", subject: "Kargo takip bilgisi", preview: "SP-1245 numaralı siparişimin kargo takip numarasını öğrenebilir miyim?", date: "1 gün önce", read: true, starred: false },
  { id: "4", sender: "Fatma Öztürk", subject: "İade talebi", preview: "Aldığım Netmak testere bıçağının boyutu yanlış geldi. İade prosedürü nasıl işliyor?", date: "2 gün önce", read: true, starred: false },
  { id: "5", sender: "Kemal Bozkurt", subject: "Özel kesim testere", preview: "Özel ölçülerde daire testere bıçağı yaptırabiliyor musunuz? 280mm çap, 60 diş...", date: "3 gün önce", read: true, starred: true },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [search, setSearch] = useState("");
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

  const filtered = messages.filter((m) =>
    m.sender.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.preview.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.read).length;

  function toggleStar(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, starred: !m.starred } : m));
  }

  function openMessage(msg: Message) {
    setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: true } : m));
    setSelectedMsg({ ...msg, read: true });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">{unreadCount} okunmamış mesaj</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Mesajlarda ara..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        {filtered.map((msg) => (
          <div key={msg.id} onClick={() => openMessage(msg)} className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!msg.read ? "bg-orange-50/30" : ""}`}>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-gray-500">{msg.sender.split(" ").map((n) => n[0]).join("")}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className={`text-sm ${!msg.read ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>{msg.sender}</p>
                {!msg.read && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
              </div>
              <p className={`text-sm ${!msg.read ? "font-semibold text-gray-800" : "text-gray-600"}`}>{msg.subject}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{msg.preview}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-400">{msg.date}</span>
              <button onClick={(e) => toggleStar(msg.id, e)} className="p-1 rounded hover:bg-gray-200">
                <Star size={14} className={msg.starred ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-400">Sonuç bulunamadı</div>
        )}
      </div>

      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedMsg.subject}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{selectedMsg.sender} · {selectedMsg.date}</p>
              </div>
              <button onClick={() => setSelectedMsg(null)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
              {selectedMsg.preview}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setSelectedMsg(null)} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
