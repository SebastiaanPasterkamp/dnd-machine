import unittest
import os
import sys
import json
from flask import Response as BaseResponse
from passlib.hash import pbkdf2_sha256

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app.app import create_app, initdb
from app.config import get_config

class Response(BaseResponse):
    def get_json(self):
        try:
            return json.loads(self.get_data())
        except:
            return None

class BaseAppTestCase(unittest.TestCase):

    def setUp(self):
        config = get_config()
        config.update({
            'DATABASE': ':memory:',
            'TESTING': True,
            'DEBUG': True,
            })

        self.app = create_app(config)
        self.app.response_class = Response
        self.client = self.app.test_client(use_cookies=True)
        self.app.testing = True
        initdb(self.app)

    def tearDown(self):
        self.app.db.close()

    def createUser(self, user):
        config = dict(
            (key,value)
            for key, value in user.iteritems()
            if key not in ['username', 'password', 'email']
            )
        password = user.get('password')
        try:
            user['password'] = pbkdf2_sha256.hash(password)
        except AttributeError:
            user['password'] = pbkdf2_sha256.encrypt(password)
        return self.dbInsertObject(
            'users',
            user,
            ['username', 'password', 'email']
            )

    def dbInsertObject(self, table, obj, columns=[]):
        data = dict(
            (key, value)
            for key, value in obj.iteritems()
            if key in columns
            )
        data['config'] = json.dumps(dict(
            (key, value)
            for key, value in obj.iteritems()
            if key not in columns
            ))

        result = self.app.db.execute("""
            INSERT INTO `%s`
                (`%s`)
            VALUES
                (:%s)
            """ % (
                table,
                '`, `'.join(data.keys()),
                ', :'.join(data.keys()),
                ),
            data
            )
        self.app.db.commit()
        return self.dbGetObject(table, result.lastrowid)

    def dbInsertLink(self, table, data={}):
        result = self.app.db.execute("""
            INSERT INTO `%s` (`%s`)
            VALUES (:%s)
            """ % (
                table,
                '`, `'.join(data.keys()),
                ', :'.join(data.keys()),
                ),
            data
            )
        self.app.db.commit()

    def dbGetObject(self, table, objId):
        cur = self.app.db.execute("""
            SELECT *
            FROM `%s`
            WHERE `id` = :objId
            """ % table,
            {
                'objId': objId,
                }
            )
        obj = cur.fetchone()
        if obj is None:
            return None
        obj = dict(obj)
        obj.update(json.loads(obj['config']))
        del obj['config']
        return obj

    def postJSON(self, path, data):
        return self.client.post(
            path,
            data=json.dumps(data),
            content_type='application/json'
            )

    def patchJSON(self, path, data):
        return self.client.patch(
            path,
            data=json.dumps(data),
            content_type='application/json'
            )

    def doLogin(self, username, password):
        return self.postJSON('/login', {
            'username': username,
            'password': password,
            })

    def doLogout(self, follow_redirects=True):
        return self.client.get(
            '/logout',
            follow_redirects=follow_redirects
            )

if __name__ == '__main__':
    unittest.main()
