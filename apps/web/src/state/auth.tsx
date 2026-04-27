import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { apiJson } from "../lib/api";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
};

type TokenResponse = { access_token: string; token_type: "bearer" };

type AuthApi = {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  requestOtp: (email: string) => Promise<{ devCode?: string | null }>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => void;
};

const STORAGE_KEY = "cake_web_token_v1";
const AuthContext = createContext<AuthApi | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (!token) {
          if (!cancelled) setUser(null);
          return;
        }
        const me = await apiJson<AuthUser>("/me", { method: "GET", token });
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) {
          setUser(null);
          setToken(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    setIsLoading(true);
    void load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const api = useMemo<AuthApi>(() => {
    async function saveToken(resp: TokenResponse) {
      setToken(resp.access_token);
      localStorage.setItem(STORAGE_KEY, resp.access_token);
      const me = await apiJson<AuthUser>("/me", { method: "GET", token: resp.access_token });
      setUser(me);
    }

    return {
      token,
      user,
      isLoading,
      login: async (email, password) => {
        const resp = await apiJson<TokenResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        await saveToken(resp);
      },
      signup: async (name, email, password) => {
        await apiJson<AuthUser>("/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
        const resp = await apiJson<TokenResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        await saveToken(resp);
      },
      loginWithGoogle: async (idToken) => {
        const resp = await apiJson<TokenResponse>("/auth/google", {
          method: "POST",
          body: JSON.stringify({ id_token: idToken }),
        });
        await saveToken(resp);
      },
      requestOtp: async (email) => {
        const resp = await apiJson<{ ok: boolean; dev_code?: string | null }>("/auth/otp/request", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
        return { devCode: resp.dev_code ?? null };
      },
      verifyOtp: async (email, code) => {
        const resp = await apiJson<TokenResponse>("/auth/otp/verify", {
          method: "POST",
          body: JSON.stringify({ email, code }),
        });
        await saveToken(resp);
      },
      logout: () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
      },
    };
  }, [token, user, isLoading]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
