"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalState<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setState(JSON.parse(stored));
    } catch {}
    setLoaded(true);
  }, [key]);

  const setValue = useCallback((val: T | ((prev: T) => T)) => {
    setState((prev) => {
      const next = typeof val === "function" ? (val as (prev: T) => T)(prev) : val;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);

  return [state, setValue];
}
