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

            <div className="userSection" style={{ display: "flex" }}>
                <button className="reception-button" onClick={() => navigate("/reception")}>Recepció</button>
                <p onClick={() => navigate(user ? "/profile" : "/login")}>{user?.name ?? "Bejelentkezés"}</p>

                <img
                    className="img"
                    src={user?.profileImage ?? defaultProfileImage}
                    alt="profile"
                    onClick={() => navigate(user ? "/profile" : "/login")}
                />

                {user && (
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
}
