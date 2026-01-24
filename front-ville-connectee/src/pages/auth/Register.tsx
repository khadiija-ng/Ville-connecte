import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth.api";
import { listMunicipaux } from "../../api/municipal.api";
import type { Municipal } from "../../types/models";

export default function Register() {
  const nav = useNavigate();
  const [municipaux, setMunicipaux] = React.useState<Municipal[]>([]);

  const [form, setForm] = React.useState({
  firstname: "",
  lastname: "",
  lieuDeNaissance: "",
  password: "",
  email: "",
  dateDeNaissance: "",
  municipalId: "",
});


  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    listMunicipaux().then(setMunicipaux).catch(() => setMunicipaux([]));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        password: form.password,
        lieuDeNaissance:form.lieuDeNaissance,
        dateDeNaissance:form.dateDeNaissance,
        // By default, citizen user
        role: "USER",
        fonction: "CITOYEN",
        municipalId: form.municipalId ? Number(form.municipalId) : null,
      });
      nav("/login", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Inscription impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-soft border border-slate-100 p-8">
        <div className="text-center">
          <div className="text-2xl font-semibold text-slate-900">Ville Connectée</div>
          <div className="text-slate-500 mt-1">Inscription (Citoyen)</div>
        </div>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Prénom</label>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-600/20"
                value={form.firstname} onChange={(e)=>setForm(s=>({...s, firstname:e.target.value}))} required />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Nom</label>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-600/20"
                value={form.lastname} onChange={(e)=>setForm(s=>({...s, lastname:e.target.value}))} required />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input type="email" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-600/20"
              value={form.email} onChange={(e)=>setForm(s=>({...s, email:e.target.value}))} required />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Mot de passe</label>
            <input type="password" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-600/20"
              value={form.password} onChange={(e)=>setForm(s=>({...s, password:e.target.value}))} required />
          </div>

         <div>
  <label className="block text-sm text-slate-600 mb-1">
    Lieu de naissance
  </label>
  <input
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none
               focus:ring-2 focus:ring-brand-600/20"
    value={form.lieuDeNaissance}
    onChange={(e) =>
      setForm(s => ({ ...s, lieuDeNaissance: e.target.value }))
    }
    placeholder="Ex: Dakar"
    required
  />
</div>

<div>
  <label className="block text-sm text-slate-600 mb-1">
    Date de naissance
  </label>
  <input
    type="date"
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none
               focus:ring-2 focus:ring-brand-600/20"
    value={form.dateDeNaissance}
    onChange={(e) =>
      setForm(s => ({ ...s, dateDeNaissance: e.target.value }))
    }
  />
</div>


          {error && <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">{error}</div>}

          <button disabled={loading} className="w-full bg-brand-600 hover:bg-brand-700 transition text-white rounded-xl py-3 font-semibold">
            {loading ? "Création..." : "Créer le compte"}
          </button>

          <div className="text-center text-sm text-slate-500">
            Déjà un compte ? <Link to="/login" className="text-brand-700 font-semibold">Se connecter</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
