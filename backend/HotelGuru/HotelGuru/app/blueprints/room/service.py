from app.extensions import db
from app.blueprints.room.schemas import RoomResponseSchema,ServiceSchema
from app.blueprints.reservation.schemas import ReservationResponseSchema
from app.models.reservation import Reservation
from app.models.service import Service
from app.models.room import Room
from sqlalchemy import select

class RoomService:
    @staticmethod
    def create_room(request):
        try:
            # A request dictionary-t kicsomagoljuk a Room modellhez
            room = Room(**request)
            db.session.add(room)
            db.session.commit()
        except Exception as ex:
            return False, f"create_room() error! ({str(ex)})"
        return True, RoomResponseSchema().dump(room)

    @staticmethod
    def get_room(room_id):
        try:
            room = db.session.get(Room, room_id)
            if not room:
                return False, "Room not found"
            return True, RoomResponseSchema().dump(room)
        except Exception as ex:
            return False, f"get_room() error! ({str(ex)})"

    @staticmethod
    def update_details(room_id, request_data):
        try:
            room = db.session.get(Room, room_id)
            if not room:
                return False, "Room not found"
            
            room.price = request_data.get('price', room.price)
            room.location = request_data.get('location', room.location)
            room.room_type = request_data.get('room_type', room.room_type)
            
            db.session.commit()
            return True, RoomResponseSchema().dump(room)
        except Exception as ex:
            return False, f"update_details() error! ({str(ex)})"

    @staticmethod
    def set_status(room_id, request_data):
        try:
            room = db.session.get(Room, room_id)
            if not room:
                return False, "Room not found"
            
            room.is_available = request_data.get('is_available', room.is_available)
            room.status = request_data.get('status', room.status)
            room.note = request_data.get('note', room.note)
            
            db.session.commit()
            return True, RoomResponseSchema().dump(room)
        except Exception as ex:
            return False, f"set_status() error! ({str(ex)})"
        
    @staticmethod
    def get_room_reservations(room_id):
        try:
            reservations = db.session.execute( select(Reservation).filter(Reservation.room_id == room_id)).scalars()
            if not reservations:
                return False, "No reservations found for this room"
            return True, ReservationResponseSchema().dump(reservations, many = True)
        except Exception as ex:
            return False, f"get_room_reservations() error! ({str(ex)})"

    @staticmethod
    def get_room_service(room_id):
        try:
            service = db.session.execute( select(Service).filter(Service.room_id == room_id)).scalars()
            if not service:
                return False, "No service found for this room"
            return True, ServiceSchema().dump(service, many = True)
        except Exception as ex:
            return False, f"get_room_service() error! ({str(ex)})"
