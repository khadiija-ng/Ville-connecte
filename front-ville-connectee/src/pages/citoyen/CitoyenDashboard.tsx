import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "../../layouts/DashboardShell";
import { Card } from "../../components/Card";
import { StatPill } from "../../components/StatPill";
import { Table } from "../../components/Table";
import { StatusBadge } from "../../components/StatusBadge";
import { MapLeaflet } from "../../components/MapLeaflet";
import { listTypeAlertes } from "../../api/typeAlerte.api";
import { createAlerteMultipart, listAlertes } from "../../api/alertes.api";
import { useAuth } from "../../auth/AuthProvider";
import type { Alerte, TypeAlerte } from "../../types/models";
import type { Status } from "../../types/enums";
import { downloadUrl } from "../../api/media.api";

function countByStatus(alertes: Alerte[], status: Status) {
  return alertes.filter(a => a.status === status).length;
}

export default function CitoyenDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: types = [] } = useQuery({
    queryKey: ["type-alertes"],
    queryFn: listTypeAlertes,
  });

  const { data: alertesAll = [] } = useQuery({
    queryKey: ["alertes"],
    queryFn: listAlertes,
  });

  const myAlertes = React.useMemo(() => {
    if (!user) return [];
    return alertesAll.filter(a => a.utilisateur?.id === user.id);
  }, [alertesAll, user]);

  // Dakar default center (can be changed)
  const [center] = React.useState<[number, number]>([14.7167, -17.4677]);
  const [picked, setPicked] = React.useState<[number, number] | null>(null);

  const [form, setForm] = React.useState({
    title: "", // UI only (backend stores message)
    message: "",
    localisation: "",
    typeAlerteId: "" as string,
    montant: 200,
    files: [] as File[],
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  async function onPublish() {
    setError(null);
    setSuccess(null);

    if (!picked) {
      setError("Veuillez sélectionner une position sur la carte.");
      return;
    }
    if (!form.typeAlerteId) {
      setError("Veuillez sélectionner un type d'alerte.");
      return;
    }
    if (!form.message.trim()) {
      setError("Veuillez décrire le problème.");
      return;
    }

    setSubmitting(true);
    try {
      await createAlerteMultipart({
        message: form.message.trim(),
        latitude: picked[0],
        longitude: picked[1],
        typeAlerteId: Number(form.typeAlerteId),
        files: form.files,
      });
      setSuccess("Signalement publié.");
      setForm(s => ({ ...s, title: "", message: "", localisation: "", files: [] }));
      setPicked(null);
      await qc.invalidateQueries({ queryKey: ["alertes"] });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Erreur lors de la publication.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell profileLabel="Profil: Citoyen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: new report */}
        <Card title="Nouveau signalement">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-600">Titre</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-600/20"
                placeholder="Ex: Lampadaire en panne"
                value={form.title}
                onChange={(e) => setForm(s => ({ ...s, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Description</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 min-h-[110px] outline-none focus:ring-2 focus:ring-brand-600/20"
                placeholder="Décrivez le problème..."
                value={form.message}
                onChange={(e) => setForm(s => ({ ...s, message: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600">Type d’alerte</label>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-brand-600/20"
                  value={form.typeAlerteId}
                  onChange={(e) => setForm(s => ({ ...s, typeAlerteId: e.target.value }))}
                >
                  <option value="">Choisir…</option>
                  {types.map((t: TypeAlerte) => (
                    <option key={t.id} value={t.id}>{t.typeAlerteName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-600">Localisation</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-600/20"
                  placeholder="Adresse ou quartier"
                  value={form.localisation}
                  onChange={(e) => setForm(s => ({ ...s, localisation: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-600">Photo</label>
              <div className="mt-1 flex items-center gap-3">
                <label className="inline-flex items-center px-4 py-2 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => setForm(s => ({ ...s, files: Array.from(e.target.files ?? []) }))}
                  />
                  Choisir un fichier
                </label>
                <div className="text-sm text-slate-500">
                  {form.files.length === 0 ? "Aucun fichier choisi" : `${form.files.length} fichier(s)`}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-600">Montant à payer (F CFA)</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-600/20"
                value={form.montant}
                onChange={(e) => setForm(s => ({ ...s, montant: Number(e.target.value) }))}
                type="number"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onPublish}
                disabled={submitting}
                className="bg-brand-600 hover:bg-brand-700 transition text-white rounded-xl px-5 py-3 font-semibold"
              >
                {submitting ? "Publication..." : "Payer et publier"}
              </button>
              <button className="bg-slate-200 hover:bg-slate-300 transition text-slate-700 rounded-xl px-5 py-3 font-semibold">
                Retour
              </button>
            </div>

            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
              Brouillon
            </div>

            {error && <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">{error}</div>}
            {success && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">{success}</div>}
          </div>
        </Card>

        {/* Right: map + stats */}
        <Card title="Carte">
          <div className="space-y-5">
            <MapLeaflet
              center={center}
              marker={picked}
              onPick={(lat, lng) => setPicked([lat, lng])}
              hint="Cliquez pour placer le marqueur du signalement."
            />

            <div className="grid grid-cols-3 gap-4">
              <StatPill value={countByStatus(myAlertes, "EN_ATTENTE")} label="En attente" />
              <StatPill value={countByStatus(myAlertes, "EN_COURS")} label="En cours" />
              <StatPill value={countByStatus(myAlertes, "TRAITE")} label="Résolus" />
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom: my reports */}
      <div className="mt-10">
        <Card title="Mes signalements">
          <Table>
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Titre</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Statut</th>
                <th className="text-left px-4 py-3 font-semibold">Média</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myAlertes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-slate-500">
                    Aucun signalement pour le moment.
                  </td>
                </tr>
              ) : (
                myAlertes.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-4 text-slate-900">{a.typeAlerte?.typeAlerteName ?? "—"}</td>
                    <td className="px-4 py-4 text-slate-600">{a.dateDesFaits ?? "—"}</td>
                    <td className="px-4 py-4"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-4 text-slate-600">
                      {(a.medias ?? []).length === 0 ? "—" : (
                        <div className="flex flex-wrap gap-2">
                          {(a.medias ?? []).slice(0, 3).map(m => (
                            <a
                              key={m.id}
                              className="text-brand-700 underline"
                              href={downloadUrl(m.fileName)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {m.fileName}
                            </a>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      </div>
    </DashboardShell>
  );
}
