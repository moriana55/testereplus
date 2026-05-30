"use client";

import { useState } from "react";
import { Star, Check, X, MessageSquare, Clock, ThumbsUp } from "lucide-react";

const initialReviews = [
  { id: "1", customer: "Mehmet Y.", product: "Freud Daire Testere 250x80", rating: 5, text: "Mükemmel kalite, aluminyum kesimde hiç zorlanmadım. Kesinlikle tavsiye ederim.", status: "approved", date: "05.05.2026" },
  { id: "2", customer: "Ali K.", product: "Martin Miller Şerit Testere", rating: 4, text: "Kaliteli ürün ama kargo biraz geç geldi. Ürünün kendisi gayet iyi.", status: "pending", date: "06.05.2026" },
  { id: "3", customer: "Hasan D.", product: "Kronberg HM Daire Testere", rating: 5, text: "3 aydır kullanıyorum, hala ilk günkü gibi keskin. Fiyat/performans oranı çok iyi.", status: "approved", date: "04.05.2026" },
  { id: "4", customer: "Kemal B.", product: "Netmak Çok Yönlü Testere", rating: 3, text: "İdare eder seviyede. Beklentimi tam karşılamadı ama fena da değil.", status: "pending", date: "07.05.2026" },
  { id: "5", customer: "Fatma Ö.", product: "Piranha Planya Bıçağı", rating: 5, text: "Harika planya bıçağı, yüzey kalitesi muhteşem. Tekrar alacağım.", status: "approved", date: "03.05.2026" },
  { id: "6", customer: "Veli A.", product: "Tideway Kanal Tarama Bıçağı", rating: 1, text: "Ürün kırık geldi, iade ettim.", status: "rejected", date: "02.05.2026" },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0";

  const statusStyles: Record<string, { label: string; color: string }> = {
    approved: { label: "Onaylandı", color: "bg-green-100 text-green-700" },
    pending: { label: "Beklemede", color: "bg-yellow-100 text-yellow-700" },
    rejected: { label: "Reddedildi", color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Yorumlar</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><MessageSquare size={16} className="text-blue-500" /><span className="text-xs text-gray-500">Toplam</span></div>
          <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Star size={16} className="text-amber-400 fill-amber-400" /><span className="text-xs text-gray-500">Ort. Puan</span></div>
          <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Clock size={16} className="text-yellow-500" /><span className="text-xs text-gray-500">Beklemede</span></div>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><ThumbsUp size={16} className="text-green-500" /><span className="text-xs text-gray-500">Onaylı</span></div>
          <p className="text-2xl font-bold text-green-600">{reviews.filter((r) => r.status === "approved").length}</p>
        </div>
      </div>

      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
        {[
          { value: "all", label: "Tümü", count: reviews.length },
          { value: "pending", label: "Beklemede", count: pendingCount },
          { value: "approved", label: "Onaylı", count: reviews.filter((r) => r.status === "approved").length },
          { value: "rejected", label: "Reddedildi", count: reviews.filter((r) => r.status === "rejected").length },
        ].map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f.value ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
            {f.label} <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f.value ? "bg-white/20" : "bg-gray-100"}`}>{f.count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((review) => {
          const s = statusStyles[review.status];
          return (
            <div key={review.id} className={`bg-white border rounded-xl p-5 hover:shadow-md transition-shadow ${review.status === "pending" ? "border-yellow-200" : "border-gray-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-500">{review.customer.split(" ").map((n) => n[0]).join("")}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{review.customer}</p>
                      <p className="text-xs text-gray-400">{review.product} · {review.date}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} className={i <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{review.text}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {review.status === "pending" && (
                    <>
                      <button onClick={() => setReviews(reviews.map((r) => r.id === review.id ? { ...r, status: "approved" } : r))} className="p-2 rounded-lg bg-green-50 hover:bg-green-100" title="Onayla"><Check size={16} className="text-green-600" /></button>
                      <button onClick={() => setReviews(reviews.map((r) => r.id === review.id ? { ...r, status: "rejected" } : r))} className="p-2 rounded-lg bg-red-50 hover:bg-red-100" title="Reddet"><X size={16} className="text-red-600" /></button>
                    </>
                  )}
                  {review.status !== "pending" && (
                    <button onClick={() => setReviews(reviews.map((r) => r.id === review.id ? { ...r, status: "pending" } : r))} className="p-2 rounded-lg hover:bg-gray-100" title="Beklemeye Al"><Clock size={16} className="text-gray-400" /></button>
                  )}
                  <button onClick={() => setReviews(reviews.filter((r) => r.id !== review.id))} className="p-2 rounded-lg hover:bg-red-50"><X size={16} className="text-gray-300 hover:text-red-500" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
