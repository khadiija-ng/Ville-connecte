import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "../../layouts/DashboardShell";
import { Card } from "../../components/Card";
import { StatPill } from "../../components/StatPill";
import { Table } from "../../components/Table";
import { StatusBadge } from "../../components/StatusBadge";
import { listAlertes, assignAlerte } from "../../api/alertes.api";
import { listUsers } from "../../api/auth.api";
import type { Alerte, Utilisateur } from "../../types/models";
import type { Status } from "../../types/enums";
import { MapLeaflet } from "../../components/MapLeaflet";

function countByStatus(alertes: Alerte[], status: Status) {
  return alertes.filter(a => a.status === status).length;
}

export default function AgentDashboard() {
  const qc = useQueryClient();
  const { data: alertes = [] } = useQuery({ queryKey: ["alertes"], queryFn: listAlertes });
  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: listUsers });

  const agents = React.useMemo(() => users.filter(u => u.fonction === "AGENT" || u.fonction === "CHEF"), [users]);

  const [selectedAgentId, setSelectedAgentId] = React.useState<string>("");
  const [assigning, setAssigning] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // center Dakar
  const center: [number, number] = [14.7167, -17.4677];

  async function onAssign(alerteId: number) {
    setError(null);
    if (!selectedAgentId) {
      setError("Sélectionnez d'abord un agent à affecter.");
      return;
    }
    setAssigning(alerteId);
    try {
      await assignAlerte(alerteId, Number(selectedAgentId));
      await qc.invalidateQueries({ queryKey: ["alertes"] });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Impossible d'affecter l'alerte.");
    } finally {
      setAssigning(null);
    }
  }

  // For “File d'attente (validation)” in mock: we display EN_ATTENTE + NOUVEAU
  const aValider = alertes.filter(a => a.status === "EN_ATTENTE" || a.status === "NOUVEAU");

  return (
    <DashboardShell profileLabel="Profil: Agent municipal">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatPill value={countByStatus(alertes, "EN_ATTENTE")} label="À approuver" />
        <StatPill value={countByStatus(alertes, "EN_COURS")} label="En cours" />
        <StatPill value={countByStatus(alertes, "TRAITE")} label="Résolus" />
      </div>

      {error && (
        <div className="mb-6 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="File d'attente (validation)">
          <div className="mb-4 flex items-center gap-3">
            <select
              className="w-full max-w-xs rounded-xl border border-slate-200 px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-brand-600/20"
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
            >
              <option value="">Choisir un agent…</option>
              {agents.map((a: Utilisateur) => (
                <option key={a.id} value={a.id}>{a.firstname} {a.lastname}</option>
              ))}
            </select>
            <button
              className="bg-brand-600 hover:bg-brand-700 transition text-white rounded-xl px-5 py-3 font-semibold"
              onClick={() => { /* global assign via row button */ }}
              type="button"
            >
              Affecter
            </button>
          </div>

          <Table>
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Titre</th>
                <th className="text-left px-4 py-3 font-semibold">Citoyen</th>
                <th className="text-left px-4 py-3 font-semibold">Statut</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {aValider.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-slate-500">Aucune alerte en attente.</td>
                </tr>
              ) : (
                aValider.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-4 text-slate-900">{a.typeAlerte?.typeAlerteName ?? "Alerte"}</td>
                    <td className="px-4 py-4 text-slate-600">{a.utilisateur ? `${a.utilisateur.firstname} ${a.utilisateur.lastname}` : "—"}</td>
                    <td className="px-4 py-4"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onAssign(a.id)}
                          disabled={assigning === a.id}
                          className="bg-brand-600 hover:bg-brand-700 transition text-white rounded-xl px-4 py-2 font-semibold text-xs"
                        >
                          {assigning === a.id ? "..." : "Approuver"}
                        </button>
                        <button
                          type="button"
                          className="bg-slate-200 hover:bg-slate-300 transition text-slate-700 rounded-xl px-4 py-2 font-semibold text-xs"
                          title="Rejet (à connecter si endpoint existe)"
                        >
                          Rejeter
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>

        <Card title="Carte – interventions">
          <div className="space-y-4">
            <MapLeaflet
              center={center}
              marker={null}
              onPick={undefined}
              height={260}
              hint="Les marqueurs représentent les alertes reçues."
            />
            <div className="flex">
              <button
                className="bg-brand-600 hover:bg-brand-700 transition text-white rounded-xl px-5 py-3 font-semibold"
                type="button"
              >
                Affecter au service Voirie
              </button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
