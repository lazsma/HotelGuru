from app.extensions import db
from app.models.reservation import Reservation
from app.blueprints.reservation.schemas import ReservationResponseSchema
from sqlalchemy import select

class ReceptionistService:
    
    @staticmethod
    def get_all_reservations():
        try:
            reservations = db.session.execute(select(Reservation)).scalars().all()
            data = ReservationResponseSchema(many=True).dump(reservations)
            return True, data
        except Exception as ex:
            return False, f"get_all_reservations() error! ({str(ex)})"

    @staticmethod
    def generate_invoice(reservation_id):
        try:
            # Itt betöltjük a foglalást a hozzá tartozó szobával együtt
            reservation = db.session.get(Reservation, reservation_id)
            if not reservation:
                return False, "Foglalás nem található"
            
            # Éjszakák kiszámolása (minimum 1)
            nights = 1
            if reservation.check_in_date and reservation.check_out_date:
                nights = (reservation.check_out_date - reservation.check_in_date).days
                if nights <= 0: nights = 1
            
            
            room_price = reservation.room.price
            room_cost = nights * room_price
            
            # TODO: Majd az extra szolgáltatások (szerviz) összegzését is ide vesszük
            extra_cost = 0 
            
            total_cost = room_cost + extra_cost
            
            invoice_data = {
                "reservation_id": reservation.id,
                "user_id": reservation.user_id,
                "room_id": reservation.room_id,
                "nights": nights,
                "room_cost": room_cost,
                "extra_cost": extra_cost,
                "total_cost": total_cost
            }
            
            from app.blueprints.receptionist.schemas import InvoiceResponseSchema
            return True, InvoiceResponseSchema().dump(invoice_data)
            
        except Exception as ex:
            return False, f"generate_invoice() error! ({str(ex)})"