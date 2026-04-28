import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Home page</h2>
            <button onClick={() => navigate("/hotels")}>List Hotels</button>
        </div>
    );
}
