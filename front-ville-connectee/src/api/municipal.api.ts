import { http } from "./http";
import type { Municipal } from "../types/models";

export async function listMunicipaux(): Promise<Municipal[]> {
  const { data } = await http.get<Municipal[]>("/api/municipal");
  return data;
}

export async function createMunicipal(payload: { name: string; address: string }): Promise<Municipal> {
  const { data } = await http.post<Municipal>("/api/municipal", payload);
  return data;
}
