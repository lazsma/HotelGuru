import { useNavigate } from "react-router-dom";

export default function RoomList() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>TODO: Implement list of rooms</h2>
            <button onClick={() => navigate("/book")}>Book a reservation</button>
        </div>
    );
}
