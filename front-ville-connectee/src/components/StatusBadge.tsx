import type { Status } from "../types/enums";
import { statusLabel } from "../types/enums";

export function StatusBadge({ status }: { status: Status }) {
  const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
  const cls =
    status === "EN_ATTENTE" ? "bg-indigo-50 text-indigo-700" :
    status === "EN_COURS" ? "bg-orange-50 text-orange-700" :
    status === "TRAITE" ? "bg-emerald-50 text-emerald-700" :
    status === "FAUSSE_ALERTE" ? "bg-rose-50 text-rose-700" :
    "bg-sky-50 text-sky-700";

  return <span className={`${base} ${cls}`}>{statusLabel[status]}</span>;
}
