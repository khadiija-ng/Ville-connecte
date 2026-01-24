import { useAuth } from "../auth/AuthProvider";

export function AppHeader({ profileLabel }: { profileLabel: string }) {
  const { user, signOut } = useAuth();
  const initials = user ? `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase() : "U";
  return (
    <header className="w-full bg-brand-600 text-white">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="font-semibold tracking-wide">Ville Connectée</div>
        <div className="flex items-center gap-3">
          <div className="text-sm opacity-95">{profileLabel}</div>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
          <button
            onClick={signOut}
            className="text-sm bg-white/10 hover:bg-white/15 transition rounded-md px-3 py-1"
            title="Se déconnecter"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
