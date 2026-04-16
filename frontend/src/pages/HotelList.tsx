import { useNavigate } from "react-router-dom";

export default function HotelList() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>TODO: Implement list of hotels</h2>
            <button onClick={() => navigate("/rooms")}>List Rooms</button>
        </div>
    );
}
