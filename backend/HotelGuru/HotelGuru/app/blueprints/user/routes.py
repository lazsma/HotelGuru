from app.extensions import auth
from app.blueprints import role_required
from app.blueprints.user import bp
from app.blueprints.user.schemas import UserResponseSchema, UserRequestSchema, UserLoginSchema, RoleSchema, AddressSchema
from app.blueprints.user.service import UserService
from app.blueprints.reservation.service import ReservationService

from apiflask import HTTPError
from apiflask.fields import String, Email, Nested, Integer, List

# Uj felhasznalo regisztralasa User role-ban
@bp.post('/registrate')
@bp.doc(tags=["user"])
@bp.input(UserRequestSchema, location="json")
@bp.output(UserResponseSchema)
def user_registrate(json_data):
    success, response = UserService.user_registrate(json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

# Beleptetes  
@bp.post('/login')
@bp.doc(tags=["user"])
@bp.input(UserLoginSchema, location="json")
@bp.output(UserResponseSchema)
def user_login(json_data):
    success, response = UserService.user_login(json_data)
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

# Minden role kilistazasa, csak aki neke van (Admin es User) hozzaferese
@bp.get('/roles')
@bp.auth_required(auth) 
@bp.doc(tags=["user"])
@bp.output(RoleSchema(many=True))
@role_required(["Administrator"])
def user_list_roles():
    success, response = UserService.list_all_roles()
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)

# Sajat role(-ok) kilistazasa
@bp.get('/myroles')
@bp.doc(tags=["user"])
@bp.output(RoleSchema(many=True))
@bp.auth_required(auth)
def user_list_user_roles():
    success, response = UserService.list_user_roles(auth.current_user.get("user_id"))
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)


# visszaadja ki melyik hotelben dolgozik
@bp.get('/myhotel')
@bp.doc(tags=["user"])
@bp.output(RoleSchema(many=True))
@bp.auth_required(auth)
@role_required(["Administrator","Janitor","Receptionist"]) 
def user_list_user_roles_by_hotel():
    success, response = UserService.get_hotel(auth.current_user.get("user_id"))
    if success:
        return response, 200
    raise HTTPError(message=response, status_code=400)


# szemelyes adatok modositasa:(jsonfile mezok:nev,email,address(city,street,postalcode),szemely_igazolvany_szam,phone)
@bp.post('/update/szemelyes')
@bp.auth_required(auth)
@bp.doc(tags=["user"])
@role_required(["User"])
@bp.input(UserRequestSchema, location="json")
@bp.output(UserResponseSchema)
def user_update_szemelyes(json_data):
    success, response = UserService.user_update_szemelyes(auth.current_user.get("id"),json_data)
    if success:
        return str(response), 200
    raise HTTPError(message=response, status_code=400)

#jelszo modositas (json mezo:password)
@bp.post('/update/password')
@bp.auth_required(auth)
@bp.doc(tags=["user"])
@role_required(["User"])
@bp.input(UserRequestSchema, location="json")
@bp.output(UserResponseSchema)
def user_update_password(json_data):
    success, response = UserService.user_update_password(auth.current_user.get("id"),json_data)
    if success:
        return str(response), 200
    raise HTTPError(message=response, status_code=400)

