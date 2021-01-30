import os

base_dir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = False
    TESTING = False 
    DB_PATH = base_dir+'/json'

class DevelopmentConfig(Config):
        ENV= "development"
        DEVELOPMENT= True
        DB_PATH = base_dir+'/json_testing'