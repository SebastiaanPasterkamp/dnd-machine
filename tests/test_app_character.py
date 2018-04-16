import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app.app import migrate

from __init__ import BaseAppTestCase

class AppCharacterTestCase(BaseAppTestCase):

    def setUp(self):
        super(AppCharacterTestCase, self).setUp()
        self.privatePages = {
            '/character/list': (200, 'text/html'),
            '/character/new': (200, 'text/html'),
            '/character/api': (200, 'application/json'),
            '/character/api/999': (404, None),
            '/character/copy/999': (404, None),
            '/character/download/999': (404, None),
            '/character/races/api': (200, 'application/json'),
            '/character/classes/api': (200, 'application/json'),
            '/character/backgrounds/api': (200, 'application/json'),
            }

        users = {
            u'user': [],
            u'alice': ['player'],
            u'bob': ['player'],
            u'dm': ['dm']
            }
        self.users = {}
        self.characters = {}
        for name, role in users.items():
            self.users[name] = self.createUser({
                'username': name,
                'password': name,
                'email': name + u'@example.com',
                'role': role,
                })
            self.users[name]['password'] = name
            self.characters[name] = self.createCharacter(
                {
                    'name': name
                    },
                self.users[name]
                )

        migrate(self.app, ['user', 'character'])
        charId = self.characters['alice']['id']
        self.protectedPages = {
            '/character/api/%d' % charId: (200, 'application/json'),
            '/character/copy/%d' % charId: (302, None),
            '/character/download/%d' % charId: (200, 'application/pdf'),
            }
        self.adminPages = {
            '/character/raw/%d' % charId: (200, 'application/json'),
            '/character/xp/%d/25' % charId: (302, None),
            '/character/reset/%d' % charId: (302, None),
            }

    def testPrivatePages401(self):
        pages = {}
        pages.update(self.privatePages)
        pages.update(self.protectedPages)
        pages.update(self.adminPages)
        for page, expected in pages.items():
            rv = self.client.get(
                page,
                headers={'X-Requested-With': 'XMLHttpRequest'}
                )
            self.assertResponse(page, rv, 401)

    def testPrivatePages200(self):
        self.doLogin('alice', 'alice')
        pages = {}
        pages.update(self.privatePages)
        pages.update(self.protectedPages)
        for page, expected in pages.items():
            code, mimetype = expected
            rv = self.client.get(page)
            self.assertResponse(page, rv, *expected)

    def testProtectedPages403(self):
        self.doLogin('bob', 'bob')
        for page, expected in self.protectedPages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, 403)

    def testProtectedPages200(self):
        self.doLogin('bob', 'bob')
        memberIds = [
            char['id']
            for char in self.characters.values()
            ]
        party = self.dbInsertObject(
            'party',
            {
                'name': 'test',
                'user_id': self.users['dm']['id'],
                'member_ids': memberIds,
                },
            ['name', 'user_id']
            )
        for charId in memberIds:
            self.dbInsertLink('party_characters', {
                'party_id': party['id'],
                'character_id': charId,
                })
        for page, expected in self.protectedPages.items():
            code, mimetype = expected
            rv = self.client.get(page)
            self.assertResponse(page, rv, *expected)

    def testPrivilegedPages403(self):
        self.doLogin('alice', 'alice')
        for page, expected in self.adminPages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, 403)

    def testPrivilegedPages200(self):
        self.doLogin('admin', 'admin')
        for page, expected in self.adminPages.items():
            code, mimetype = expected
            rv = self.client.get(page)
            self.assertResponse(page, rv, *expected)

    def listCharactersProtected(self):
        self.doLogin('alice', 'alice')
        charIds = [
            self.characters['alice']['id']
            ]
        page = '/character/api'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        charData = [
            char['id']
            for char in rv.get_json()
            ]
        self.assertListEqual(charData, charIds)

    def listCharactersParty(self):
        self.doLogin('alice', 'alice')
        charIds = sorted([
            self.characters['alice']['id'],
            self.characters['bob']['id']
            ])
        party = self.dbInsertObject(
            'party',
            {
                'name': 'test',
                'user_id': self.users['dm']['id'],
                'member_ids': charIds,
                },
            ['name', 'user_id']
            )
        for charId in charIds:
            self.dbInsertLink('party_characters', {
                'party_id': party['id'],
                'character_id': charId,
                })
        page = '/character/api'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        charData = [
            char['id']
            for char in rv.get_json()
            ]
        self.assertListEqual(charData, charIds)

    def listCharactersPrivileged(self):
        self.doLogin('dm', 'dm')
        charIds = sorted([
            char['id']
            for char in self.characters.values()
            ])
        page = '/character/api'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        charData = [
            char['id']
            for char in rv.get_json()
            ]
        self.assertListEqual(charData, charIds)

    def testCreateCharacter200(self):
        self.doLogin('alice', 'alice')
        char = dict(self.characters['alice'])
        del char['id']
        del char['equipment']
        del char['proficiencies']
        char.update({
            'name': 'test'
            })
        page = '/character/api'
        rv = self.postJSON(page, char)
        self.assertResponse(page, rv, 200, 'application/json')
        charData = rv.get_json()
        self.assertIn('id', charData)
        self.assertDictContainsSubset(char, charData)
        charData = self.dbGetObject('character', charData['id'])
        self.assertDictContainsSubset(char, charData)

    def testCreateCharacter403(self):
        self.doLogin('user', 'user')
        char = dict(self.characters['user'])
        del char['id']
        char.update({
            'name': 'test'
            })
        page = '/character/api'
        rv = self.postJSON(page, char)
        self.assertResponse(page, rv, 403)

    def testEditCharacter200(self):
        self.doLogin('alice', 'alice')
        orig = dict(self.characters['alice'])
        del orig['equipment']
        del orig['proficiencies']
        orig.update({
            'name': 'test',
            })
        char = dict(orig)
        char.update({
            'user_id': self.users['bob']['id'],
            'xp': 300,
            })
        page = '/character/api/%s' % char['id']
        rv = self.patchJSON(page, char)
        self.assertResponse(page, rv, 200, 'application/json')
        charData = rv.get_json()
        self.assertDictContainsSubset(orig, charData)
        charData = self.dbGetObject('character', charData['id'])
        self.assertDictContainsSubset(orig, charData)

    def testEditCharacterPrivileged200(self):
        self.doLogin('admin', 'admin')
        char = dict(self.characters['alice'])
        del char['equipment']
        del char['proficiencies']
        char.update({
            'name': 'test',
            'user_id': self.users['bob']['id'],
            'xp': 300,
            })
        page = '/character/api/%s' % char['id']
        rv = self.patchJSON(page, char)
        self.assertResponse(page, rv, 200, 'application/json')
        charData = rv.get_json()
        char['level'] = 2
        self.assertDictContainsSubset(char, charData)
        charData = self.dbGetObject('character', charData['id'])
        self.assertDictContainsSubset(char, charData)

    def testEditCharacter403(self):
        self.doLogin('bob', 'bob')
        orig = dict(self.characters['alice'])
        del orig['equipment']
        del orig['proficiencies']
        char = dict(orig)
        char.update({
            'name': 'test',
            'user_id': self.users['bob']['id'],
            'xp': 300,
            })
        page = '/character/api/%s' % char['id']
        rv = self.patchJSON(page, char)
        self.assertResponse(page, rv, 403)
        charData = self.dbGetObject('character', orig['id'])
        self.assertDictContainsSubset(orig, charData)

    def testEditCharacter409(self):
        self.doLogin('alice', 'alice')
        orig = dict(self.characters['alice'])
        del orig['equipment']
        del orig['proficiencies']
        char = dict(orig)
        char.update({
            'id': 999,
            'name': 'test',
            'xp': 300,
            })
        page = '/character/api/%s' % orig['id']
        rv = self.patchJSON(page, char)
        self.assertResponse(page, rv, 409)
        charData = self.dbGetObject('character', orig['id'])
        self.assertDictContainsSubset(orig, charData)

    def testGrantXp(self):
        self.doLogin('dm', 'dm')
        char = self.characters['alice']
        page = '/character/xp/%d/%d' % (char['id'], 300)
        rv = self.postJSON(page, char)
        self.assertResponse(page, rv, 302)
        charData = self.dbGetObject('character', char['id'])
        self.assertDictContainsSubset(
            {
                'xp': 300,
                'level': 2
                },
            charData
            )

    def testLevelUpCharacter(self):
        self.doLogin('dm', 'dm')
        char = self.characters['alice']
        page = '/character/xp/%d/%d' % (char['id'], 300)
        rv = self.postJSON(page, char)

        self.doLogin('alice', 'alice')
        beforeData = self.dbGetObject('character', char['id'])
        self.assertEquals([], beforeData['creation'])

        page = '/character/api/%s' % char['id']
        rv = self.patchJSON(page, beforeData)
        self.assertResponse(page, rv, 200, 'application/json')
        afterData = self.dbGetObject('character', char['id'])
        self.assertEquals(
            afterData['creation'],
            beforeData['level_up']['creation']
            )
        self.assertNotEquals(
            afterData['level_up'],
            beforeData['level_up']
            )

    def testDeleteCharacter200(self):
        char = self.characters['alice']
        self.doLogin('alice', 'alice')
        page = '/character/api/%d' % char['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 200)
        charData = self.dbGetObject('character', char['id'])
        self.assertIsNone(charData)

    def testDeleteCharacter403(self):
        char = self.characters['alice']
        self.doLogin('bob', 'bob')
        page = '/character/api/%d' % char['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 403)
        charData = self.dbGetObject('character', char['id'])
        del char['equipment']
        del char['proficiencies']
        self.assertDictContainsSubset(char, charData)

if __name__ == '__main__':
    unittest.main(verbosity=2)
