import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthProvider";
import { landingPath } from "./auth/routeByRole";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CitoyenDashboard from "./pages/citoyen/CitoyenDashboard";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-600">Chargement…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={landingPath(user.role, user.fonction)} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/citoyen"
          element={
            <ProtectedRoute>
              <CitoyenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent"
          element={
            <ProtectedRoute>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
