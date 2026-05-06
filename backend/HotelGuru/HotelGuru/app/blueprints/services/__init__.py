#from flask import Blueprint
from apiflask import APIBlueprint

bp = APIBlueprint('service', __name__, tag="service")

from app.blueprints.service import routes

