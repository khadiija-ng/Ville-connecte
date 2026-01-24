export type Role = "ADMIN" | "ADMIN_MUNICIPAL" | "USER";
export type FonctionUser = "CITOYEN" | "CHEF" | "AGENT";

export type Status = "NOUVEAU" | "EN_COURS" | "EN_ATTENTE" | "FAUSSE_ALERTE" | "TRAITE";

export const statusLabel: Record<Status, string> = {
  NOUVEAU: "Nouveau",
  EN_COURS: "En cours",
  EN_ATTENTE: "En attente",
  FAUSSE_ALERTE: "Fausse alerte",
  TRAITE: "Résolu",
};
