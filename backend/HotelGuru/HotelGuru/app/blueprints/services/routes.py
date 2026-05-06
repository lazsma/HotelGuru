from app.blueprints.services import bp
from app.extensions import auth
from app.blueprints import role_required
from app.blueprints.services.schemas import ServiceResponseSchema,ServiceUpdateSchema
from app.blueprints.services.service import ServicesService

from apiflask import HTTPError




@bp.post('/service')
@bp.doc(tags=["room"])
@bp.input(ServiceResponseSchema, location="json")
@bp.output(ServiceResponseSchema)
def create_room(json_data):
    success, response = ServicesService.create_service(json_data)
    if success:
        return response, 201
    raise HTTPError(message=response, status_code=400)

@bp.get('/<int:service_id>')
@bp.doc(tags=["service"])
@bp.output(ServiceResponseSchema)
def get_room(room_id):
    success, response = ServicesService.get_service(service_id)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=404)

@bp.patch('/<int:room_id>/update')
@bp.auth_required(auth) 
@bp.doc(tags=['service'], summary="A service adatainak frissítése")
@bp.input(ServiceUpdateSchema, location="json")
@bp.output(ServiceResponseSchema)
@role_required(["Administrator"])
def update_details(service_id, json_data):
    success, response = ServicesService.update_service(service_id, json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)


@bp.get('/services')
@bp.doc(tags=["service"])
@bp.output(ServiceResponseSchema(many=True))
def list_all_services():
    success, response = ServicesService.list_all_services()
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)