import { AppHeader } from "../components/AppHeader";

export function DashboardShell({
  profileLabel,
  children,
}: {
  profileLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AppHeader profileLabel={profileLabel} />
      <main className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
