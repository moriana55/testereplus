"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, CreditCard, Truck, MapPin } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/data";

export default function OdemePage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    address: "",
    postalCode: "",
    note: "",
  });

  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("card");

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-text-muted mb-6" />
        <h1 className="text-2xl font-bold mb-3">Sepetiniz Boş</h1>
        <p className="text-text-muted mb-8">Ödeme yapabilmek için sepetinize ürün ekleyin.</p>
        <Link
          href="/urunler"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Ürünlere Göz At
        </Link>
      </div>
    );
  }

  function handleSubmit() {
    clearCart();
    router.push("/siparis?id=TP-" + Date.now().toString(36).toUpperCase());
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/sepet" className="p-2 hover:bg-bg-secondary rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Ödeme</h1>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-10">
        {[
          { num: 1, label: "Adres", icon: MapPin },
          { num: 2, label: "Kargo", icon: Truck },
          { num: 3, label: "Ödeme", icon: CreditCard },
        ].map(({ num, label, icon: Icon }) => (
          <div key={num} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= num ? "bg-accent text-white" : "bg-bg-secondary text-text-muted"
              }`}
            >
              {num}
            </div>
            <span className={`text-sm font-medium hidden sm:inline ${step >= num ? "text-text-primary" : "text-text-muted"}`}>
              {label}
            </span>
            {num < 3 && <div className={`flex-1 h-0.5 ${step > num ? "bg-accent" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <MapPin size={20} />
                Teslimat Adresi
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Ad Soyad *</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Telefon *</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    placeholder="0555 123 45 67"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">E-posta *</label>
                  <input
                    type="email"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    placeholder="ornek@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">İl *</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    placeholder="İstanbul"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">İlçe *</label>
                  <input
                    type="text"
                    value={address.district}
                    onChange={(e) => setAddress({ ...address, district: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    placeholder="Kadıköy"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Adres *</label>
                  <textarea
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all resize-none"
                    placeholder="Mahalle, sokak, bina no, daire no..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Posta Kodu</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    placeholder="34000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Sipariş Notu</label>
                  <input
                    type="text"
                    value={address.note}
                    onChange={(e) => setAddress({ ...address, note: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    placeholder="Kapıcıya bırakın vs."
                  />
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full bg-accent hover:bg-accent-hover text-white py-3.5 rounded-xl font-semibold transition-colors"
              >
                Kargo Seçimine Geç
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Truck size={20} />
                Kargo Seçimi
              </h2>
              <div className="space-y-3">
                {[
                  { id: "standard", label: "Standart Kargo", desc: "2-4 iş günü", price: "Ücretsiz" },
                  { id: "express", label: "Hızlı Kargo", desc: "1-2 iş günü", price: "+150 ₺" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      shipping === opt.id ? "border-accent bg-accent/5 ring-2 ring-accent/20" : "border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={opt.id}
                        checked={shipping === opt.id}
                        onChange={(e) => setShipping(e.target.value)}
                        className="accent-accent"
                      />
                      <div>
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-sm text-text-muted">{opt.desc}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${opt.price === "Ücretsiz" ? "text-green-600" : "text-text-primary"}`}>
                      {opt.price}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-border hover:bg-bg-secondary py-3.5 rounded-xl font-semibold transition-colors"
                >
                  Geri
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-accent hover:bg-accent-hover text-white py-3.5 rounded-xl font-semibold transition-colors"
                >
                  Ödeme Yöntemine Geç
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} />
                Ödeme Yöntemi
              </h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: "card", label: "Kredi / Banka Kartı", desc: "Visa, Mastercard, Troy" },
                  { id: "transfer", label: "Havale / EFT", desc: "Banka havalesi ile ödeme" },
                  { id: "door", label: "Kapıda Ödeme", desc: "Kapıda kredi kartı veya nakit" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                      payment === opt.id ? "border-accent bg-accent/5 ring-2 ring-accent/20" : "border-border hover:border-accent/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={payment === opt.id}
                      onChange={(e) => setPayment(e.target.value)}
                      className="accent-accent mr-3"
                    />
                    <div>
                      <p className="font-medium">{opt.label}</p>
                      <p className="text-sm text-text-muted">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {payment === "card" && (
                <div className="border border-border rounded-xl p-4 mb-6 bg-bg-secondary">
                  <p className="text-sm text-text-muted text-center py-4">
                    Ödeme entegrasyonu yakında aktif olacak. Şimdilik WhatsApp ile sipariş verebilirsiniz.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-border hover:bg-bg-secondary py-3.5 rounded-xl font-semibold transition-colors"
                >
                  Geri
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-accent hover:bg-accent-hover text-white py-3.5 rounded-xl font-semibold transition-colors"
                >
                  Siparişi Tamamla
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-border rounded-2xl p-6 sticky top-28">
            <h2 className="text-lg font-bold mb-4">Sipariş Özeti</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-text-secondary line-clamp-1 flex-1 mr-2">
                    {item.name} <span className="text-text-muted">x{item.quantity}</span>
                  </span>
                  <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Ara Toplam</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Kargo</span>
                <span className="text-green-600 font-medium">
                  {shipping === "express" ? formatPrice(150) : "Ücretsiz"}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-bold">Toplam</span>
                <span className="text-xl font-bold text-accent">
                  {formatPrice(totalPrice + (shipping === "express" ? 150 : 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
