from app.blueprints.hotel import bp
from app.blueprints.hotel.schemas import (
    HotelResponseSchema, 
    HotelRequestSchema, 
    RoomSearchQuerySchema
)
from app.blueprints.room.schemas import RoomResponseSchema
from app.blueprints.hotel.service import HotelService
from apiflask import HTTPError

@bp.get('/')
@bp.doc(tags=["hotel"], summary="Összes hotel listázása")
@bp.output(HotelResponseSchema(many=True))
def list_hotels():
    success, response = HotelService.list_all_hotels()
    return response

@bp.get('/<int:hotel_id>/rooms')
@bp.doc(tags=["hotel"], summary="Egy hotel összes szobájának listázása")
@bp.output(RoomResponseSchema(many=True))
def get_hotel_rooms(hotel_id):
    success, response = HotelService.get_all_rooms(hotel_id)
    if success:
        return response
    raise HTTPError(message=response, status_code=404)

@bp.get('/search/available-rooms')
@bp.doc(tags=["hotel"], summary="Szabad szobák keresése az összes hotelben")
@bp.input(RoomSearchQuerySchema, location='query')
@bp.output(RoomResponseSchema(many=True))
def search_all_available_rooms(query_data):
    success, response = HotelService.get_available_rooms(
        query_data['start_date'], 
        query_data['end_date']
    )
    if success:
        return response
    raise HTTPError(message=response, status_code=400)

@bp.get('/<int:hotel_id>/search/available-rooms')
@bp.doc(tags=["hotel"], summary="Szabad szobák keresése egy adott hotelben")
@bp.input(RoomSearchQuerySchema, location='query')
@bp.output(RoomResponseSchema(many=True))
def search_hotel_available_rooms(hotel_id, query_data):
    success, response = HotelService.get_available_rooms(
        query_data['start_date'], 
        query_data['end_date'],
        hotel_id=hotel_id
    )
    if success:
        return response
    raise HTTPError(message=response, status_code=400)