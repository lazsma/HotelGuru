import { useState } from "react";
import type { CSSProperties } from "react";
import type { Reservation } from "../types";
import type { Room } from "../types";

interface ReservationCalendarProps {
    reservations: Reservation[];
    currentMonth?: Date;
    onDatesSelected?: (checkIn: string, checkOut: string) => void;
    selectedCheckIn?: string;
    selectedCheckOut?: string;
    selectedRoom?: Room | null;
}

const infoPillStyle: CSSProperties = {
    padding: "7px 10px",
    borderRadius: "999px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    fontSize: "13px",
    fontWeight: 600
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

    // Ellenőrzi, hogy egy adott nap foglalt-e
    const isDateBooked = (day: number): boolean => {
        const dateStr = new Date(year, month, day).toISOString().split("T")[0];
        return reservations.some((res) => {
            if (res.status === "cancelled") return false;
            return dateStr >= res.check_in_date && dateStr < res.check_out_date;
        });
    };

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
        if (isDateBooked(day)) return;

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
    const roomPrice = selectedRoom?.price_per_night ?? selectedRoom?.price;
    const roomCapacity = selectedRoom?.capacity ?? selectedRoom?.people;

    return (
        <div style={{ marginBottom: "20px" }}>
            {selectedRoom && (
                <div style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "stretch",
                    padding: "16px",
                    marginBottom: "18px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)"
                }}>
                    {selectedRoom.image_url && (
                        <img
                            src={selectedRoom.image_url}
                            alt={selectedRoom.name || "Kiválasztott szoba"}
                            style={{
                                width: "130px",
                                minWidth: "130px",
                                objectFit: "cover",
                                borderRadius: "12px",
                                border: "1px solid #e5e7eb"
                            }}
                        />
                    )}

                    <div style={{ flex: 1 }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "12px",
                            alignItems: "flex-start",
                            marginBottom: "10px"
                        }}>
                            <div>
                                <div style={{
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    color: "#2563eb",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    marginBottom: "4px"
                                }}>
                                    Kiválasztott szoba
                                </div>
                                <h3 style={{ margin: 0, color: "#111827", fontSize: "20px" }}>
                                    {selectedRoom.name || `Szoba #${selectedRoom.room_number ?? selectedRoom.id ?? ""}`}
                                </h3>
                            </div>

                            {roomPrice !== undefined && (
                                <div style={{
                                    padding: "8px 12px",
                                    borderRadius: "999px",
                                    backgroundColor: "#ecfdf5",
                                    color: "#047857",
                                    fontWeight: 700,
                                    whiteSpace: "nowrap"
                                }}>
                                    {roomPrice.toLocaleString("hu-HU")} Ft / éj
                                </div>
                            )}
                        </div>

                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginBottom: selectedRoom.description ? "10px" : 0
                        }}>
                            {selectedRoom.room_number !== undefined && (
                                <span style={infoPillStyle}>Szobaszám: {selectedRoom.room_number}</span>
                            )}
                            {selectedRoom.type && (
                                <span style={infoPillStyle}>Típus: {selectedRoom.type}</span>
                            )}
                            {roomCapacity !== undefined && (
                                <span style={infoPillStyle}>Férőhely: {roomCapacity} fő</span>
                            )}
                        </div>

                        {selectedRoom.description && (
                            <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.5 }}>
                                {selectedRoom.description}
                            </p>
                        )}
                    </div>
                </div>
            )}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                marginBottom: "10px"
            }}>
                <button
                    type="button"
                    onClick={handlePreviousMonth}
                    style={{
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "999px",
                        backgroundColor: "#2563eb",
                        color: "white",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                        transition: "all 0.2s"
                    }}
                >
                    ◄ Előző
                </button>

                <h3 style={{ textAlign: "center", margin: 0 }}>{monthName}</h3>

                <button
                    type="button"
                    onClick={handleNextMonth}
                    style={{
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "999px",
                        backgroundColor: "#2563eb",
                        color: "white",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                        transition: "all 0.2s"
                    }}
                >
                    Következő ►
                </button>
            </div>
            
            <div style={{ 
                textAlign: "center", 
                marginBottom: "15px", 
                padding: "10px",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                fontSize: "14px"
            }}>
                <p>
                    {selectionMode === "check-in" ? (
                        <>Kattints az <strong>érkezési dátumra</strong></>
                    ) : (
                        <>Kattints a <strong>távozási dátumra</strong> {tempCheckIn && <>(min. {new Date(tempCheckIn + "T00:00").toLocaleDateString("hu-HU")} után)</>}</>
                    )}
                </p>
                {tempCheckIn && tempCheckOut && (
                    <p style={{ marginTop: "8px", color: "#4caf50", fontWeight: "bold" }}>
                        Kiválasztva: {new Date(tempCheckIn + "T00:00").toLocaleDateString("hu-HU")} - {new Date(tempCheckOut + "T00:00").toLocaleDateString("hu-HU")}
                    </p>
                )}
            </div>
            
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(7, 1fr)", 
                gap: "5px",
                marginBottom: "15px"
            }}>
                {/* Hét napjainak fejléce */}
                {weekDays.map((day) => (
                    <div 
                        key={day}
                        style={{ 
                            textAlign: "center", 
                            fontWeight: "bold",
                            padding: "8px",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "4px"
                        }}
                    >
                        {day}
                    </div>
                ))}
                
                {/* Naptár cellái */}
                {calendarDays.map((day, index) => {
                    if (day === null) {
                        return (
                            <div key={`empty-${index}`} style={{ padding: "8px" }}></div>
                        );
                    }

                    const dateStr = new Date(year, month, day).toISOString().split("T")[0];
                    const isBooked = isDateBooked(day);
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
                            style={{
                                padding: "10px",
                                textAlign: "center",
                                border: isCheckIn || isCheckOut ? "2px solid #2196F3" : isToday ? "2px solid #007bff" : "1px solid #ddd",
                                borderRadius: "4px",
                                backgroundColor: isPast ? "#f5f5f5" : isBooked ? "#ffcccc" : isCheckIn || isCheckOut ? "#2196F3" : isInRange ? "#bbdefb" : "#e8f5e9",
                                cursor: isClickable ? "pointer" : "not-allowed",
                                fontWeight: isCheckIn || isCheckOut || isToday ? "bold" : "normal",
                                color: isCheckIn || isCheckOut ? "white" : "inherit",
                                opacity: isPast || isBooked ? 0.7 : 1,
                                transition: "all 0.2s",
                                userSelect: "none"
                            }}
                            title={
                                isPast ? "Múltbeli nap" : 
                                isBooked ? "Foglalt" : 
                                isClickable ? (selectionMode === "check-in" ? "Érkezés" : "Távozás") : 
                                ""
                            }
                        >
                            {day}
                            <div style={{ fontSize: "10px", marginTop: "2px" }}>
                                {isCheckIn && "📍"}
                                {isCheckOut && "🏁"}
                                {!isCheckIn && !isCheckOut && isBooked && "❌"}
                                {!isCheckIn && !isCheckOut && !isBooked && !isPast && "✓"}
                                {isPast && "◄"}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ fontSize: "12px", marginTop: "10px" }}>
                <p><span style={{ color: "#e8f5e9", padding: "3px 8px", backgroundColor: "#4caf50", borderRadius: "3px" }}>✓</span> Szabad nap</p>
                <p><span style={{ color: "#ffcccc", padding: "3px 8px", backgroundColor: "#f44336", borderRadius: "3px" }}>❌</span> Foglalt nap</p>
                <p><span style={{ color: "white", padding: "3px 8px", backgroundColor: "#2196F3", borderRadius: "3px" }}>📍🏁</span> Kiválasztott dátumok</p>
                <p><span style={{ color: "#f5f5f5", padding: "3px 8px", backgroundColor: "#999", borderRadius: "3px" }}>◄</span> Múltbeli nap</p>
            </div>
        </div>
    );
}
