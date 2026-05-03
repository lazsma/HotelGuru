import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";

type RoleResponse = Array<{ name?: unknown }> | { roles?: Array<{ name?: unknown }> };

function normalizeRoles(data: RoleResponse): string[] {
  const rawRoles = Array.isArray(data) ? data : data.roles;

  if (!Array.isArray(rawRoles)) {
    return [];
  }

  return rawRoles
    .map((role) => role.name)
    .filter((role): role is string => typeof role === "string");
}

export function useUserRoles() {
  const { token } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setRoles([]);
      setLoading(false);
      return;
    }

    async function fetchRoles() {
      setLoading(true);

      try {
        const response = await fetch("/api/user/myroles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setRoles([]);
          return;
        }

        const data: RoleResponse = await response.json();
        setRoles(normalizeRoles(data));
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, [token]);

  return { roles, loading };
}
