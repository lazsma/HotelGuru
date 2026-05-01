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
    capacity: number;
}

export interface User {
    name: string;
    profileImage: string;
    id?: number;
}

export interface Reservation {
    id: number;
    check_in_date: string;
    check_out_date: string;
    status: string;
}
