import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import type { User } from "../types";

export default function Home() {
    const { loginUser } = useAuth();
    const navigate = useNavigate();

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
        navigate("/");
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
