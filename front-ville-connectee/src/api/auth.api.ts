import { http,httpAuth } from "./http";
import type { AuthResponse, Utilisateur } from "../types/models";

export async function login(email: string, password: string): Promise<AuthResponse> {
  console.log("avantx");
  const { data } = await httpAuth.post<AuthResponse>("/api/utilisateur/login", { username:email, password });
  console.log("avantxx");
  return data;
}



export async function register(payload: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: string;
  fonction?: string;
  municipalId?: number | null;
  lieuDeNaissance?: string;
  dateDeNaissance?: string;
}): Promise<Utilisateur> {
  const { data } = await http.post<Utilisateur>("/api/utilisateur/register", payload);
  return data;
}

export async function validate(): Promise<Utilisateur> {
  const { data } = await http.get<Utilisateur>("/api/utilisateur/validate");
  return data;
}

export async function listUsers(): Promise<Utilisateur[]> {
  const { data } = await http.get<Utilisateur[]>("/api/utilisateur/all");
  return data;
}
