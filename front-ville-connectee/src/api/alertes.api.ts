import { http } from "./http";
import type { Alerte } from "../types/models";

export async function listAlertes(): Promise<Alerte[]> {
  const { data } = await http.get<Alerte[]>("/api/alertes");
  return data;
}

/**
 * Création alerte avec média (multipart).
 *
 * ⚠️ IMPORTANT : si ton backend attend d'autres noms de champs (ex: 'file' au lieu de 'files'),
 * modifie ici uniquement (sans toucher l'UI).
 */
export async function createAlerteMultipart(payload: {
  message: string;
  latitude: number;
  longitude: number;
  typeAlerteId: number;
  dateDesFaits?: string;
  files?: File[];
}): Promise<Alerte> {
  const form = new FormData();
  form.append("message", payload.message);
  form.append("latitude", String(payload.latitude));
  form.append("longitude", String(payload.longitude));
  form.append("typeAlerteId", String(payload.typeAlerteId));
  if (payload.dateDesFaits) form.append("dateDesFaits", payload.dateDesFaits);
  (payload.files ?? []).forEach((f) => form.append("files", f)); // <-- change to 'file' if needed

  const { data } = await http.post<Alerte>("/api/alertes", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function assignAlerte(alerteId: number, agentId: number): Promise<Alerte> {
  const { data } = await http.put<Alerte>(`/api/alertes/${alerteId}/assign/${agentId}`);
  return data;
}
