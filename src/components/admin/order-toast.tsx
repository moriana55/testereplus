"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, X, Volume2, VolumeX } from "lucide-react";
import { playCashRegister } from "@/lib/sounds";

const customers = [
  "Mehmet Yılmaz", "Ali Kaya", "Hasan Demir", "Ayşe Çelik", "Fatma Öztürk",
  "Veli Arslan", "Ahmet Şahin", "Mustafa Koç", "Emre Aydın", "Burak Özdemir",
  "Serkan Yıldız", "Oğuz Kara", "Deniz Aksoy", "Cem Erdoğan", "Tuncay Balcı",
];

const products = [
  "Freud Daire Testere 250x80", "Martin Miller Şerit Testere", "GKG Metal Daire Testere",
  "Kronberg HM Daire Testere", "Netmak Çok Yönlü Testere", "Piranha Planya Bıçağı",
  "Tideway Pah Bıçağı", "Tideway Kanal Tarama Bıçağı",
];

const amounts = ["₺890", "₺1.240", "₺2.850", "₺520", "₺3.450", "₺1.850", "₺4.200", "₺680", "₺1.560", "₺2.100"];

interface Toast {
  id: number;
  customer: string;
  product: string;
  amount: string;
  visible: boolean;
}

export default function OrderToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    const handler = () => setInteracted(true);
    window.addEventListener("click", handler, { once: true });
    window.addEventListener("keydown", handler, { once: true });
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("keydown", handler);
    };
  }, []);

  const addToast = useCallback(() => {
    const toast: Toast = {
      id: Date.now(),
      customer: customers[Math.floor(Math.random() * customers.length)],
      product: products[Math.floor(Math.random() * products.length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      visible: true,
    };

    setToasts((prev) => [toast, ...prev].slice(0, 3));

    if (soundEnabled && interacted) {
      playCashRegister();
    }

    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === toast.id ? { ...t, visible: false } : t));
    }, 5000);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 5500);
  }, [soundEnabled, interacted]);

  useEffect(() => {
    const first = setTimeout(addToast, 15000 + Math.random() * 15000);

    const interval = setInterval(() => {
      addToast();
    }, 45000 + Math.random() * 60000);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [addToast]);

  return (
    <>
      {/* Sound toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed bottom-24 right-7 z-30 w-9 h-9 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        title={soundEnabled ? "Sesi kapat" : "Sesi aç"}
      >
        {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
      </button>

      {/* Toast stack */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 w-80">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 flex gap-3 transition-all duration-500 ${
              toast.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
              <ShoppingCart size={18} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Yeni Sipariş!</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{toast.customer} — {toast.product}</p>
              <p className="text-sm font-bold text-green-600 mt-0.5">{toast.amount}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 self-start shrink-0"
            >
              <X size={14} className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
