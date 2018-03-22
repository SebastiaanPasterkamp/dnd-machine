import unittest

from __init__ import BaseAppTestCase

class AppUserTestCase(BaseAppTestCase):
    adminPages = {
        '/user/list': (200, 'text/html'),
        '/user/new': (200, 'text/html'),
        '/user/api': (200, 'application/json'),
        '/user/raw/1': (200, 'application/json'),
        }

    def setUp(self):
        super(AppUserTestCase, self).setUp()
        users = {
            u'user': [],
            u'player': [u'player'],
            u'dm': [u'player']
            }
        self.users = {}
        for name, role in users.items():
            self.users[name] = {
                'username': name,
                'password': name,
                'email': name + u'@example.com',
                'role': role,
                }
            self.users[name]['id'] = self.createUser(
                self.users[name]
                )

    def testProtectedPages401(self):
        for page, expected in self.privatePages.items():
            rv = self.client.get(page)
            self.assertEqual(rv.status_code, 401)
        for page, expected in self.adminPages.items():
            rv = self.client.get(page)
            self.assertEqual(rv.status_code, 401)

    def testProtectedPages403(self):
        self.doLogin('user', 'user')
        for page, expected in self.adminPages.items():
            rv = self.client.get(page)
            self.assertEqual(rv.status_code, 403)

    def testProtectedPages200(self):
        self.doLogin('admin', 'admin')
        for page, expected in self.privatePages.items():
            code, mimetype = expected
            rv = self.client.get(page)
            self.assertEqual(rv.status_code, code)
            if mimetype:
                self.assertEqual(rv.mimetype, mimetype)
        for page, expected in self.adminPages.items():
            code, mimetype = expected
            rv = self.client.get(page)
            self.assertEqual(rv.status_code, code)
            if mimetype:
                self.assertEqual(rv.mimetype, mimetype)

    def testProtectedContentGet(self):
        self.doLogin('dm', 'dm')
        for userId in [
                1,
                self.users['player']['id'],
                self.users['user']['id'],
                ]:
            rv = self.client.get('/user/api/%s' % userId)
            userData = rv.get_json()
            self.assertNotIn('email', userData)

        self.doLogin('admin', 'admin')
        for userId in [
                1,
                self.users['dm']['id'],
                self.users['player']['id'],
                self.users['user']['id'],
                ]:
            rv = self.client.get('/user/api/%s' % userId)
            userData = rv.get_json()
            self.assertIn('email', userData)

    def testProtectedContentPatch(self):
        users = [
            self.users['dm'],
            self.users['player'],
            self.users['user'],
            ]

        for user in users:
            self.doLogin(user['username'], user['password'])
            rv = self.patchJSON('/user/api/%s' % user['id'], {
                'id': user['id'],
                'role': ['admin']
                })
            self.assertEqual(200, rv.status_code)
            userData = rv.get_json()
            self.assertNotIn(u'admin', userData['role'])
            userData = self.getUser(user['id'])
            self.assertEqual(user['role'], userData['role'])

        self.doLogin('admin', 'admin')
        for user in users:
            rv = self.patchJSON('/user/api/%s' % user['id'], {
                'id': user['id'],
                'role': ['admin']
                })
            self.assertEqual(200, rv.status_code)
            userData = rv.get_json()
            self.assertEqual([u'admin'], userData['role'])

    def testCreateUser(self):
        user = {
            'username': "test",
            'password': 'secret',
            'name': "Test Case",
            'role': ["player"],
            'email': "test@example.com",
            }

        self.doLogin('admin', 'admin')
        rv = self.postJSON('/user/api', user)
        del user['password']
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'application/json')
        userData = rv.get_json()
        self.assertIn('id', userData)
        self.assertDictContainsSubset(user, userData)

    def testEditUser(self):
        user = {
            'id': self.users['user']['id'],
            'username': "test",
            'password': 'secret',
            'name': "Test Case",
            'role': ["player"],
            'email': "test@example.com",
            }

        self.doLogin('admin', 'admin')
        rv = self.patchJSON('/user/api/%d' % user['id'], user)
        del user['password']
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.mimetype, 'application/json')
        userData = rv.get_json()
        self.assertDictContainsSubset(user, userData)

if __name__ == '__main__':
    unittest.main()
