"use client";

import { useState, type FormEvent } from "react";
import { Star, ThumbsUp, User } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

const mockReviews: Review[] = [
  { id: "1", name: "Ahmet Y.", rating: 5, comment: "Mükemmel kesim kalitesi, çapak yapmıyor. Fiyat/performans olarak çok iyi.", date: "2026-03-15", helpful: 8 },
  { id: "2", name: "Mehmet K.", rating: 4, comment: "Gayet güzel ürün, hızlı kargo ile geldi. Tek eksik kutu biraz ezilmişti.", date: "2026-02-20", helpful: 3 },
  { id: "3", name: "Fatma S.", rating: 5, comment: "İş yerinde kullanıyoruz, dayanıklılığı çok iyi. Tavsiye ederim.", date: "2026-01-10", helpful: 12 },
];

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    const newReview: Review = {
      id: Date.now().toString(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    };
    setReviews([newReview, ...reviews]);
    setName("");
    setComment("");
    setRating(5);
    setShowForm(false);
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-6">Müşteri Değerlendirmeleri</h2>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Summary */}
        <div className="bg-bg-secondary rounded-2xl p-6 text-center">
          <div className="text-4xl font-bold text-text-primary mb-1">{avg.toFixed(1)}</div>
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={18} className={s <= Math.round(avg) ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
            ))}
          </div>
          <p className="text-sm text-text-muted">{reviews.length} değerlendirme</p>
        </div>

        {/* Distribution */}
        <div className="md:col-span-2 space-y-2">
          {distribution.map((d) => (
            <div key={d.star} className="flex items-center gap-3">
              <span className="text-sm text-text-muted w-12">{d.star} yıldız</span>
              <div className="flex-1 bg-bg-secondary rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${d.pct}%` }} />
              </div>
              <span className="text-sm text-text-muted w-8 text-right">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
      >
        {showForm ? "İptal" : "Değerlendirme Yaz"}
      </button>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-2">Puanınız</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                >
                  <Star
                    size={28}
                    className={`transition-colors cursor-pointer ${
                      s <= (hoverRating || rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Adınız *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                placeholder="Adınız"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Yorumunuz *</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all resize-none"
              placeholder="Ürün hakkındaki düşünceleriniz..."
            />
          </div>
          <button
            type="submit"
            className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Değerlendirmeyi Gönder
          </button>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-bg-secondary rounded-full flex items-center justify-center">
                  <User size={18} className="text-text-muted" />
                </div>
                <div>
                  <p className="font-medium text-sm">{review.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                      ))}
                    </div>
                    <span className="text-xs text-text-muted">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-3">{review.comment}</p>
            <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors">
              <ThumbsUp size={12} />
              Faydalı ({review.helpful})
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
