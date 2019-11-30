import sqlite3

import threading
try:
    import queue
except:
    import Queue as queue
from contextlib import contextmanager

from config import get_item_data
from models import Datamapper

class Database:
    def __init__(self, database=None):
        self.database = database
        self.max_size = 1
        self._pool = queue.Queue()
        self._lock = threading.RLock()
        self._opened = 0

    def init_app(self, app):
        self.database = app.config.get('DATABASE')
        self.max_size = app.config.get('MAX_CONNECTIONS', 0)
        app.db = self

    @contextmanager
    def connect(self):
        """Opens a db connection."""
        try:
            db = self._pool.get_nowait()
        except queue.Empty:
            with self._lock:
                if not self.max_size or self._opened < self.max_size:
                    self._opened += 1
                    db = self._connect()
                else:
                    raise Exception("Reached max DB connections")
        try:
            yield db
        except:
            db.close()
            raise
        self._pool.put(db)


    def close(self):
        """Closes the database connections, if connected."""
        with self._lock:
            try:
                while True:
                    db = self._pool.get_nowait()
                    self._opened -= 1
                    db.close()
            except queue.Empty:
                self._opened = 0
                pass

    def _connect(self):
        """Connects to the specific database."""
        rv = sqlite3.connect(
            self.database,
            check_same_thread=False,
            timeout=15,
            )
        rv.row_factory = sqlite3.Row
        rv.execute("PRAGMA foreign_keys = 1")
        return rv
