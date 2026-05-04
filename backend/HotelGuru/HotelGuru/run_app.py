from flask import Flask
from config import Config
from app import create_app

# Uncomment the following lines to initialize the database with sample data
# import init_db

if __name__=="__main__":
    create_app(config_class=Config).run('localhost', 8888)
