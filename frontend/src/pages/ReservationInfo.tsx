import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { convertReservationEnum } from "../utility/Converter";
import "./ReservationInfo.css";

export default function ReservationInfo() {
    const location = useLocation();
    const [reservation, setReservation] = useState<any | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        const passedReservation = location.state?.reservation;
        if (passedReservation) {
            setReservation(passedReservation);
            setLoading(false);
        } else {
            setError("No reservation data provided");
        }
    }, [location.state]);

    const handleCancel = async (id: number) => {
        const confirmCancel = window.confirm(
        "Are you sure you want to cancel this reservation?"
        );
        if (!confirmCancel) return;

        try {
            const response = await fetch(`/api/reservation/status/set/cancelled/${id}`, {
                method: "POST"
            });

            if (!response.ok) {
                throw new Error("Failed to delete reservation");
            }

            navigate("/profile");
        } catch (err: any) {
            console.log(err);
        }
    };

    if (error || loading) 
        return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Reservation - {reservation.id}</h2>

            <div style={{ display: "grid", gap: "10px" }}>
                <div className="detailed-card">
                    <div>
                        <strong>User:</strong>
                        <p> {reservation.user_id}</p>
                    </div>
                    <div>
                        <strong>Room:</strong>
                        <p> {reservation.room_id}</p>
                    </div>
                    <div>
                        <strong>Date:</strong>
                        <p> {reservation.check_in_date} - {reservation.check_out_date}</p>
                    </div>
                    <div>
                        <strong>People:</strong>
                        <p> {reservation.people}</p>
                    </div>
                    <div>
                        <strong>Reservation made:</strong>
                        <p> {reservation.reservation_datetime}</p>
                    </div>
                    <div>
                        <strong>Status:</strong>
                        <p> {convertReservationEnum(reservation.status)}</p>
                    </div>
                </div>
            </div>

            <div>
                <button className="reservation-button" onClick={() => navigate("/profile")}>Reservations</button>
                <button className="reservation-button" onClick={() => handleCancel(reservation.id)}>Cancel</button>
            </div>
        </div>
    );
}
