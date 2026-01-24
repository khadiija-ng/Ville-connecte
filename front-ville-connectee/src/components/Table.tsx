export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        {children}
      </table>
    </div>
  );
}
