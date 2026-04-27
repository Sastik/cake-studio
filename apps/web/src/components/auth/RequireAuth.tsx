import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../state/auth";
import LoadingScreen from "../LoadingScreen";

export function RequireAuthLayout() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) return <LoadingScreen />;

  if (!auth.user) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <Outlet />;
}

export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) return <LoadingScreen />;

  if (auth.user) {
    const sp = new URLSearchParams(location.search);
    const next = sp.get("next") ?? "/";
    return <Navigate to={next} replace />;
  }

  return children;
}
