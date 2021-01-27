import os 
from flask import Flask 
from config import Config

server = Flask(__name__)

server.config.from_object(Config)

try:
    os.mkdir(server.config['DB_PATH'])
except FileExistsError:
    pass

from app import routes, helpers