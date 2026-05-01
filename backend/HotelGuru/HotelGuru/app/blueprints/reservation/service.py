
from datetime import date
from app.extensions import db
from app.blueprints.reservation.schemas import ReservationResponseSchema
from app.models.reservation import Reservation, StatusEnum

from sqlalchemy import select, and_

class ReservationService:
    @staticmethod
    def get_reservation(reservation_id):
        reservation = db.session.execute( select(Reservation).filter(Reservation.id == reservation_id)).first()
        return True, ReservationResponseSchema().dump(reservation)

    @staticmethod
    def list_all(userid):
        reservations = db.session.execute( select(Reservation).filter(Reservation.user_id == userid)).scalars()
        return True, ReservationResponseSchema().dump(reservations, many = True)

    @staticmethod
    def create_reservation(request):
        try:
            reservation = Reservation(**request)
            reservation.status = StatusEnum.New
            db.session.add(reservation)
            db.session.commit()
        except Exception as ex:
            return False, f"create_reservation() error! ({str(ex)})"
        return True, ReservationResponseSchema().dump(reservation)
    
    @staticmethod
    def set_reservation_status(reservation_id, status):
        try:
            reservation = db.session.get(Reservation, reservation_id)
            if reservation:
                reservation.status = status
                db.session.commit()
        except Exception as ex:
            return False, f"set_reservation_status() error! ({str(ex)})"
        return True, "OK"