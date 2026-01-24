import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "../../layouts/DashboardShell";
import { Card } from "../../components/Card";
import { Table } from "../../components/Table";
import { createTypeAlerte, deleteTypeAlerte, listTypeAlertes } from "../../api/typeAlerte.api";
import { createMunicipal, listMunicipaux } from "../../api/municipal.api";

export default function AdminDashboard() {
  const qc = useQueryClient();

  const { data: types = [] } = useQuery({ queryKey: ["type-alertes"], queryFn: listTypeAlertes });
  const { data: municipaux = [] } = useQuery({ queryKey: ["municipaux"], queryFn: listMunicipaux });

  const [typeForm, setTypeForm] = React.useState({ name: "", desc: "" });
  const [munForm, setMunForm] = React.useState({ name: "", address: "" });

  const createType = useMutation({
    mutationFn: () => createTypeAlerte({ typeAlerteName: typeForm.name, typeAlerteDescription: typeForm.desc }),
    onSuccess: async () => {
      setTypeForm({ name: "", desc: "" });
      await qc.invalidateQueries({ queryKey: ["type-alertes"] });
    },
  });

  const delType = useMutation({
    mutationFn: (id: number) => deleteTypeAlerte(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["type-alertes"] });
    },
  });

  const createMun = useMutation({
    mutationFn: () => createMunicipal({ name: munForm.name, address: munForm.address }),
    onSuccess: async () => {
      setMunForm({ name: "", address: "" });
      await qc.invalidateQueries({ queryKey: ["municipaux"] });
    },
  });

  return (
    <DashboardShell profileLabel="Profil: Administrateur">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Types d’alertes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-600/20"
              placeholder="Nom"
              value={typeForm.name}
              onChange={(e) => setTypeForm(s => ({ ...s, name: e.target.value }))}
            />
            <input
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-600/20"
              placeholder="Description"
              value={typeForm.desc}
              onChange={(e) => setTypeForm(s => ({ ...s, desc: e.target.value }))}
            />
          </div>
          <button
            onClick={() => createType.mutate()}
            className="bg-brand-600 hover:bg-brand-700 transition text-white rounded-xl px-5 py-3 font-semibold"
            disabled={createType.isPending || !typeForm.name.trim()}
          >
            Ajouter
          </button>

          <div className="mt-6">
            <Table>
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Nom</th>
                  <th className="text-left px-4 py-3 font-semibold">Description</th>
                  <th className="text-left px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {types.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-slate-500">Aucun type.</td>
                  </tr>
                ) : (
                  types.map(t => (
                    <tr key={t.id}>
                      <td className="px-4 py-4 text-slate-900">{t.typeAlerteName}</td>
                      <td className="px-4 py-4 text-slate-600">{t.typeAlerteDescription}</td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => delType.mutate(t.id)}
                          className="bg-rose-50 text-rose-700 hover:bg-rose-100 transition rounded-xl px-4 py-2 font-semibold text-xs"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card>

        <Card title="Municipalités">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-600/20"
              placeholder="Nom"
              value={munForm.name}
              onChange={(e) => setMunForm(s => ({ ...s, name: e.target.value }))}
            />
            <input
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-600/20"
              placeholder="Adresse"
              value={munForm.address}
              onChange={(e) => setMunForm(s => ({ ...s, address: e.target.value }))}
            />
          </div>
          <button
            onClick={() => createMun.mutate()}
            className="bg-brand-600 hover:bg-brand-700 transition text-white rounded-xl px-5 py-3 font-semibold"
            disabled={createMun.isPending || !munForm.name.trim()}
          >
            Ajouter
          </button>

          <div className="mt-6">
            <Table>
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Nom</th>
                  <th className="text-left px-4 py-3 font-semibold">Adresse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {municipaux.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-slate-500">Aucune municipalité.</td>
                  </tr>
                ) : (
                  municipaux.map(m => (
                    <tr key={m.id}>
                      <td className="px-4 py-4 text-slate-900">{m.name}</td>
                      <td className="px-4 py-4 text-slate-600">{m.address}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
