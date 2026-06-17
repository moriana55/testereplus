"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

/**
 * Admin auth (istemci tarafı ince kabuk)
 *
 * Tüm gerçek doğrulama SUNUCUDA yapılır:
 *  - login()  → POST /api/admin/auth (şifre sunucuda ADMIN_PASSWORD ile doğrulanır,
 *               başarılıysa httpOnly imzalı çerez yazılır).
 *  - oturum   → GET /api/admin/auth (çerez imzası sunucuda doğrulanır).
 *  - logout() → DELETE /api/admin/auth (çerez silinir).
 *
 * localStorage ile bypass YOKTUR; şifre istemci kodunda bulunmaz.
 */

interface AdminAuth {
  isLoggedIn: boolean;
  configured: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuth>({
  isLoggedIn: false,
  configured: true,
  login: async () => false,
  logout: async () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/auth", { method: "GET", cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        setIsLoggedIn(Boolean(data.loggedIn));
        setConfigured(Boolean(data.configured));
      } catch {
        if (active) setIsLoggedIn(false);
      } finally {
        if (active) setChecked(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (password: string) => {
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsLoggedIn(true);
        return true;
      }
      if (res.status === 503) setConfigured(false);
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } finally {
      setIsLoggedIn(false);
    }
  }, []);

  if (!checked) return null;

  return (
    <AdminAuthContext.Provider value={{ isLoggedIn, configured, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
