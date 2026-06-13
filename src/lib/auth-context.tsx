"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addresses: Address[];
  orders: Order[];
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: "hazirlaniyor" | "kargoda" | "teslim" | "iptal";
  items: { name: string; quantity: number; price: number }[];
  total: number;
  trackingCode?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  register: (data: { fullName: string; email: string; phone: string; password: string }) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, "fullName" | "email" | "phone">>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tp_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  function persist(u: User) {
    setUser(u);
    localStorage.setItem("tp_user", JSON.stringify(u));
    const users = JSON.parse(localStorage.getItem("tp_users") || "{}");
    users[u.email] = { ...u, password: users[u.email]?.password };
    localStorage.setItem("tp_users", JSON.stringify(users));
  }

  function login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem("tp_users") || "{}");
    const found = users[email];
    if (found && found.password === password) {
      const { password: _, ...userData } = found;
      persist(userData);
      return true;
    }
    return false;
  }

  function register(data: { fullName: string; email: string; phone: string; password: string }): boolean {
    const users = JSON.parse(localStorage.getItem("tp_users") || "{}");
    if (users[data.email]) return false;
    const newUser: User = {
      id: Date.now().toString(36),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      addresses: [],
      orders: [],
    };
    users[data.email] = { ...newUser, password: data.password };
    localStorage.setItem("tp_users", JSON.stringify(users));
    persist(newUser);
    return true;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("tp_user");
  }

  function updateProfile(data: Partial<Pick<User, "fullName" | "email" | "phone">>) {
    if (!user) return;
    persist({ ...user, ...data });
  }

  function addAddress(address: Omit<Address, "id">) {
    if (!user) return;
    const newAddr = { ...address, id: Date.now().toString(36) };
    if (address.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }
    persist({ ...user, addresses: [...user.addresses, newAddr] });
  }

  function removeAddress(id: string) {
    if (!user) return;
    persist({ ...user, addresses: user.addresses.filter((a) => a.id !== id) });
  }

  function setDefaultAddress(id: string) {
    if (!user) return;
    persist({
      ...user,
      addresses: user.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
    });
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, login, register, logout, updateProfile, addAddress, removeAddress, setDefaultAddress }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
