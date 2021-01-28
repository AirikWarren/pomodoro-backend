import os

base_dir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = False
    TESTING = bool(os.environ.get("TESTING"))
    if TESTING:
        DB_PATH = base_dir+'/json_testing'
    else:
        DB_PATH = base_dir+'/json'
