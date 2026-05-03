/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { User } from "../types";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  loginUser: (newToken: string, user: User) => void;
  logoutUser: () => void;
};

const storedUser = localStorage.getItem("user");

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(storedUser ? JSON.parse(storedUser) : null);

  function loginUser(newToken: string, user: User) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(newToken);
    setUser(user);
  }

  function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
