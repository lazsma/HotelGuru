import { useMemo } from "react";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LoginProtectedRoute from "./LoginProtectedRoute";
import { useUserRoles } from "../utility/UseUserRole";
import type { User } from "../types";

type LayoutOutletContext = {
  user: User | null;
};

type RoleOutletContext = LayoutOutletContext & {
  roles: string[];
};

type RoleProtectedRouteProps = {
  allowedRoles?: string[];
  fallbackPath?: string;
};

export default function RoleProtectedRoute({
  allowedRoles = [],
  fallbackPath = "/",
}: RoleProtectedRouteProps) {
  const { token } = useAuth();
  const outletContext = useOutletContext<LayoutOutletContext>();
  const { roles, loading } = useUserRoles();

  const isAllowed = useMemo(() => {
    if (allowedRoles.length === 0) {
      return true;
    }

    return allowedRoles.some((allowedRole) => roles.includes(allowedRole));
  }, [allowedRoles, roles]);

  if (!token) {
    return <LoginProtectedRoute />;
  }

  if (loading) {
    return <p>Loading permissions...</p>;
  }

  if (!isAllowed) {
    return <Navigate to={fallbackPath} replace />;
  }

  const roleOutletContext: RoleOutletContext = {
    ...outletContext,
    roles,
  };

  return <Outlet context={roleOutletContext} />;
}
