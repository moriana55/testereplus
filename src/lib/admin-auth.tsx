"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminAuth {
  isLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuth>({ isLoggedIn: false, login: () => false, logout: () => {} });

const ADMIN_KEY = "tp_admin_auth";
const ADMIN_PASSWORD = "testere2024";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem(ADMIN_KEY) === "1");
    setChecked(true);
  }, []);

  function login(password: string) {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, "1");
      setIsLoggedIn(true);
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(ADMIN_KEY);
    setIsLoggedIn(false);
  }

  if (!checked) return null;

  return (
    <AdminAuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
