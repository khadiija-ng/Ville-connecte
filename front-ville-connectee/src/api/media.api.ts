import { API_BASE_URL } from "./config";

export function downloadUrl(fileName: string): string {
  return `${API_BASE_URL}/api/download/${encodeURIComponent(fileName)}`;
}
