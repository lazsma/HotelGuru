import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import type { User } from "../types";

type LoginLocationState = {
    from?: {
        pathname?: string;
        search?: string;
        hash?: string;
    };
};

export default function LoginPage() {
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { from } = (location.state ?? {}) as LoginLocationState;
    const redirectParam = searchParams.get("redirect");
    const stateRedirectPath = `${from?.pathname ?? "/"}${from?.search ?? ""}${from?.hash ?? ""}`;
    const redirectPath = redirectParam?.startsWith("/") && !redirectParam.startsWith("//")
        ? redirectParam
        : stateRedirectPath;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e: React.SubmitEvent) {
        e.preventDefault();

        if (!email || !password) {
            alert("Add meg az email címet és a jelszót.");
            return;
        }

        const response = await fetch("/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error("Sikertelen bejelentkezés:", response.status, errorData);
            alert("Sikertelen bejelentkezés");
            return;
        }

        const data = await response.json();
        const loggedInUser: User = {
            id: data.id,
            name: data.name ?? data.email ?? "Felhasználó",
            email: data.email
        };

        loginUser(data.token, loggedInUser);
        navigate(redirectPath, { replace: true });
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Bejelentkezés</button>
            </form>
        </div>
    );
}
