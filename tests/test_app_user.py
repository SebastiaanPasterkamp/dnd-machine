import unittest

from __init__ import BaseAppTestCase

class AppUserTestCase(BaseAppTestCase):

    def setUp(self):
        super(AppUserTestCase, self).setUp()
        self.adminPages = {
            '/user/list': (200, 'text/html'),
            '/user/show/1': (200, 'text/html'),
            '/user/edit/1': (200, 'text/html'),
            '/user/new': (200, 'text/html'),
            '/user/api': (200, 'application/json'),
            '/user/raw/1': (200, 'application/json'),
            }
        users = {
            u'player': [u'player'],
            u'dm': [u'dm']
            }
        self.users = {}
        for name, role in users.items():
            self.users[name] = self.createUser({
                'username': name,
                'password': name,
                'email': name + u'@example.com',
                'role': role,
                })
            self.users[name]['password'] = name
        self.newUser = {
            'username': "test",
            'password': 'secret',
            'name': "Test Case",
            'role': ["player"],
            'email': "test@example.com",
            }


    def testProtectedPages401(self):
        for page, expected in self.adminPages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, 401)

    def testProtectedPages403(self):
        self.doLogin('player', 'player')
        for page, expected in self.adminPages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, 403)

    def testProtectedPages200(self):
        self.doLogin('admin', 'admin')
        for page, expected in self.adminPages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, *expected)

    def testProtectedContentGet(self):
        self.doLogin('dm', 'dm')
        for userId in [
                1,
                self.users['player']['id'],
                ]:
            page = '/user/api/%s' % userId
            rv = self.client.get(page)
            self.assertResponse(page, rv, 200, 'application/json')
            userData = rv.get_json()
            self.assertNotIn('email', userData)

        self.doLogin('admin', 'admin')
        for userId in [
                1,
                self.users['dm']['id'],
                self.users['player']['id'],
                ]:
            page = '/user/api/%s' % userId
            rv = self.client.get(page)
            self.assertResponse(page, rv, 200, 'application/json')
            userData = rv.get_json()
            self.assertIn('email', userData)

    def testProtectedContentPatch(self):
        users = [
            self.users['dm'],
            self.users['player'],
            ]

        for user in users:
            self.doLogin(user['username'], user['password'])
            page = '/user/api/%s' % user['id']
            rv = self.patchJSON(page, {
                'id': user['id'],
                'role': ['admin']
                })
            self.assertResponse(page, rv, 200, 'application/json')
            userData = rv.get_json()
            self.assertNotIn(u'admin', userData['role'])
            userData = self.dbGetObject('users', user['id'])
            self.assertEqual(user['role'], userData['role'])

        self.doLogin('admin', 'admin')
        for user in users:
            page = '/user/api/%s' % user['id']
            rv = self.patchJSON(page, {
                'id': user['id'],
                'role': ['admin']
                })
            self.assertResponse(page, rv, 200, 'application/json')
            userData = rv.get_json()
            self.assertEqual([u'admin'], userData['role'])

    def testCreateUser(self):
        user = self.newUser
        self.doLogin('admin', 'admin')
        page = '/user/api'
        rv = self.postJSON(page, self.newUser)
        self.assertResponse(page, rv, 200, 'application/json')
        userData = rv.get_json()
        self.assertIn('id', userData)
        del user['password']
        self.assertDictContainsSubset(user, userData)
        userData = self.dbGetObject('users', userData['id'])
        self.assertDictContainsSubset(user, userData)

    def testCreateUser403(self):
        user = self.newUser
        self.doLogin('player', 'player')
        page = '/user/api'
        rv = self.postJSON(page, user)
        self.assertResponse(page, rv, 403)

    def testEditUser(self):
        user = self.newUser
        user['id'] = self.users['player']['id']
        self.doLogin('admin', 'admin')
        page = '/user/api/%d' % user['id']
        rv = self.patchJSON(page, user)
        self.assertResponse(page, rv, 200, 'application/json')
        userData = rv.get_json()
        del user['password']
        self.assertDictContainsSubset(user, userData)
        userData = self.dbGetObject('users', user['id'])
        self.assertDictContainsSubset(user, userData)

    def testChangePassword(self):
        user = self.newUser
        user['id'] = self.users['player']['id']
        self.doLogin('player', 'player')
        user['password'] = ''
        page = '/user/api/%d' % user['id']
        rv = self.patchJSON(page, user)
        self.assertResponse(page, rv, 200, 'application/json')
        rv = self.doLogin('player', '')
        self.assertEqual(rv.status_code, 401)
        rv = self.doLogin('player', 'player')
        self.assertEqual(rv.status_code, 302)

        user['password'] = 'foobar'
        page = '/user/api/%d' % user['id']
        rv = self.patchJSON(page, user)
        self.assertResponse(page, rv, 200, 'application/json')
        rv = self.doLogin('player', 'player')
        self.assertEqual(rv.status_code, 401)
        rv = self.doLogin('player', 'foobar')
        self.assertEqual(rv.status_code, 302)

    def testEditUser403(self):
        user = self.newUser
        user['id'] = self.users['dm']['id']
        self.doLogin('player', 'player')
        page = '/user/api/%d' % user['id']
        rv = self.patchJSON(page, user)
        self.assertResponse(page, rv, 403)

    def testDeleteUser(self):
        user = self.users['player']
        self.doLogin('admin', 'admin')
        page = '/user/api/%d' % user['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 200, 'application/json')
        userData = self.dbGetObject('users', user['id'])
        self.assertIsNone(userData)

    def testDeleteUser403(self):
        user = self.users['player']
        self.doLogin('player', 'player')
        page = '/user/api/%d' % user['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 403)
        self.assertEqual(rv.status_code, 403)
        userData = self.dbGetObject('users', user['id'])
        del user['password']
        self.assertDictContainsSubset(user, userData)

if __name__ == '__main__':
    unittest.main(verbosity=2)
