"use client";

import { useState } from "react";
import { X, MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  const [tooltip, setTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {tooltip && (
        <div className="bg-white border border-border rounded-2xl shadow-xl p-4 max-w-[260px] relative animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => setTooltip(false)}
            className="absolute top-2 right-2 p-1 hover:bg-bg-secondary rounded-lg transition-colors"
          >
            <X size={14} className="text-text-muted" />
          </button>
          <p className="text-sm font-medium text-text-primary mb-1">Yardıma mı ihtiyacınız var?</p>
          <p className="text-xs text-text-muted">WhatsApp üzerinden bize ulaşın, hemen yanıt verelim.</p>
        </div>
      )}
      <a
        href="https://wa.me/905551234567?text=Merhaba%2C%20bilgi%20almak%20istiyorum."
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
