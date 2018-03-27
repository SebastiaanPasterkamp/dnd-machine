import unittest

from __init__ import BaseAppTestCase

class AppTestCase(BaseAppTestCase):

    def setUp(self):
        super(AppTestCase, self).setUp()
        self.privatePages = {
            '/navigation': (200, 'application/json'),
            '/current_user': (302, None),
            '/hosted_party': (302, None),
            }

    def testPublicPages(self):
        rv = self.client.get('/login')
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'text/html')

        rv = self.client.get('/current_user')
        self.assertEqual(rv.status_code, 401)

        rv = self.client.get('/authenticate')
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'application/json')
        self.assertDictContainsSubset({
            'author': "Cromrots",
            "title": "D&D Machine",
            }, rv.get_json())

        rv = self.client.get('/static/js/dnd-machine.js')
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'application/javascript')

        rv = self.client.get('/static/css/dnd-machine.css')
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'text/css')

    def testPrivatePages401(self):
        for page, expected in self.privatePages.items():
            rv = self.client.get(page)
            self.assertEqual(rv.status_code, 401)

    def testPrivatePages200(self):
        self.doLogin('admin', 'admin')
        for page, expected in self.privatePages.items():
            code, mimetype = expected
            rv = self.client.get(page)
            self.assertEqual(rv.status_code, code)
            if mimetype:
                self.assertEqual(rv.mimetype, mimetype)

    def testLogin(self):
        rv = self.doLogin('admin', 'admin')
        self.assertEqual(rv.status_code, 302)

        rv = self.client.get('/current_user', follow_redirects=True)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'application/json')

        currentUser = rv.get_json()
        self.assertDictContainsSubset({
            'id': 1,
            'username': 'admin',
            'role': ['admin', 'dm'],
            }, currentUser)

    def testLogout(self):
        rv = self.doLogin('admin', 'admin')
        self.assertEqual(rv.status_code, 302)

        rv = self.client.get('/current_user', follow_redirects=True)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'application/json')

        rv = self.doLogout(False)
        self.assertEqual(rv.status_code, 200)

        rv = self.client.get('/current_user', follow_redirects=True)
        self.assertEqual(rv.status_code, 401)

if __name__ == '__main__':
    unittest.main()
