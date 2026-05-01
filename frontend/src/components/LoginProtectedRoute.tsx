import { Navigate, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { User } from "../types";

type LayoutOutletContext = {
  user: User | null;
};

function LoginProtectedRoute() {
  const { token } = useAuth();
  const location = useLocation();
  const outletContext = useOutletContext<LayoutOutletContext>();

  if (!token) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet context={outletContext} />;
}

export default LoginProtectedRoute;
