import type { Utilisateur } from "../types/models";

const TOKEN_KEY = "vc_token";
const USER_KEY = "vc_user";

export function setSession(token: string, user: Utilisateur) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): Utilisateur | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Utilisateur; } catch { return null; }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
