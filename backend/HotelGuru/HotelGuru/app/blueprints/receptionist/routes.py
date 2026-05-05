from apiflask import HTTPError
from app.blueprints.receptionist import receptionist_bp
from app.blueprints.receptionist.service import ReceptionistService
from app.blueprints.receptionist.schemas import StatusUpdateSchema, InvoiceResponseSchema

from app.blueprints.reservation.schemas import ReservationResponseSchema
from app.blueprints.reservation.service import ReservationService
from app.models.reservation import StatusEnum

@receptionist_bp.get('/reservations')
@receptionist_bp.doc(tags=["receptionist"])
@receptionist_bp.output(ReservationResponseSchema(many=True))
def get_all_reservations():
    success, response = ReceptionistService.get_all_reservations()
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

@receptionist_bp.patch('/reservations/<int:id>/status')
@receptionist_bp.doc(tags=["receptionist"])
@receptionist_bp.input(StatusUpdateSchema, location="json")
def update_reservation_status(id, json_data):
    new_status_str = json_data.get('status')
    
    if new_status_str == 'Approved':
        status_enum = StatusEnum.Approved
    elif new_status_str == 'Cancelled':
        status_enum = StatusEnum.Cancelled
    else:
        raise HTTPError(message="Invalid status value", status_code=400)
    
    success, response = ReservationService.set_reservation_status(id, status_enum)
    
    if success:
        return {"message": response}, 200
    raise HTTPError(message=response, status_code=400)

@receptionist_bp.get('/reservations/<int:id>/invoice')
@receptionist_bp.doc(tags=["receptionist"])
@receptionist_bp.output(InvoiceResponseSchema)
def get_invoice(id):
    success, response = ReceptionistService.generate_invoice(id)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)
