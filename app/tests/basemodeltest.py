import unittest
import os
import sys
import inspect
import json

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app import create_app, _initdb
from config import get_config

from models.base import JsonObject

class BaseModelTestCase(unittest.TestCase):
    obj = JsonObject

    def setUp(self):
        self.config = get_config()
        self.config.update({
            'DATABASE': 'file:memory.db?mode=memory&cache=shared',
            'MAX_CONNECTIONS': 2,
            'SERVER_NAME': 'localhost.localdomain:5000',
            'TESTING': True,
            'DEBUG': True,
            })

        self.app = create_app(self.config)
        self.app.testing = True
        with self.app.db.connect() as db:
            _initdb(db)

    def tearDown(self):
        self.app.db.close()

    def load_from_file(self, filename):
        path = os.path.join(
            os.path.dirname(__file__),
            "data",
            self._get_caller_filename(),
            filename,
            )
        with open(path, "r") as fh:
            return self.obj(json.loads(fh.read()))

    def _get_caller_filename(self):
        # get the caller's stack frame and extract its file path
        frame_info = inspect.stack()[2]
        filepath = frame_info.filename  # in python 3.5+, you can use frame_info.filename
        del frame_info  # drop the reference to the stack frame to avoid reference cycles

        return os.path.basename(filepath).replace('.py', '')
