import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import type { Room, User, Reservation } from "../types";
import ReservationCalendar, { isDateBooked } from "../components/ReservationCalendar";

import "./BookReservation.css";

function BookReservation() {
    const today = new Date().toISOString().split("T")[0];

    const getNextDay = (date: string) => {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    };

    const [formData, setFormData] = useState({
        user_id: 1,
        room_id: 1,
        check_in_date: today,
        check_out_date: getNextDay(today),
        people: 1
    });

    const [roomData, setRoomData] = useState<Room | null>(null);
    const [loadingRoom, setLoadingRoom] = useState<boolean>(false);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [bookingError, setBookingError] = useState<string>("");

    const roomCapacity = Number((roomData as { capacity?: number })?.capacity ?? 1)

    const navigate = useNavigate();
    const { roomId } = useParams<{ roomId: string }>();
    const { user } = useOutletContext<{ user: User }>();

    // Ellenőrzi, hogy egy dátumtartomány szabad-e
    const isDateRangeAvailable = (checkIn: string, checkOut: string): boolean => {
        const current = new Date(checkIn);
        const end = new Date(checkOut);

        while (current < end) {
            const dateStr = current.toISOString().split("T")[0];
            if (isDateBooked(new Date(dateStr), reservations)) {
                return false;
            }
            current.setDate(current.getDate() + 1);
        }
        return true;
    };

    useEffect(() => {
        if (user?.id) {
            setFormData((prev) => ({
                ...prev,
                user_id: user.id || 1
            }));
        }
    }, [user]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            people: Math.min(Math.max(Number(prev.people) || 1, 1), roomCapacity)
        }));
    }, [roomCapacity]);

    useEffect(() => {
        if (roomId) {
            setFormData((prev) => ({
                ...prev,
                room_id: parseInt(roomId)
            }));

            setLoadingRoom(true);
            
            // Lekérjük a szoba adatait
            fetch(`/api/room/${roomId}`)
                .then((response) => {
                    if (!response.ok) throw new Error('Hiba a szoba adatainak lekérdezésekor');
                    return response.json();
                })
                .then((data: Room) => {
                    setRoomData(data);
                    console.log("Szoba adatok:", data);
                    setLoadingRoom(false);
                })
                .catch((err: Error) => {
                    console.error(err);
                    setLoadingRoom(false);
                });

            // Lekérjük a szoba foglalásait
            fetch(`/api/room/${roomId}/reservations`)
                .then((response) => {
                    if (!response.ok) throw new Error('Hiba a foglalások lekérdezésekor');
                    return response.json();
                })
                .then((data: Reservation[] | any) => {
                    // Ellenőrizzük, hogy az adat tömb-e
                    if (Array.isArray(data)) {
                        setReservations(data);
                    } else if (data && typeof data === 'object') {
                        // Ha az adat objektum, keressük meg a foglalásokat tartalmazó mező
                        const reservationsArray = data.reservations || data.data || [];
                        if (Array.isArray(reservationsArray)) {
                            setReservations(reservationsArray);
                        } else {
                            console.warn('A foglalások nem tömbben érkeztek:', data);
                            setReservations([]);
                        }
                    } else {
                        console.warn('Nem várt formátum a foglalások lekérdezésénél:', data);
                        setReservations([]);
                    }
                })
                .catch((err: Error) => {
                    console.error(err);
                    setReservations([]);
                });
        }
    }, [roomId]); 


    const handleCalendarDatesSelected = (checkIn: string, checkOut: string) => {
        setFormData((prev) => ({
            ...prev,
            check_in_date: checkIn,
            check_out_date: checkOut
        }));
        setBookingError("");
    };

    const setPeople = (people: number) => {
        setFormData((prev) => ({
            ...prev,
            people: Math.min(Math.max(people, 1), roomCapacity)
        }));
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (name === "people") {
            setPeople(Number(value) || 1);
        }
    };

    const handlePeopleChange = (change: number) => {
        setPeople((Number(formData.people) || 1) + change);
    };

    async function createReservation(event: any) {
        event.preventDefault();

        // Végső ellenőrzés a submit előtt
        if (!isDateRangeAvailable(formData.check_in_date, formData.check_out_date)) {
            setBookingError("A kiválasztott időszak nem teljesen elérhető. Válasszon másik dátumokat.");
            return;
        }

        if (formData.people < 1 || formData.people > roomCapacity) {
            setBookingError(`Az emberek száma 1 és ${roomCapacity} között lehet.`);
            return;
        }

        const jsonData = JSON.stringify({
            ...formData,
            people: Number(formData.people)
        });
        console.log(jsonData);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonData
        };

        return fetch('/api/reservation/create', requestOptions)
            .then(response => response.json())
            .catch(err => {
                console.error("Hiba a foglalás létrehozásakor:", err);
                setBookingError("Hiba történt a foglalás létrehozásakor. Kérjük, próbálja újra.");
                throw err;
            })
            .then(response => navigate("/bookinfo", { state: { reservation: response, room: roomData } }))
    }

    return (
        <>
            <section>
            <div>
                <h1>Új foglalás</h1>
            </div>
            
            {loadingRoom && <div>Szoba adatok betöltése...</div>}
            
            {bookingError && <div className="booking-error">{bookingError}</div>}
            
            {roomData && (
                <div className="room-details">
                    <p><strong>Szobaszám:</strong> {roomData.room_number}</p>
                    <p><strong>Típus:</strong> {roomData.room_type}</p>
                    <p><strong>Ár:</strong> {roomData.price} Ft / éj</p>
                    <p><strong>Kapacitás:</strong> {roomCapacity} fő</p>
                    <p><strong>Állapot:</strong> {roomData.is_available ? "Foglalható" : `Nem foglalható (${roomData.status || 'Karbantartás'})`}</p>
                </div>
            )}

            <ReservationCalendar 
                reservations={reservations}
                onDatesSelected={handleCalendarDatesSelected}
                selectedCheckIn={formData.check_in_date}
                selectedCheckOut={formData.check_out_date}
            />
            
            <form id="reservation-form" onSubmit={createReservation}>
                <div className="reservation-row people-selector-row">
                    {(roomCapacity > 1) && 
                        <div className="people-selector">
                            <button
                                type="button"
                                className="people-button"
                                onClick={() => handlePeopleChange(-1)}
                                disabled={formData.people <= 1}
                                aria-label="Vendégek számának csökkentése"
                            >
                                -
                            </button>

                            <input
                                id="people"
                                name="people"
                                type="number"
                                min="1"
                                max={roomCapacity}
                                value={formData.people}
                                onChange={handleChange}
                                className="people-input"
                            />

                            <button
                                type="button"
                                className="people-button"
                                onClick={() => handlePeopleChange(1)}
                                disabled={formData.people >= roomCapacity}
                                aria-label="Vendégek számának növelése"
                            >
                                +
                            </button>
                        </div>
                    }
                    <small className="people-limit">Maximum {roomCapacity} fő foglalható ebbe a szobába.</small>
                </div>

                <input className="submit-button" id="form-button" type="submit" value="Book" />  
            </form>
            </section>
        </>
    )
}

export default BookReservation
