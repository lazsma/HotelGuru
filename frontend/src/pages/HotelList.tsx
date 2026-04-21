import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Hotel {
  id: number;
  name: string;
  address_id: number;
}

export default function HotelList() {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        
        fetch('/api/hotel/')
            .then((response) => {
                if (!response.ok) throw new Error('Hiba a hotelek lekérdezésekor');
                return response.json();
            })
            .then((data: Hotel[]) => {
                setHotels(data);
                setLoading(false);
            })
            .catch((err: Error) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Hotelek betöltése...</div>;
    if (error) return <div style={{ color: 'red' }}>Hiba: {error}</div>;

    return (
        <div className="hotel-list-container">
            <h2>Elérhető Hotelek</h2>
            {hotels.length === 0 ? (
                <p>Jelenleg nincsenek elérhető hotelek az adatbázisban.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {hotels.map((hotel) => (
                        <li 
                            key={hotel.id} 
                            style={{ 
                                marginBottom: '15px', 
                                padding: '15px', 
                                border: '1px solid #ddd', 
                                borderRadius: '8px' 
                            }}
                        >
                            <h3>{hotel.name}</h3>
                            <p style={{ color: '#666' }}>Hotel azonosító: #{hotel.id}</p>
                            
                            <button 
                                onClick={() => navigate(`/hotel/${hotel.id}/rooms`)}
                                style={{
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                            >
                                Szobák megtekintése
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}