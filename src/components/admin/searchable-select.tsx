"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
}

export function SearchableSelect({ value, onChange, options, placeholder = "Seçiniz", label }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {label && <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>}
      <button
        type="button"
        onClick={() => { setOpen(!open); setSearch(""); }}
        className={`w-full flex items-center justify-between border rounded-lg px-4 py-3 text-sm text-left transition-all ${
          open ? "border-orange-500 ring-2 ring-orange-500/20" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <span
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="p-0.5 hover:bg-gray-100 rounded"
            >
              <X size={14} className="text-gray-400" />
            </span>
          )}
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ara..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Sonuç bulunamadı</p>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { onChange(option.value); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-orange-50 transition-colors ${
                    value === option.value ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700"
                  }`}
                >
                  {option.label}
                  {value === option.value && <Check size={14} className="text-orange-500" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
