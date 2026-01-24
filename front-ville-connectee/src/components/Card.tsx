export function Card({ title, children, className="" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={"bg-white rounded-2xl shadow-soft border border-slate-100 " + className}>
      {title && (
        <div className="px-6 pt-6">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
