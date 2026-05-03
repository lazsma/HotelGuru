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
    profileImage?: string;
    email: string;
    id: number;
    hotel_id?: number | null;
    phone?: string;
    szemely_igazolvany_szam?: number;
    roles?: Array<{
        id: number;
        name: string;
    }>;
    address?: {
        city?: string;
        street?: string;
        postalcode?: number;
    };
}

export interface Reservation {
    id: number;
    room_id: number;
    check_in_date: string;
    check_out_date: string;
    people: number;
    status: string;
    reservation_datetime: string;
}
