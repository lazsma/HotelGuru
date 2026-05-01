import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import type { Room, User } from "../types";

import "./BookReservation.css";

function BookReservation() {
    const today = new Date().toISOString().split("T")[0];

    const getNextDay = (date: string) => {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    };

    const [formData, setFormData] = useState({
        user_id: 1, //TODO: logged in user id
        room_id: 1, // selected room id from URL params
        check_in_date: today,
        check_out_date: getNextDay(today),
        people: 1
    });

    const [roomData, setRoomData] = useState<Room | null>(null);
    const [loadingRoom, setLoadingRoom] = useState<boolean>(false);

    const navigate = useNavigate();
    const { roomId } = useParams<{ roomId: string }>();
    const { user } = useOutletContext<{ user: User }>();

    useEffect(() => {
        if (user?.id) {
            setFormData((prev) => ({
                ...prev,
                user_id: user.id || 1
            }));
        }
    }, [user]);

    useEffect(() => {
        if (roomId) {
            setFormData((prev) => ({
                ...prev,
                room_id: parseInt(roomId)
            }));

            setLoadingRoom(true);
            fetch(`/api/room/${roomId}`)
                .then((response) => {
                    if (!response.ok) throw new Error('Hiba a szoba adatainak lekérdezésekor');
                    return response.json();
                })
                .then((data: Room) => {
                    setRoomData(data);
                    setLoadingRoom(false);
                })
                .catch((err: Error) => {
                    console.error(err);
                    setLoadingRoom(false);
                });
        }
    }, [roomId]); 


    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            let updated = { ...prev, [name]: value };

            if (name === "check_in_date") {
            if (updated.check_out_date && updated.check_out_date <= value ) {
                updated.check_out_date = getNextDay(value);
            }
            }

            return updated;
        });
    };

    async function create_reservation(event: any) {
        event.preventDefault();

        const jsonData = JSON.stringify(formData);
        console.log(jsonData);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonData
        };

        return fetch('/api/reservation/create', requestOptions)
            .then(response => response.json())
            .then(response => navigate("/bookinfo", { state: { reservation: response, room: roomData } }))
            .then(response => console.log(response))
    }

    return (
        <>
            <section>
            <div>
                <h1>Book reservation</h1>
            </div>
            
            {loadingRoom && <div>Szoba adatok betöltése...</div>}
            
            {roomData && (
                <div className="room-details" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h3>Kiválasztott szoba</h3>
                    <p><strong>Szobaszám:</strong> {roomData.room_number}</p>
                    <p><strong>Típus:</strong> {roomData.room_type}</p>
                    <p><strong>Ár:</strong> {roomData.price} Ft / éj</p>
                    <p><strong>Állapot:</strong> {roomData.is_available ? "Foglalható" : `Nem foglalható (${roomData.status || 'Karbantartás'})`}</p>
                </div>
            )}
            
            <form id="reservation-form" onSubmit={create_reservation}>
                <div className="reservation-row">
                    <label htmlFor="check_in_date">Check In Date</label>
                    <input 
                        id="check_in_date" name="check_in_date" type="date" 
                        value={formData.check_in_date} min={today} onChange={handleChange}/>
                </div>
                
                <div className="reservation-row">
                    <label htmlFor="check_out_date">Check Out Date</label>
                    <input 
                        id="check_out_date" name="check_out_date" type="date" 
                        value={formData.check_out_date} min={getNextDay(formData.check_in_date)} onChange={handleChange}/>
                </div>

                <div className="reservation-row">
                    <label htmlFor="people">Number of people</label>
                    <input 
                        id="people" name="people" type="text" 
                        value={formData.people} onChange={handleChange}/>
                </div>

                <input className="submit-button" id="form-button" type="submit" value="Book" />  
            </form>
            </section>
        </>
    )
}

export default BookReservation
