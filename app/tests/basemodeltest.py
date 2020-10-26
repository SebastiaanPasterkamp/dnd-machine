import unittest
import os
import sys
import inspect
import json

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app import create_app, initdb
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
        initdb(self.app)

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

    def write_to_file(self, data, filename):
        path = os.path.join(
            os.path.dirname(__file__),
            "data",
            self._get_caller_filename(),
            filename,
            )
        with open(path, "w") as fh:
            json.dump(
                data, fh,
                indent=2,
                sort_keys=True,
                ensure_ascii=False,
                )

    def _get_caller_filename(self):
        # get the caller's stack frame and extract its file path
        frame_info = inspect.stack()[2]
        filepath = frame_info.filename  # in python 3.5+, you can use frame_info.filename
        del frame_info  # drop the reference to the stack frame to avoid reference cycles

        return os.path.basename(filepath).replace('.py', '')

    def assertDeepEqual(self, expected, actual, path=""):
        if not isinstance(actual, type(expected)):
            self.fail("Type difference at %s: %s != %s" % (
                path, type(actual), type(expected)))
            return

        if isinstance(expected, dict):
            e, a = set(expected.keys()), set(actual.keys())
            if len(e - a):
                self.fail("Missing keys at %s: %r" % (path, e - a))
                return
            if len(a - e):
                self.fail("Extra keys at %s: %r" % (path, a - e))
                return
            for key in sorted(expected):
                self.assertDeepEqual(expected[key], actual[key], path + ".%s" % key)

        elif isinstance(expected, list):
            if len(actual) < len(expected):
                self.fail("Missing items at %s: %d < %d" % (
                    path, len(actual), len(expected)))
                return
            if len(actual) > len(expected):
                self.fail("Extra items at %s: %d > %d" % (
                    path, len(actual), len(expected)))
                return
            for i in range(len(expected)):
                self.assertDeepEqual(expected[i], actual[i], path + "[%d]" % i)

        else:
            self.assertEqual(expected, actual, path)
