import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { convertReservationEnum } from "../utility/Converter";
import "./Profile.css";

export default function Profile() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch("/api/reservation/list/1"); // TODO: use logged in user id

                if (!response.ok) {
                    throw new Error("Failed to fetch reservations");
                }

                const data = await response.json();
                setReservations(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    if (loading) return <p>Loading reservations...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h1>Current profile data</h1>;  
            <h2>My Reservations</h2>

            {reservations.length === 0 ? (
                <div className="card">
                    <p style={{ width: "100%" }}>No reservations found.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                    { reservations.map((res: any) => (
                        <div className="card" key={res.id} onClick={() => navigate("/bookinfo", { state: { reservation: res } })}>
                            <p><strong>Id:</strong> {res.id}</p>
                            <p><strong>Room:</strong> {res.room_id}</p>
                            <p><strong>Date:</strong> {res.check_in_date} - {res.check_out_date}</p>
                            <p><strong>People:</strong> {res.people}</p>
                            <p><strong>Status:</strong> {convertReservationEnum(res.status)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
