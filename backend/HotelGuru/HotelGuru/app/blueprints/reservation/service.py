
from datetime import date
from app.extensions import db
from app.blueprints.reservation.schemas import ReservationResponseSchema
from app.models.reservation import Reservation


from sqlalchemy import select, and_

class ReservationService:
    @staticmethod
    def create_reservation(request):
        try:
            reservation = Reservation(**request)
            reservation.check_in_date = date.today()  # Példa: a bejelentkezés dátuma legyen a mai nap
            reservation.check_out_date = date.today()  # Példa: a kijelentkezés dátuma legyen a mai nap (vagy késõbbi)
            db.session.add(reservation)
            db.session.commit()
        except Exception as ex:
            return False, f"create_reservation() error! ({str(ex)})"
        return True, ReservationResponseSchema().dump(reservation)
