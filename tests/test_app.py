import unittest
import os
import sys
import json
from flask import Response as BaseResponse

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app.app import create_app, initdb

class Response(BaseResponse):
    def get_json(self):
        return json.loads(self.get_data())

class AppTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app({
            'DATABASE': ':memory:',
            'TESTING': True,
            })
        self.app.response_class = Response
        self.client = self.app.test_client()
        self.app.testing = True
        initdb(self.app)

    def tearDown(self):
        self.app.db.close()

    def login(self, username, password):
        return self.client.post(
            '/login',
            data=json.dumps({
                'username': username,
                'password': password,
                }),
            follow_redirects=True,
            content_type='application/json'
            )

    def logout(self, follow_redirects=True):
        return self.client.get(
            '/logout',
            follow_redirects=follow_redirects
            )

    def test_no_current_user(self):
        rv = self.client.get('/current_user')
        assert rv.status_code == 404

    def test_login(self):
        rv = self.login('admin', 'admin')
        self.assertEqual(rv.status_code, 200)

        rv = self.client.get('/current_user', follow_redirects=True)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'application/json')

        current_user = rv.get_json()
        self.assertDictContainsSubset({
            'id': 1,
            'username': 'admin',
            'role': ['admin', 'dm'],
            }, current_user)

    def test_logout(self):
        rv = self.login('admin', 'admin')
        self.assertEqual(rv.status_code, 200)

        rv = self.client.get('/current_user', follow_redirects=True)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'application/json')

        rv = self.logout(False)
        self.assertEqual(rv.status_code, 302)

        rv = self.client.get('/current_user', follow_redirects=True)
        self.assertEqual(rv.status_code, 404)

if __name__ == '__main__':
    unittest.main()
