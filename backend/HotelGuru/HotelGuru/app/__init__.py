from apiflask import APIFlask, HTTPTokenAuth
from config import Config
from app.extensions import db
from app.models import *

def create_app(config_class=Config):
    #app = Flask(__name__)
    app = APIFlask(__name__, json_errors = True, 
               title="Netpincer API",
               docs_path="/swagger")

    app.config.from_object(config_class)
    # Initialize Flask extensions here
    db.init_app(app)
    
    from flask_migrate import Migrate
    migrate = Migrate(app, db, render_as_batch=True)
    
    # Register blueprints here
    #from app.blueprints import bp as bp_default
    #app.register_blueprint(bp_default, url_prefix='/api')  

    from app.blueprints.user.routes import bp as user_bp
    from app.blueprints.receptionist.routes import bp as recep_bp
    from app.blueprints.admin.routes import bp as admin_bp
    from app.blueprints.hotel.routes import bp as hotel_bp
    from app.blueprints.room.routes import bp as room_bp
    from app.blueprints.reservation.routes import bp as reservation_bp
    
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(recep_bp, url_prefix='/api/receptionist')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(hotel_bp, url_prefix='/api/hotel')
    app.register_blueprint(room_bp, url_prefix='/api/room')
    app.register_blueprint(reservation_bp, url_prefix='/api/reservation')

    return app