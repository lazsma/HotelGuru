import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import type { User } from "../types";
import "./LoginPage.css";

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
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Add meg az email címet és a jelszót.");
            return;
        }

        setIsSubmitting(true);

        try {
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
                setError("Sikertelen bejelentkezés. Ellenőrizd az adatokat.");
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
        } catch (err) {
            console.error("Bejelentkezési hiba:", err);
            setError("Nem sikerült kapcsolódni a szerverhez.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="login-page">
            <form className="login-form" onSubmit={handleLogin}>
                <div className="login-heading">
                    <h2>Bejelentkezés</h2>
                    <p>Jelentkezz be a foglalásaid és a profilod kezeléséhez.</p>
                </div>

                {error && <p className="login-error">{error}</p>}

                <label className="login-field">
                    <span>Email</span>
                    <input
                        name="user"
                        type="email"
                        placeholder="pelda@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label className="login-field">
                    <span>Jelszó</span>
                    <input
                        name="password"
                        type="password"
                        placeholder="Jelszó"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                <button className="login-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Bejelentkezés..." : "Bejelentkezés"}
                </button>
            </form>
        </section>
    );
}
