import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function LoginProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default LoginProtectedRoute;
