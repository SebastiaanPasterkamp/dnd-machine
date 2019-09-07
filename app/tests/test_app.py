import unittest

from __init__ import BaseAppTestCase

class AppTestCase(BaseAppTestCase):

    def setUp(self):
        super(AppTestCase, self).setUp()
        self.privatePages = {
            '/navigation': (200, 'application/json'),
            '/hosted_party': (302, None),
            }

    def testPublicPages(self):
        rv = self.client.get('/login')
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'text/html')

        rv = self.client.get('/recover')
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'text/html')

        rv = self.client.get(
            '/current_user',
            headers={'X-Requested-With': 'XMLHttpRequest'}
            )
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'application/json')
        self.assertEqual(rv.get_json(), None)

        rv = self.client.get('/authenticate')
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'application/json')
        self.assertDictContainsSubset({
            'author': "Cromrots",
            "title": "D&D Machine",
            }, rv.get_json())

        #rv = self.client.get('/static/js/dnd-machine.js')
        #self.assertEqual(rv.status_code, 200)
        #self.assertEqual(rv.mimetype, 'application/javascript')

        #rv = self.client.get('/static/css/dnd-machine.css')
        #self.assertEqual(rv.status_code, 200)
        #self.assertEqual(rv.mimetype, 'text/css')


    def testPrivatePages401(self):
        for page, expected in self.privatePages.items():
            rv = self.client.get(
                page,
                headers={'X-Requested-With': 'XMLHttpRequest'}
                )
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

        rv = self.client.get(
            '/current_user',
            follow_redirects=True,
            headers={'X-Requested-With': 'XMLHttpRequest'}
            )
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'application/json')

        rv = self.doLogout(False)
        self.assertEqual(rv.status_code, 200)

        rv = self.client.get(
            '/current_user',
            follow_redirects=True,
            headers={'X-Requested-With': 'XMLHttpRequest'}
            )
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.get_json(), None)


    def testRecoverStart(self):
        user = self.createUser({
            'username': 'testRecoverStart',
            'password': 'testRecoverStart',
            'email': u'testRecoverStart@example.com',
            })
        self.assertNotIn('recovery', user)

        self.app.static_folder = '../ui/src'

        rv = self.client.post(
            '/recover',
            data=dict(match=user['username']),
            follow_redirects=False,
            )
        self.assertEqual(rv.status_code, 302)
        self.assertIn('/login', rv.location)

        userData = self.dbGetObject('user', user['id'])
        self.assertIn('recovery', userData)
        self.assertDictContainsSubset(user, userData)


    def testRecoverClaim(self):
        key = u'R3C0V3R'
        user = self.createUser({
            'username': 'testRecoverStart',
            'password': 'testRecoverStart',
            'email': u'testRecoverStart@example.com',
            'recovery': key,
            })

        rv = self.client.get(
            '/recover/%d/%s' % (user['id'], key)
            )
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'text/html')

        rv = self.client.post(
            '/recover/%d/%s' % (user['id'], key),
            data=dict(
                pwd1='good',
                pwd2='bad',
                ),
            follow_redirects=False,
            )
        self.assertEqual(rv.status_code, 302)
        self.assertIn(
            '/recover/%d/%s' % (user['id'], key),
            rv.location
            )

        rv = self.client.post(
            '/recover/%d/%s' % (user['id'], key),
            data=dict(
                pwd1='1234abcd',
                pwd2='1234abcd',
                ),
            follow_redirects=False,
            )
        self.assertEqual(rv.status_code, 302)
        self.assertIn('/login', rv.location)

        userData = self.dbGetObject('user', user['id'])
        self.assertNotIn('recovery', userData)
        self.assertNotEquals(user['password'], userData['password'])


if __name__ == '__main__':
    unittest.main()
