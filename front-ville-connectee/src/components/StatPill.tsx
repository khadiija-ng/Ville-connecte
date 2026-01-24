export function StatPill({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white rounded-xl shadow-soft border border-slate-100 px-5 py-4 flex items-center gap-3">
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}
