import sqlite3

from flask import g

from config import get_item_data
from models import Datamapper

def connect_db(config):
    """Connects to the specific database.
    """
    rv = sqlite3.connect(config['DATABASE'], check_same_thread=False)
    rv.row_factory = sqlite3.Row

    rv.execute("PRAGMA foreign_keys = 1")

    return rv

def get_db(app):
    """Opens a new database connection if there is none yet for the
    current application context.
    """
    if not hasattr(app, 'db'):
        app.db = connect_db(app.config)
    return app.db
