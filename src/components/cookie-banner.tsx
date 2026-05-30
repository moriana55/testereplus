"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-bg-dark text-gray-300 rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Cookie size={24} className="text-accent shrink-0" />
        <div className="flex-1 text-sm">
          <p>
            Bu web sitesi deneyiminizi geliştirmek için çerezler kullanmaktadır.
            Siteyi kullanmaya devam ederek{" "}
            <a href="/kvkk" className="text-accent hover:underline">KVKK Aydınlatma Metni</a>
            &apos;ni kabul etmiş olursunuz.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={accept}
            className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Kabul Et
          </button>
          <button
            onClick={() => setVisible(false)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
