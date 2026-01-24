import type { Role, FonctionUser } from "../types/enums";

export function landingPath(role: Role, fonction: FonctionUser): string {
  if (role === "ADMIN") return "/admin";
  if (role === "ADMIN_MUNICIPAL") return "/agent";
  // USER
  if (fonction === "CITOYEN") return "/citoyen";
  // fallback
  return "/citoyen";
}
