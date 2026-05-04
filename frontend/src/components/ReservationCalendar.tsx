import { useState } from "react";
import type { Reservation } from "../types";
import type { Room } from "../types";
import "./ReservationCalendar.css";

interface ReservationCalendarProps {
    reservations: Reservation[];
    currentMonth?: Date;
    onDatesSelected?: (checkIn: string, checkOut: string) => void;
    selectedCheckIn?: string;
    selectedCheckOut?: string;
    selectedRoom?: Room | null;
}

// Ellenőrzi, hogy egy adott nap foglalt-e
export function isDateBooked(date: Date, reservations: Reservation[]): boolean {
    const dateStr = date.toISOString().split("T")[0];
    return reservations.some((res) => {
        if (res.status === "StatusEnum.Cancelled") return false;
        return dateStr >= res.check_in_date && dateStr <= res.check_out_date;
    });
};

export default function ReservationCalendar({
    reservations,
    currentMonth = new Date(),
    onDatesSelected,
    selectedCheckIn,
    selectedCheckOut,
    selectedRoom
}: ReservationCalendarProps) {
    const [selectionMode, setSelectionMode] = useState<"check-in" | "check-out">("check-in");
    const [tempCheckIn, setTempCheckIn] = useState<string | null>(selectedCheckIn || null);
    const [tempCheckOut, setTempCheckOut] = useState<string | null>(selectedCheckOut || null);
    const [displayedMonth, setDisplayedMonth] = useState<Date>(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    );

    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();

    const handlePreviousMonth = () => {
        setDisplayedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setDisplayedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    // Az első nap a hónapban
    const firstDay = new Date(year, month, 1);
    // Az utolsó nap a hónapban
    const lastDay = new Date(year, month + 1, 0);
    // Hányadik nappal kezdődik a hét (0 = vasárnap, 1 = hétfő, stb.)
    const startingDayOfWeek = firstDay.getDay();
    // A hónapban lévő napok száma
    const daysInMonth = lastDay.getDate();

    // Ellenőrzi, hogy egy nap a kiválasztott tartományban van-e
    const isInSelectedRange = (day: number): boolean => {
        if (!tempCheckIn || !tempCheckOut) return false;
        const dateStr = new Date(year, month, day).toISOString().split("T")[0];
        return dateStr >= tempCheckIn && dateStr < tempCheckOut;
    };

    const handleDayClick = (day: number) => {
        const dateStr = new Date(year, month, day).toISOString().split("T")[0];
        const today = new Date().toISOString().split("T")[0];

        // Nem lehet múltbeli napot választani
        if (dateStr < today) return;

        // Nem lehet foglalt napot választani
        if (isDateBooked(new Date(year, month, day), reservations)) return;

        if (selectionMode === "check-in") {
            setTempCheckIn(dateStr);
            setTempCheckOut(null);
            setSelectionMode("check-out");
        } else {
            if (dateStr <= tempCheckIn!) return; // A checkout nem lehet a checkin-nél korábbi
            setTempCheckOut(dateStr);
            if (onDatesSelected) {
                onDatesSelected(tempCheckIn!, dateStr);
            }
            setSelectionMode("check-in");
        }
    };

    const getCalendarDayClassName = ({
        isPast,
        isBooked,
        isToday,
        isCheckIn,
        isCheckOut,
        isInRange,
        isClickable
    }: {
        isPast: boolean;
        isBooked: boolean;
        isToday: boolean;
        isCheckIn: boolean;
        isCheckOut: boolean;
        isInRange: boolean;
        isClickable: boolean;
    }) => {
        const classNames = ["reservation-calendar__day"];

        if (isPast) classNames.push("reservation-calendar__day--past");
        if (isBooked) classNames.push("reservation-calendar__day--booked");
        if (isToday) classNames.push("reservation-calendar__day--today");
        if (isCheckIn || isCheckOut) classNames.push("reservation-calendar__day--selected");
        if (isInRange) classNames.push("reservation-calendar__day--in-range");
        if (isClickable) classNames.push("reservation-calendar__day--clickable");
        if (!isClickable) classNames.push("reservation-calendar__day--disabled");

        return classNames.join(" ");
    };

    // Naptár cellák generálása
    const calendarDays = [];

    // Üres cellák az előző hónapból
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }

    // A hónap napjai
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const weekDays = ["Vas", "Hét", "Kedd", "Sze", "Csü", "Pén", "Szo"];
    const monthName = new Date(year, month).toLocaleDateString("hu-HU", { month: "long", year: "numeric" });
    const today = new Date().toISOString().split("T")[0];
    const roomPrice = selectedRoom?.price;
    const roomCapacity = 1; // selectedRoom?.capacity

    return (
        <div className="reservation-calendar">
            {selectedRoom && (
                <div className="reservation-calendar__room-card">
                    <div className="reservation-calendar__room-content">
                        <div className="reservation-calendar__room-header">
                            <div>
                                <div className="reservation-calendar__room-label">
                                    Kiválasztott szoba
                                </div>
                                <h3 className="reservation-calendar__room-title">
                                    {selectedRoom.room_number || `Szoba #${selectedRoom.room_number ?? selectedRoom.id ?? ""}`}
                                </h3>
                            </div>

                            {roomPrice !== undefined && (
                                <div className="reservation-calendar__room-price">
                                    {roomPrice.toLocaleString("hu-HU")} Ft / éj
                                </div>
                            )}
                        </div>

                        <div className="reservation-calendar__room-info-list">
                            {selectedRoom.room_number !== undefined && (
                                <span className="reservation-calendar__info-pill">Szobaszám: {selectedRoom.room_number}</span>
                            )}
                            {selectedRoom.room_type && (
                                <span className="reservation-calendar__info-pill">Típus: {selectedRoom.room_type}</span>
                            )}
                            {roomCapacity !== undefined && (
                                <span className="reservation-calendar__info-pill">Férőhely: {roomCapacity} fő</span>
                            )}
                        </div>

                        {selectedRoom.room_type && (
                            <p className="reservation-calendar__room-description">
                                {selectedRoom.room_type === "single" && "Ez egy kényelmes egyágyas szoba, ideális egyéni utazóknak."}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="reservation-calendar__month-navigation">
                <button
                    type="button"
                    onClick={handlePreviousMonth}
                    className="reservation-calendar__month-button"
                >
                    ◄ Előző
                </button>

                <h3 className="reservation-calendar__month-title">{monthName}</h3>

                <button
                    type="button"
                    onClick={handleNextMonth}
                    className="reservation-calendar__month-button"
                >
                    Következő ►
                </button>
            </div>

            <div className="reservation-calendar__selection-info">
                <p className="reservation-calendar__selection-text">
                    {selectionMode === "check-in" ? (
                        <>Kattints az <strong>érkezési dátumra</strong></>
                    ) : (
                        <>Kattints a <strong>távozási dátumra</strong> {tempCheckIn && <>(min. {new Date(tempCheckIn + "T00:00").toLocaleDateString("hu-HU")} után)</>}</>
                    )}
                </p>
                {tempCheckIn && tempCheckOut && (
                    <p className="reservation-calendar__selected-dates">
                        Kiválasztva: {new Date(tempCheckIn + "T00:00").toLocaleDateString("hu-HU")} - {new Date(tempCheckOut + "T00:00").toLocaleDateString("hu-HU")}
                    </p>
                )}
            </div>

            <div className="reservation-calendar__grid">
                {/* Hét napjainak fejléce */}
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="reservation-calendar__weekday"
                    >
                        {day}
                    </div>
                ))}

                {/* Naptár cellái */}
                {calendarDays.map((day, index) => {
                    if (day === null) {
                        return (
                            <div key={`empty-${index}`} className="reservation-calendar__empty-day"></div>
                        );
                    }

                    const dateStr = new Date(year, month, day).toISOString().split("T")[0];
                    const isBooked = isDateBooked(new Date(year, month, day), reservations);
                    const isToday = dateStr === today;
                    const isPast = dateStr < today;
                    const isCheckIn = dateStr === tempCheckIn;
                    const isCheckOut = dateStr === tempCheckOut;
                    const isInRange = isInSelectedRange(day);
                    const isClickable = !isPast && !isBooked;

                    return (
                        <div
                            key={day}
                            onClick={() => handleDayClick(day)}
                            className={getCalendarDayClassName({
                                isPast,
                                isBooked,
                                isToday,
                                isCheckIn,
                                isCheckOut,
                                isInRange,
                                isClickable
                            })}
                            title={
                                isPast ? "Múltbeli nap" :
                                isBooked ? "Foglalt" :
                                isClickable ? (selectionMode === "check-in" ? "Érkezés" : "Távozás") :
                                ""
                            }
                        >
                            {day}
                            <div className="reservation-calendar__day-icon">
                                {isCheckIn}
                                {isCheckOut}
                                {!isCheckIn && !isCheckOut && isBooked}
                                {!isCheckIn && !isCheckOut && !isBooked && !isPast }
                                {isPast}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="reservation-calendar__legend">
                <p><span className="reservation-calendar__legend-item reservation-calendar__legend-item--available"></span> Szabad nap</p>
                <p><span className="reservation-calendar__legend-item reservation-calendar__legend-item--booked"></span> Foglalt nap</p>
                <p><span className="reservation-calendar__legend-item reservation-calendar__legend-item--selected"></span> Kiválasztott dátumok</p>
                <p><span className="reservation-calendar__legend-item reservation-calendar__legend-item--past"></span> Múltbeli nap</p>
            </div>
        </div>
    );
}
