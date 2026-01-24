export function MapMockBox({ label }: { label: string }) {
  return (
    <div className="w-full rounded-2xl border border-dashed border-blue-300 bg-blue-50/60 h-56 flex items-center justify-center">
      <div className="text-blue-700 font-semibold">{label}</div>
    </div>
  );
}
