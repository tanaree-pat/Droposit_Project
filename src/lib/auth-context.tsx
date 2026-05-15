"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { authApi, type AuthUser } from "./api";

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Restore session from localStorage on first mount
  React.useEffect(() => {
    const stored = localStorage.getItem("drp_user");
    if (stored) setUser(JSON.parse(stored) as AuthUser);
    setLoading(false);
  }, []);

  // Global 401 handler — any expired token redirects to login
  React.useEffect(() => {
    const handler = () => {
      localStorage.removeItem("drp_token");
      localStorage.removeItem("drp_user");
      setUser(null);
      router.replace("/login");
    };
    window.addEventListener("drp:unauthorized", handler);
    return () => window.removeEventListener("drp:unauthorized", handler);
  }, [router]);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const res = await authApi.login({ email, password });
    localStorage.setItem("drp_token", res.access_token);
    localStorage.setItem("drp_user", JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("drp_token");
    localStorage.removeItem("drp_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/** Redirects to /login if not authenticated; to the correct role root if wrong role. */
export function useRequireAuth(role?: "depositor" | "staff") {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    if (role && user.role !== role) {
      router.replace(user.role === "staff" ? "/staff" : "/home");
    }
  }, [user, loading, router, role]);

  return { user, loading };
}
