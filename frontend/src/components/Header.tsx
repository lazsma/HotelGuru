import { useNavigate } from "react-router-dom";

import "./Header.css";

type HeaderProps = {
  user: {
    name: string;
    profileImage: string;
    }
};

export type { HeaderProps };

export default function Header({ user }: HeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="header">
            <h1 className="header-title" onClick={() => navigate("/")}>Hotel Guru</h1>

            <div className="userSection"  style={{ display: "flex" }}>
                <p onClick={() => navigate("/profile")}>{user.name}</p>

                <img 
                    className="img"
                    src={user.profileImage}
                    alt="profile"
                    onClick={() => navigate("/profile")}
                />

                <button className="logout-button" onClick={() => navigate("/")}>
                    Logout
                </button>
            </div>
        </header>
    );
}
