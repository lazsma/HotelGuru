import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

import type { Reservation, Room, User } from "../types";
import { convertReservationEnum } from "../utility/Converter";
import { useAuth } from "../components/AuthContext";
import "./Profile.css";

type ProfileForm = {
    name: string;
    email: string;
    phone: string;
    szemely_igazolvany_szam: string;
    city: string;
    street: string;
    postalcode: string;
};

function createProfileForm(user: User | null): ProfileForm {
    return {
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        szemely_igazolvany_szam: user?.szemely_igazolvany_szam?.toString() ?? "",
        city: user?.address?.city ?? "",
        street: user?.address?.street ?? "",
        postalcode: user?.address?.postalcode?.toString() ?? "",
    };
}

export default function Profile() {
    const { token, user, updateUser } = useAuth();
    const [form, setForm] = useState<ProfileForm>(() => createProfileForm(user));
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [rooms, setRooms] = useState<Map<number, Room>>(new Map());
    const [profileLoading, setProfileLoading] = useState(false);
    const [reservationsLoading, setReservationsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const profileFields = useMemo(
        () => [
            { key: "name", label: "Név", type: "text", required: true },
            { key: "email", label: "Email", type: "email", required: true },
            { key: "phone", label: "Telefonszám", type: "tel", required: true },
            { key: "szemely_igazolvany_szam", label: "Személyi igazolvány szám", type: "number", required: true },
            { key: "city", label: "Város", type: "text", required: true },
            { key: "postalcode", label: "Irányítószám", type: "number", required: true },
            { key: "street", label: "Utca, házszám", type: "text", required: true },
        ] satisfies Array<{
            key: keyof ProfileForm;
            label: string;
            type: string;
            required: boolean;
        }>,
        []
    );

    const profileDetails = useMemo(() => {
        const roleNames = user?.roles?.map((role) => role.name) ?? [];
        const canShowHotelId = roleNames.includes("Receptionist") || roleNames.includes("Administrator");
        const details = [
            { label: "Felhasználó azonosító", value: user?.id?.toString() ?? "-" },
            { label: "Jogosultságok", value: roleNames.join(", ") || "-" },
        ];

        if (canShowHotelId) {
            details.push({ label: "Hotel azonosító", value: user?.hotel_id?.toString() ?? "-" });
        }

        return details;
    }, [user?.hotel_id, user?.id, user?.roles]);

    useEffect(() => {
        setForm(createProfileForm(user));
    }, [user]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                return;
            }

            setProfileLoading(true);

            try {
                const response = await fetch("/api/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Nem sikerült lekérni a profil adatokat.");
                }

                const data: User = await response.json();
                updateUser({
                    ...user,
                    ...data,
                    profileImage: user?.profileImage,
                });
            } catch (err) {
                console.error("Profil adatok lekérdezési hiba:", err);
            } finally {
                setProfileLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    useEffect(() => {
        const fetchReservations = async () => {
            if (!user?.id) {
                setReservationsLoading(false);
                return;
            }

            setReservationsLoading(true);
            setError("");

            try {
                const response = await fetch(`/api/reservation/list/${user.id}`);

                if (!response.ok) {
                    throw new Error("Nem sikerült lekérni a foglalásokat.");
                }

                const data: Reservation[] = await response.json();
                setReservations(data);

                const roomIds = [...new Set(data.map((res) => res.room_id))];
                const roomEntries = await Promise.all(
                    roomIds.map(async (roomId) => {
                        try {
                            const roomResponse = await fetch(`/api/room/${roomId}`);
                            if (!roomResponse.ok) {
                                return null;
                            }

                            const roomData: Room = await roomResponse.json();
                            return [roomId, roomData] as const;
                        } catch (err) {
                            console.error(`Hiba a(z) ${roomId} szoba adatainak lekérdezésekor:`, err);
                            return null;
                        }
                    })
                );

                setRooms(new Map(roomEntries.filter((entry): entry is readonly [number, Room] => entry !== null)));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Nem sikerült lekérni a foglalásokat.");
            } finally {
                setReservationsLoading(false);
            }
        };

        fetchReservations();
    }, [user?.id]);

    function updateField(field: keyof ProfileForm, value: string) {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));
        setSuccess("");
    }

    function handleCancelEdit() {
        setForm(createProfileForm(user));
        setIsEditing(false);
        setError("");
        setSuccess("");
    }

    async function handleSave(event: React.FormEvent) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!user || !token) {
            setError("A profil szerkesztéséhez be kell jelentkezni.");
            return;
        }

        if (
            !form.name ||
            !form.email ||
            !form.phone ||
            !form.szemely_igazolvany_szam ||
            !form.city ||
            !form.street ||
            !form.postalcode
        ) {
            setError("Töltsd ki a kötelező mezőket.");
            return;
        }

        const updatedUser: User = {
            ...user,
            name: form.name,
            email: form.email,
            phone: form.phone,
            szemely_igazolvany_szam: Number(form.szemely_igazolvany_szam),
            address: {
                city: form.city,
                street: form.street,
                postalcode: Number(form.postalcode),
            },
        };

        setIsSaving(true);

        try {
            const response = await fetch("/api/user/update/szemelyes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    szemely_igazolvany_szam: updatedUser.szemely_igazolvany_szam,
                    address: updatedUser.address,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error("Sikertelen profil mentés:", response.status, errorData);
                setError("Sikertelen mentés. Ellenőrizd a megadott adatokat.");
                return;
            }

            updateUser(updatedUser);
            setIsEditing(false);
            setSuccess("A profil adatai frissültek.");
        } catch (err) {
            console.error("Profil mentési hiba:", err);
            setError("Nem sikerült kapcsolódni a szerverhez.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="profile-page">
            <section className="profile-panel">
                <div className="profile-heading">
                    <div>
                        <h1>Profil adatok</h1>
                        <p>A saját adataidat itt tudod áttekinteni és módosítani.</p>
                    </div>

                    {!isEditing && (
                        <button className="profile-secondary-button" type="button" onClick={() => setIsEditing(true)}>
                            Szerkesztés
                        </button>
                    )}
                </div>

                {error && <p className="profile-error">{error}</p>}
                {success && <p className="profile-success">{success}</p>}
                {profileLoading && <p className="profile-muted">Profil adatok betöltése...</p>}

                <div className="profile-detail-grid">
                    {profileDetails.map((detail) => (
                        <div className="profile-detail" key={detail.label}>
                            <span>{detail.label}</span>
                            <strong>{detail.value}</strong>
                        </div>
                    ))}
                </div>

                <form className="profile-form" onSubmit={handleSave}>
                    {profileFields.map((field) => (
                        <label className="profile-field" key={field.key}>
                            <span>{field.label}{field.required ? " *" : ""}</span>
                            <input
                                name={field.key}
                                type={field.type}
                                value={form[field.key]}
                                onChange={(event) => updateField(field.key, event.target.value)}
                                disabled={!isEditing || isSaving}
                                required={field.required}
                            />
                        </label>
                    ))}

                    {isEditing && (
                        <div className="profile-actions">
                            <button className="profile-submit-button" type="submit" disabled={isSaving}>
                                {isSaving ? "Mentés..." : "Mentés"}
                            </button>
                            <button
                                className="profile-secondary-button"
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                            >
                                Mégse
                            </button>
                        </div>
                    )}
                </form>
            </section>

            <section className="profile-panel">
                <h2>Foglalásaim</h2>

                {reservationsLoading ? (
                    <p className="profile-muted">Foglalások betöltése...</p>
                ) : reservations.length === 0 ? (
                    <div className="profile-reservation-card">
                        <p>Nincs foglalásod.</p>
                    </div>
                ) : (
                    <div className="profile-reservation-list">
                        {reservations.map((res) => {
                            const room = rooms.get(res.room_id);
                            return (
                                <button
                                    className="profile-reservation-card"
                                    key={res.id}
                                    type="button"
                                    onClick={() => navigate("/bookinfo", { state: { reservation: res, room } })}
                                >
                                    <span><strong>Azonosító:</strong> {res.id}</span>
                                    {room ? (
                                        <>
                                            <span><strong>Szoba:</strong> {room.room_number} ({room.room_type})</span>
                                            <span><strong>Ár:</strong> {room.price} Ft / éj</span>
                                        </>
                                    ) : (
                                        <span><strong>Szoba:</strong> {res.room_id}</span>
                                    )}
                                    <span><strong>Dátum:</strong> {res.check_in_date} - {res.check_out_date}</span>
                                    <span><strong>Vendégek:</strong> {res.people}</span>
                                    <span><strong>Állapot:</strong> {convertReservationEnum(res.status)}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
