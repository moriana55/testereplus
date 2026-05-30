"use client";

import { useState, type FormEvent } from "react";
import { Package, Search, Truck, CheckCircle, Clock, MapPin } from "lucide-react";

interface TrackingStep {
  status: string;
  location: string;
  date: string;
  active: boolean;
}

export default function KargoTakipPage() {
  const [orderNo, setOrderNo] = useState("");
  const [searched, setSearched] = useState(false);
  const [found, setFound] = useState(false);

  const mockSteps: TrackingStep[] = [
    { status: "Sipariş Alındı", location: "Testere Plus", date: "22 Mayıs 2026 — 14:30", active: true },
    { status: "Hazırlanıyor", location: "Testere Plus Depo", date: "22 Mayıs 2026 — 16:45", active: true },
    { status: "Kargoya Verildi", location: "Yurtiçi Kargo — İstanbul", date: "23 Mayıs 2026 — 09:15", active: true },
    { status: "Transfer Merkezi", location: "Yurtiçi Kargo — Ankara Aktarma", date: "23 Mayıs 2026 — 22:00", active: true },
    { status: "Dağıtımda", location: "Yurtiçi Kargo — Ankara/Çankaya", date: "24 Mayıs 2026 — 08:30", active: false },
    { status: "Teslim Edildi", location: "", date: "", active: false },
  ];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!orderNo.trim()) return;
    setSearched(true);
    setFound(orderNo.toUpperCase().startsWith("TP-"));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package size={32} className="text-accent" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Kargo Takip</h1>
        <p className="text-text-muted">Sipariş numaranız ile kargonuzun durumunu sorgulayın.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-10">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            placeholder="Sipariş numarası (ör: TP-ABC123)"
            className="w-full pl-11 pr-4 py-3.5 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          className="bg-accent hover:bg-accent-hover text-white px-6 py-3.5 rounded-xl font-semibold transition-colors shrink-0"
        >
          Sorgula
        </button>
      </form>

      {searched && !found && (
        <div className="text-center py-12 bg-bg-secondary rounded-2xl">
          <Package size={48} className="mx-auto text-text-muted mb-4" />
          <p className="font-medium mb-1">Sipariş bulunamadı</p>
          <p className="text-sm text-text-muted">Lütfen sipariş numaranızı kontrol edip tekrar deneyin.</p>
        </div>
      )}

      {searched && found && (
        <div className="bg-white border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div>
              <p className="text-sm text-text-muted">Sipariş No</p>
              <p className="font-bold">{orderNo.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-muted">Tahmini Teslimat</p>
              <p className="font-bold text-accent">24-25 Mayıs 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <Truck size={20} className="text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">Kargo Yolda</p>
              <p className="text-xs text-amber-600">Yurtiçi Kargo — Takip No: 3456789012</p>
            </div>
          </div>

          <div className="relative pl-8">
            {mockSteps.map((step, i) => (
              <div key={i} className="relative pb-6 last:pb-0">
                <div className={`absolute left-[-20px] w-3 h-3 rounded-full border-2 ${
                  step.active ? "bg-accent border-accent" : "bg-white border-border"
                }`} />
                {i < mockSteps.length - 1 && (
                  <div className={`absolute left-[-15px] top-4 w-0.5 h-full ${step.active ? "bg-accent" : "bg-border"}`} />
                )}
                <div>
                  <p className={`text-sm font-medium ${step.active ? "text-text-primary" : "text-text-muted"}`}>
                    {step.status}
                  </p>
                  {step.location && (
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {step.location}
                    </p>
                  )}
                  {step.date && (
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {step.date}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
