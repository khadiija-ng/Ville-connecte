import { http } from "./http";
import type { TypeAlerte } from "../types/models";

export async function listTypeAlertes(): Promise<TypeAlerte[]> {
  const { data } = await http.get<TypeAlerte[]>("/api/type-alerte");
  return data;
}

export async function createTypeAlerte(payload: { typeAlerteName: string; typeAlerteDescription: string }): Promise<TypeAlerte> {
  const { data } = await http.post<TypeAlerte>("/api/type-alerte", payload);
  return data;
}

export async function deleteTypeAlerte(id: number): Promise<void> {
  await http.delete(`/api/type-alerte/${id}`);
}
