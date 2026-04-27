import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface Room {
    id: number;
    is_available: boolean;
    status: string | null;
    note: string | null;
    location: string | null;
    room_number: string;
    price: number;
    room_type: string;
    hotel_id: number;
}

export default function RoomList() {
    const navigate = useNavigate();
    const { hotelId } = useParams<{ hotelId: string }>();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        
        const fetchUrl = hotelId ? `/api/hotel/${hotelId}/rooms` : '/api/room/';

        fetch(fetchUrl)
            .then((response) => {
                if (!response.ok) throw new Error('Hiba a szobák lekérdezésekor');
                return response.json();
            })
            .then((data: Room[]) => {
                setRooms(data);
                setLoading(false);
            })
            .catch((err: Error) => {
                setError(err.message);
                setLoading(false);
            });
    }, [hotelId]);

    if (loading) return <div>Szobák betöltése...</div>;
    if (error) return <div style={{ color: 'red' }}>Hiba: {error}</div>;

    return (
        <div className="room-list-container">
            <h2>Elérhető Szobák</h2>
            
            <button 
                onClick={() => navigate("/hotels")}
                style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
            >
                &larr; Vissza a hotelekhez
            </button>

            {rooms.length === 0 ? (
                <p>Jelenleg nincsenek szobák ehhez a hotelhez.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {rooms.map((room) => (
                        <li 
                            key={room.id} 
                            style={{ 
                                marginBottom: '15px', 
                                padding: '15px', 
                                border: '1px solid #ddd', 
                                borderRadius: '8px',
                                opacity: room.is_available ? 1 : 0.6
                            }}
                        >
                            <h3>Szobaszám: {room.room_number}</h3>
                            <p><strong>Típus:</strong> {room.room_type}</p>
                            <p><strong>Ár:</strong> {room.price} Ft / éj</p>
                            <p><strong>Állapot:</strong> {room.is_available ? "Foglalható" : `Nem foglalható (${room.status || 'Karbantartás'})`}</p>
                            
                            <button 
                                onClick={() => navigate(`/book/${room.id}`)}
                                disabled={!room.is_available}
                                style={{
                                    padding: '8px 16px',
                                    cursor: room.is_available ? 'pointer' : 'not-allowed',
                                    backgroundColor: room.is_available ? '#28a745' : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                            >
                                Lefoglalom
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}