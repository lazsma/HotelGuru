from app.extensions import db
from app.models.hotel import Hotel
from app.models.room import Room
from app.models.reservation import Reservation # Szabad szobák ellenőrzéséhez kelleni fog
from app.blueprints.hotel.schemas import HotelResponseSchema
from app.blueprints.room.schemas import RoomResponseSchema
from sqlalchemy import select, and_, not_

class HotelService:
    @staticmethod
    def list_all_hotels():
        """Összes hotel listázása"""
        hotels = Hotel.query.all()
        return True, HotelResponseSchema().dump(hotels, many=True)

    @staticmethod
    def get_all_rooms(hotel_id):
        """Egy konkrét hotel összes szobájának listázása"""
        hotel = db.session.get(Hotel, hotel_id)
        if not hotel:
            return False, "Hotel nem található"
        return True, RoomResponseSchema().dump(hotel.rooms, many=True)

    @staticmethod
    def get_available_rooms(start_date, end_date, hotel_id=None):
        """
        Szabad szobák keresése. 
        Ha a hotel_id adott, csak ott keres, ha nincs, akkor az összes hotelben.
        """
        try:
            
            subquery = select(Reservation.room_id).where(
                and_(
                    Reservation.check_in_date < end_date,
                    Reservation.check_out_date > start_date
                )
            )

            
            query = select(Room).where(
                and_(
                    Room.is_available == True,
                    not_(Room.id.in_(subquery))
                )
            )

            
            if hotel_id:
                query = query.where(Room.hotel_id == hotel_id)

            available_rooms = db.session.scalars(query).all()
            return True, RoomResponseSchema().dump(available_rooms, many=True)

        except Exception as ex:
            return False, f"Hiba a keresés során: {str(ex)}"