import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <h2>Kezdőoldal</h2>
            <button className="hotel-list-button" onClick={() => navigate("/hotels")}>
                <span>Hotelek megtekintése</span>
            </button>
        </div>
    );
}
