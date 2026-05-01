export function convertReservationEnum(reservation: string) {
    switch (reservation) {
        case "StatusEnum.New":
            return "New";
        case "StatusEnum.Approved":
            return "Approved";
        case "StatusEnum.Cancelled":
            return "Cancelled";
        default:
            return "INVALID_STATUS";
    }
}