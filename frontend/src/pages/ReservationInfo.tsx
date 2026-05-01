import { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import type { Room, User } from "../types";

import { convertReservationEnum } from "../utility/Converter";
import "./ReservationInfo.css";

export default function ReservationInfo() {
    const location = useLocation();
    const [reservation, setReservation] = useState<any | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useOutletContext<{ user: User }>();
    
    useEffect(() => {
        const passedReservation = location.state?.reservation;
        const passedRoom = location.state?.room;
        if (passedReservation) {
            setReservation(passedReservation);
            setRoom(passedRoom || null);
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
            <h2>Foglalás - {reservation.id}</h2>

            <div style={{ display: "grid", gap: "10px" }}>
                <div className="detailed-card">
                    <h3>Felhasználó adatai</h3>
                    <div>
                        <strong>Név:</strong>
                        <p>{user?.name}</p>
                    </div>
                </div>

                {room && (
                    <div className="detailed-card">
                        <h3>Szoba adatai</h3>
                        <div>
                            <strong>Szobaszám:</strong>
                            <p>{room.room_number}</p>
                        </div>
                        <div>
                            <strong>Típus:</strong>
                            <p>{room.room_type}</p>
                        </div>
                        <div>
                            <strong>Ár:</strong>
                            <p>{room.price} Ft / éj</p>
                        </div>
                        <div>
                            <strong>Állapot:</strong>
                            <p>{room.is_available ? "Foglalható" : `Nem foglalható (${room.status || 'Karbantartás'})`}</p>
                        </div>
                    </div>
                )}

                <div className="detailed-card">
                    <h3>Foglalás adatai</h3>
                    <div>
                        <strong>Date:</strong>
                        <p>{reservation.check_in_date} - {reservation.check_out_date}</p>
                    </div>
                    <div>
                        <strong>People:</strong>
                        <p>{reservation.people}</p>
                    </div>
                    <div>
                        <strong>Reservation made:</strong>
                        <p>{reservation.reservation_datetime}</p>
                    </div>
                    <div>
                        <strong>Status:</strong>
                        <p>{convertReservationEnum(reservation.status)}</p>
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
