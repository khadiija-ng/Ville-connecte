import React from "react";
import { validate } from "../api/auth.api";
import type { Utilisateur } from "../types/models";
import { getStoredUser, getToken, logout, setSession } from "./storage";

type AuthState = {
  user: Utilisateur | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setAuth: (token: string, user: Utilisateur) => void;
  signOut: () => void;
};

const AuthCtx = React.createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<Utilisateur | null>(getStoredUser());
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const u = await validate();
      // keep existing token
      setSession(token, u);
      setUser(u);
    } catch {
      logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const setAuth = (token: string, u: Utilisateur) => {
    setSession(token, u);
    setUser(u);
    setLoading(false);
  };

  const signOut = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, refresh, setAuth, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
