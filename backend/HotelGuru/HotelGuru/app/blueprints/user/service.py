from app.extensions import db
from flask import current_app
from app.blueprints.user.schemas import PayloadSchema, UserResponseSchema, RoleSchema
from app.blueprints.hotel.schemas import HotelResponseSchema

from app.models.user import User
from app.models.address import Address
from app.models.role import Role
from app.models.hotel import Hotel
from datetime import datetime, timedelta
from sqlalchemy import select
from authlib.jose import jwt, JoseError

class UserService:
        
    @staticmethod
    def user_registrate(request):
        try:
            if db.session.execute(select(User).filter_by(email=request["email"])).scalar_one_or_none():
                return False, "E-mail already exist!"

            request["address"] = Address(**request["address"])
            user = User(**request)
            user.set_password(user.password)
            user.roles.append(
                db.session.execute(select(Role).filter_by(name="User")).scalar_one()            
                )
            db.session.add(user)
            db.session.commit()
        except Exception as ex:
            return False, "Incorrect User data!"
        return True, UserResponseSchema().dump(user)
        
    @staticmethod
    def user_login(request):
        try:
           user = db.session.execute(select(User).filter_by(email=request["email"])).scalar_one()
           if not user.check_password(request["password"]):
                return False, "Incorrect e-mail or password!"
           user_schema = UserResponseSchema().dump(user)
           user_schema["token"] = UserService.token_generate(user)
           return True, user_schema  
        except Exception as ex:
            return False, "Incorrect Login data!"
         

    @staticmethod
    def list_all_roles():
        try:
            roles = db.session.query(Role).all()
            return True, RoleSchema().dump(obj=roles, many=True)
        except Exception as ex:
            return False, "Error while listing all roles!"
    
    @staticmethod
    def list_user_roles(uid):
        user = db.session.get(User, uid)
        if user is None:
            return False, "User not found!"
        return True, RoleSchema().dump(obj=user.roles, many=True)

    @staticmethod
    def get_user_profile(uid):
        user = db.session.get(User, uid)
        if user is None:
            return False, "User not found!"
        return True, UserResponseSchema().dump(user)
    
    @staticmethod
    def user_add_address(request):
        try:
            address = Address(**request)
            db.session.add(address)
            db.session.commit()
        except Exception as ex:
            return False, "Incorrect Address data!"
        return True, address.id
    
    @staticmethod
    def user_update_szemelyes(uid, request):
        try:
            user = db.session.get(User, uid)
            if user:
                user.name = request["name"]
                user.email = request["email"]
                user.szemely_igazolvany_szam=request["szemely_igazolvany_szam"]
                user.phone = request["phone"]
                user.address =Address(**request["address"])
                db.session.commit()
            
        except Exception as ex:
            return False, "user_update() error!"
        return True, UserResponseSchema().dump(user)

    @staticmethod
    def user_update_password(uid, request):
        try:
            user = db.session.get(User, uid)
            if user:
                user.password = request["password"]
                db.session.commit()
            
        except Exception as ex:
            return False, "user_update_password() error!"
        return True, "OK"


           
    @staticmethod
    def get_hotel(uid):
        user = db.session.get(User, uid)
        hotel=db.session.get(Hotel, user.get("hotel_id"))
        return True, HotelResponseSchema().dump(hotel, many = True)


    @staticmethod
    def token_generate(user : User):
        payload = PayloadSchema()
        payload.exp = int((datetime.now()+ timedelta(minutes=30)).timestamp())
        payload.user_id = user.id
        payload.roles = RoleSchema().dump(obj=user.roles, many=True)
        
        return jwt.encode({'alg': 'RS256'}, PayloadSchema().dump(payload), current_app.config['SECRET_KEY']).decode()
