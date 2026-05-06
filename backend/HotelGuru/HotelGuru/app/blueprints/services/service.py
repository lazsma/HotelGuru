from app.extensions import db
from app.blueprints.services.schemas import ServiceResponseSchema
from app.models.room import Room
from app.models.service import Service
from sqlalchemy import select



class ServicesService:
    @staticmethod
    def create_service(request):
        try:
            # A request dictionary-t kicsomagoljuk a Room modellhez
            service = Service(**request)
            db.session.add(room)
            db.session.commit()
        except Exception as ex:
            return False, f"create_room() error! ({str(ex)})"
        return True, ServiceResponseSchema().dump(service)

    @staticmethod
    def get_service(service_id):
        try:
            service = db.session.get(Service, service_id)
            if not service:
                return False, "Room not found"
            return True, ServiceResponseSchema().dump(service)
        except Exception as ex:
            return False, f"get_room() error! ({str(ex)})"

    @staticmethod
    def update_service(service_id, request_data):
        try:
            service = db.session.get(Service, service_id)
            if not service:
                return False, "Service not found"

            service.name= request_data.get('name', service.name)
            service.price = request_data.get('price', service.price)
            
            
            db.session.commit()
            return True, ServiceResponseSchema().dump(service)
        except Exception as ex:
            return False, f"update_details() error! ({str(ex)})"

    @staticmethod
    def list_all_services():
        try:
            services = db.session.query(Service).all()
            return True, ServiceResponseSchema().dump(obj=services, many=True)
        except Exception as ex:
            return False, "Error while listing all services!"