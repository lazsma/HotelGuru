from app.blueprints.room import bp
from app.blueprints.room.schemas import (
    RoomRequestSchema, 
    RoomResponseSchema, 
    RoomUpdateDetailsSchema, 
    RoomStatusSchema
)
from app.blueprints.reservation.schemas import ReservationResponseSchema
from app.blueprints.room.service import RoomService
from apiflask import HTTPError

@bp.post('/create')
@bp.doc(tags=["room"])
@bp.input(RoomRequestSchema, location="json")
@bp.output(RoomResponseSchema)
def create_room(json_data):
    success, response = RoomService.create_room(json_data)
    if success:
        return response, 201
    raise HTTPError(message=response, status_code=400)

@bp.get('/<int:room_id>')
@bp.doc(tags=["room"])
@bp.output(RoomResponseSchema)
def get_room(room_id):
    success, response = RoomService.get_room(room_id)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=404)

@bp.patch('/<int:room_id>/details')
@bp.doc(tags=["room"], summary="A szoba alapvető adatainak frissítése")
@bp.input(RoomUpdateDetailsSchema, location="json")
@bp.output(RoomResponseSchema)
def update_details(room_id, json_data):
    success, response = RoomService.update_details(room_id, json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.patch('/<int:room_id>/status')
@bp.doc(tags=["room"], summary="A szoba elérhetőségének és állapotának módosítása")
@bp.input(RoomStatusSchema, location="json")
@bp.output(RoomResponseSchema)
def set_status(room_id, json_data):
    success, response = RoomService.set_status(room_id, json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.get('/<int:room_id>/reservations')
@bp.doc(tags=["room"], summary="A szoba foglalásainak lekérdezése")
@bp.output(ReservationResponseSchema(many=True))
def get_room_reservations(room_id):
    success, response = RoomService.get_room_reservations(room_id)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=404)
