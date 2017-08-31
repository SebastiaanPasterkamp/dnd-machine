import sqlite3

from flask import g

from .config import get_config, get_item_data

def connect_db():
    """Connects to the specific database.
    """
    config = get_config()
    rv = sqlite3.connect(config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv

def get_db():
    """Opens a new database connection if there is none yet for the
    current application context.
    """
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db
