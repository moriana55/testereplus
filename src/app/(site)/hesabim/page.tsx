"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, type Address } from "@/lib/auth-context";
import { User, MapPin, Package, LogOut, Plus, Trash2, Star, Lock, Eye, EyeOff } from "lucide-react";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

type Tab = "profil" | "siparisler" | "adresler";

export default function HesabimPage() {
  const { user, isLoggedIn, login, register, logout, updateProfile, addAddress, removeAddress, setDefaultAddress } = useAuth();
  const [tab, setTab] = useState<Tab>("profil");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [profileForm, setProfileForm] = useState({ fullName: "", email: "", phone: "" });
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState<Omit<Address, "id">>({
    label: "",
    fullName: "",
    phone: "",
    city: "",
    district: "",
    address: "",
    postalCode: "",
    isDefault: false,
  });

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Hesabım", url: "/hesabim" }]} />
        <div className="bg-white border border-border rounded-2xl p-8">
          <div className="flex mb-6 border-b border-border">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${mode === "login" ? "border-accent text-accent" : "border-transparent text-text-muted"}`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${mode === "register" ? "border-accent text-accent" : "border-transparent text-text-muted"}`}
            >
              Kayıt Ol
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}

          {mode === "login" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!login(loginForm.email, loginForm.password)) {
                  setError("E-posta veya şifre hatalı.");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">E-posta</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  placeholder="ornek@email.com"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Şifre</label>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none pr-12"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-9 text-text-muted">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white py-3.5 rounded-xl font-semibold transition-colors">
                Giriş Yap
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!register(regForm)) {
                  setError("Bu e-posta adresi zaten kayıtlı.");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">E-posta</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Telefon</label>
                <input
                  type="tel"
                  required
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Şifre</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white py-3.5 rounded-xl font-semibold transition-colors">
                Kayıt Ol
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profil", label: "Profilim", icon: User },
    { id: "siparisler", label: "Siparişlerim", icon: Package },
    { id: "adresler", label: "Adreslerim", icon: MapPin },
  ];

  const statusLabels: Record<string, { label: string; color: string }> = {
    hazirlaniyor: { label: "Hazırlanıyor", color: "bg-yellow-50 text-yellow-700" },
    kargoda: { label: "Kargoda", color: "bg-blue-50 text-blue-700" },
    teslim: { label: "Teslim Edildi", color: "bg-green-50 text-green-700" },
    iptal: { label: "İptal", color: "bg-red-50 text-red-700" },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Hesabım", url: "/hesabim" }]} />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Hesabım</h1>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors">
          <LogOut size={16} />
          Çıkış Yap
        </button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-border">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === id ? "border-accent text-accent" : "border-transparent text-text-muted hover:text-text-primary"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {tab === "profil" && (
        <div className="bg-white border border-border rounded-2xl p-6 max-w-lg">
          <h2 className="font-bold mb-6">Profil Bilgileri</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(profileForm.fullName ? profileForm : {});
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Ad Soyad</label>
              <input
                type="text"
                defaultValue={user!.fullName}
                onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">E-posta</label>
              <input
                type="email"
                defaultValue={user!.email}
                onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Telefon</label>
              <input
                type="tel"
                defaultValue={user!.phone}
                onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
              />
            </div>
            <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              Kaydet
            </button>
          </form>
        </div>
      )}

      {tab === "siparisler" && (
        <div className="space-y-4">
          {(user!.orders || []).length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-12 text-center">
              <Package size={48} className="mx-auto text-text-muted mb-4" />
              <p className="text-text-muted mb-4">Henüz siparişiniz bulunmuyor.</p>
              <Link href="/urunler" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            user!.orders.map((order) => (
              <div key={order.id} className="bg-white border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm text-text-muted">Sipariş #{order.id}</span>
                    <span className="text-sm text-text-muted ml-3">{order.date}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabels[order.status]?.color}`}>
                    {statusLabels[order.status]?.label}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-medium">{item.price.toLocaleString("tr-TR")} ₺</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border flex justify-between">
                  <span className="font-bold">Toplam</span>
                  <span className="font-bold text-accent">{order.total.toLocaleString("tr-TR")} ₺</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "adresler" && (
        <div>
          <button
            onClick={() => setShowAddrForm(!showAddrForm)}
            className="flex items-center gap-2 mb-6 bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
            Yeni Adres Ekle
          </button>

          {showAddrForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addAddress(addrForm);
                setAddrForm({ label: "", fullName: "", phone: "", city: "", district: "", address: "", postalCode: "", isDefault: false });
                setShowAddrForm(false);
              }}
              className="bg-white border border-border rounded-2xl p-6 mb-6"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Adres Adı (Ev, İş vb.)</label>
                  <input
                    type="text"
                    required
                    value={addrForm.label}
                    onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Ad Soyad</label>
                  <input
                    type="text"
                    required
                    value={addrForm.fullName}
                    onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Telefon</label>
                  <input
                    type="tel"
                    required
                    value={addrForm.phone}
                    onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">İl</label>
                  <input
                    type="text"
                    required
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">İlçe</label>
                  <input
                    type="text"
                    required
                    value={addrForm.district}
                    onChange={(e) => setAddrForm({ ...addrForm, district: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Adres</label>
                  <textarea
                    required
                    rows={2}
                    value={addrForm.address}
                    onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Posta Kodu</label>
                  <input
                    type="text"
                    value={addrForm.postalCode}
                    onChange={(e) => setAddrForm({ ...addrForm, postalCode: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addrForm.isDefault}
                      onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                      className="accent-accent"
                    />
                    <span className="text-sm">Varsayılan adres olarak ayarla</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAddrForm(false)} className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-bg-secondary transition-colors">
                  İptal
                </button>
                <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                  Kaydet
                </button>
              </div>
            </form>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {(user!.addresses || []).length === 0 ? (
              <div className="sm:col-span-2 bg-white border border-border rounded-2xl p-12 text-center">
                <MapPin size={48} className="mx-auto text-text-muted mb-4" />
                <p className="text-text-muted">Henüz kayıtlı adresiniz yok.</p>
              </div>
            ) : (
              user!.addresses.map((addr) => (
                <div key={addr.id} className="bg-white border border-border rounded-2xl p-5 relative">
                  {addr.isDefault && (
                    <span className="absolute top-3 right-3 bg-accent/10 text-accent text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star size={10} />
                      Varsayılan
                    </span>
                  )}
                  <h3 className="font-semibold mb-2">{addr.label}</h3>
                  <p className="text-sm text-text-secondary mb-1">{addr.fullName} — {addr.phone}</p>
                  <p className="text-sm text-text-muted">{addr.address}, {addr.district}/{addr.city}</p>
                  <div className="flex gap-2 mt-4">
                    {!addr.isDefault && (
                      <button onClick={() => setDefaultAddress(addr.id)} className="text-xs text-accent hover:underline">
                        Varsayılan Yap
                      </button>
                    )}
                    <button onClick={() => removeAddress(addr.id)} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                      <Trash2 size={12} />
                      Sil
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
