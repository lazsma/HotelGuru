from app.blueprints.reservation import bp
from app.blueprints.reservation.schemas import ReservationRequestSchema, ReservationResponseSchema
from app.blueprints.reservation.service import ReservationService
from apiflask import HTTPError
from app.models.reservation import StatusEnum

@bp.post('/create')
@bp.doc(tags=["reservation"])
@bp.input(ReservationRequestSchema, location="json")
@bp.output(ReservationResponseSchema)
def create_reservation(json_data):
    success, response = ReservationService.create_reservation(json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)


@bp.get('/list/<int:userid>')
@bp.output(ReservationResponseSchema(many = True))
def reservation_list_all(userid):
    success, response = ReservationService.list_all(userid)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@bp.get('/get/<int:reservation_id>')
@bp.doc(tags=["reservation"])
@bp.output(ReservationResponseSchema)
def get_reservation(reservation_id):
    success, response = ReservationService.get_reservation(reservation_id)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)


