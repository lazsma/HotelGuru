
from __future__ import annotations

from app import db
from app import create_app
from config import Config

app = create_app(config_class=Config)
app.app_context().push()

#Role
from app.models.role import Role

db.session.add_all([ Role(name="Administrator"), 
                     Role(name="Receptionist"), 
                     Role(name = "Janitor"), 
                     Role(name ="User") ])
db.session.commit()
    
#Address
from app.models.address import Address

#User
from app.models.user import User, UserRole