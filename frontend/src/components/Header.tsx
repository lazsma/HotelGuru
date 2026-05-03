import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

import "./Header.css";

const defaultProfileImage = "https://i.pravatar.cc/100";

export default function Header() {
    const navigate = useNavigate();
    const { logoutUser, user } = useAuth();

    function handleLogout() {
        logoutUser();
        navigate("/");
    }

    return (
        <header className="header">
            <h1 className="header-title" onClick={() => navigate("/")}>Hotel Guru</h1>

            <div className="userSection">
                <div className="header-actions">
                    <button
                        type="button"
                        className="header-button header-button-primary"
                        onClick={() => navigate("/reception")}
                        aria-label="Recepció megnyitása"
                    >
                        Recepció
                    </button>
                </div>

                <p className="header-user-name" onClick={() => navigate(user ? "/profile" : "/login")}>
                    {user?.name ?? "Bejelentkezés"}
                </p>

                <img
                    className="header-avatar"
                    src={user?.profileImage ?? defaultProfileImage}
                    alt="profile"
                    onClick={() => navigate(user ? "/profile" : "/login")}
                />

                {user && (
                    <button
                        type="button"
                        className="header-button header-button-secondary"
                        onClick={handleLogout}
                        aria-label="Kijelentkezés"
                    >
                        Kijelentkezés
                    </button>
                )}
            </div>
        </header>
    );
}
