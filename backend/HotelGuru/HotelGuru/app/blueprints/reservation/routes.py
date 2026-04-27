from app.blueprints.reservation import bp
from app.blueprints.reservation.schemas import ReservationRequestSchema, ReservationResponseSchema
from app.blueprints.reservation.service import ReservationService
from apiflask import HTTPError

@bp.post('/create')
@bp.doc(tags=["reservation"])
@bp.input(ReservationRequestSchema, location="json")
@bp.output(ReservationResponseSchema)
def create_reservation(json_data):
    success, response = ReservationService.create_reservation(json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)
