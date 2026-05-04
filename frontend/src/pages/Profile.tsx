import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Reservation, Room } from "../types";
import { convertReservationEnum } from "../utility/Converter";
import { useAuth } from "../components/AuthContext";
import "./Profile.css";

export default function Profile() {
    const { user } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [rooms, setRooms] = useState<Map<number, Room>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch(`/api/reservation/list/${user?.id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch reservations");
                }

                const data: Reservation[] = await response.json();
                setReservations(data);
                
                // Lekérjük az összes szoba adatait
                const roomIds = [...new Set(data.map((res) => res.room_id))];
                const roomsMap = new Map<number, Room>();
                
                for (const roomId of roomIds) {
                    try {
                        const roomResponse = await fetch(`/api/room/${roomId}`);
                        if (roomResponse.ok) {
                            const roomData = await roomResponse.json();
                            roomsMap.set(roomId, roomData);
                        }
                    } catch (err) {
                        console.error(`Hiba a ${roomId} szoba adatainak lekérdezésekor:`, err);
                    }
                }
                
                setRooms(roomsMap);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch reservations");
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
                    { reservations.map((res) => {
                        const room = rooms.get(res.room_id);
                        return (
                            <div className="card" key={res.id} onClick={() => navigate("/bookinfo", { state: { reservation: res, room: room } })}>
                                <p><strong>Id:</strong> {res.id}</p>
                                {room ? (
                                    <>
                                        <p><strong>Szoba:</strong> {room.room_number} ({room.room_type})</p>
                                        <p><strong>Ár:</strong> {room.price} Ft / éj</p>
                                    </>
                                ) : (
                                    <p><strong>Room:</strong> {res.room_id}</p>
                                )}
                                <p><strong>Date:</strong> {res.check_in_date} - {res.check_out_date}</p>
                                <p><strong>People:</strong> {res.people}</p>
                                <p><strong>Status:</strong> {convertReservationEnum(res.status)}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
