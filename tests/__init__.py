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
        return json.loads(self.get_data())

class BaseAppTestCase(unittest.TestCase):
    privatePages = {
        '/navigation': (200, 'application/json'),
        '/current_user': (302, None),
        '/hosted_party': (302, None),
        }

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
            password = pbkdf2_sha256.hash(password)
        except AttributeError:
            password = pbkdf2_sha256.encrypt(password)

        result = self.app.db.execute("""
            INSERT INTO `users`
                (`username`, `password`, `email`, `config`)
            VALUES
                (:username, :password, :email, :config)
            """,
            {
                'username': user.get('username'),
                'password': password,
                'email': user.get('email'),
                'config': json.dumps(config),
                }
            )
        return result.lastrowid

    def getUser(self, userId):
        cur = self.app.db.execute("""
            SELECT `username`, `password`, `email`, `config`
            FROM `users`
            WHERE `id` = :userId
            """,
            {
                'userId': userId,
                }
            )
        obj = cur.fetchone()
        if obj is None:
            return None
        obj = dict(obj)
        user = json.loads(obj['config'])
        user['id'] = userId
        user['username'] = obj['username']
        user['email'] = obj['email']
        return user

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
