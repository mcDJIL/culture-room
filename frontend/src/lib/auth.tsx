"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError, TOKEN_KEY, type AuthUser } from "@/lib/api";

export type { AuthUser };

export type AuthStatus = "loading" | "guest" | "signed-in";

type AuthValue = {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  requireLogin: () => boolean;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refreshUser = useCallback(async () => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setStatus("guest");
      return;
    }

    try {
      const currentUser = await api<AuthUser>("/auth/me", { token });
      setUser(currentUser);
      setStatus("signed-in");
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 401) {
        window.localStorage.removeItem(TOKEN_KEY);
      }
      setUser(null);
      setStatus("guest");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    refreshUser().catch(() => {
      if (!cancelled) {
        setUser(null);
        setStatus("guest");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const session = await api<{ token: string; user: AuthUser }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    window.localStorage.setItem(TOKEN_KEY, session.token);
    setUser(session.user);
    setStatus("signed-in");
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const session = await api<{ token: string; user: AuthUser }>("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    window.localStorage.setItem(TOKEN_KEY, session.token);
    setUser(session.user);
    setStatus("signed-in");
  }, []);

  const logout = useCallback(async () => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setStatus("guest");
    if (token) {
      await api("/auth/logout", { method: "POST", token }).catch(() => undefined);
    }
  }, []);

  const requireLogin = useCallback(() => {
    if (status === "signed-in") return true;
    if (status === "guest") router.push("/masuk");
    return false;
  }, [router, status]);

  const value = useMemo<AuthValue>(
    () => ({ user, status, login, register, logout, refreshUser, requireLogin }),
    [user, status, login, register, logout, refreshUser, requireLogin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider.");
  }
  return context;
}
