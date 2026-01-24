import type { FonctionUser, Role, Status } from "./enums";

export interface Municipal {
  id: number;
  name: string;
  address: string;
}

export interface Utilisateur {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  lieuDeNaissance?: string;
  dateDeNaissance?: string;
  municipal?: Municipal | null;
  role: Role;
  fonction: FonctionUser;
}

export interface TypeAlerte {
  id: number;
  typeAlerteName: string;
  typeAlerteDescription: string;
}

export interface Media {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
}

export interface Alerte {
  id: number;
  message: string;
  dateDesFaits?: string;
  latitude: number;
  longitude: number;
  status: Status;
  typeAlerte: TypeAlerte;
  utilisateur: Utilisateur;
  agentAssigne?: Utilisateur | null;
  medias?: Media[];
}

export interface AuthResponse {
  token: string;
  utilisateur: Utilisateur;
}
