import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app.app import migrate

from __init__ import BaseAppTestCase

class AppMonsterTestCase(BaseAppTestCase):

    def setUp(self):
        super(AppMonsterTestCase, self).setUp()
        users = {
            u'player': [u'player'],
            u'dm': [u'dm'],
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
        self.monster = self.createMonster({
            'name': 'Little Beast',
            'size': 'small',
            })
        migrate(self.app, ['monster'])

        monsterId = self.monster['id']
        self.dmPages = {
            '/monster/list': (200, 'text/html'),
            '/monster/api': (200, 'application/json'),
            '/monster/show/%d' % monsterId: (200, 'text/html'),
            '/monster/api/%d' % monsterId: (200, 'application/json'),
            '/monster/new': (200, 'text/html'),
            '/monster/edit/%d' % monsterId: (200, 'text/html'),
            }

    def _assertSameMonster(self, a, b):
        a = dict(a)
        monsterAttack = dict(a['attacks'][0])
        del a['attacks']
        monsterAttackDamage = monsterAttack['damage'][0]
        del monsterAttack['damage']
        self.assertDictContainsSubset(a, b)
        self.assertDictContainsSubset(
            monsterAttack,
            b['attacks'][0]
            )
        self.assertDictContainsSubset(
            monsterAttackDamage,
            b['attacks'][0]['damage'][0]
            )

    def testProtectedPages401(self):
        for page, expected in self.dmPages.items():
            rv = self.client.get(
                page,
                headers={'X-Requested-With': 'XMLHttpRequest'}
                )
            self.assertResponse(page, rv, 401)

    def testDmPages200(self):
        self.doLogin('dm', 'dm')
        for page, expected in self.dmPages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, *expected)

    def testDmPages403(self):
        self.doLogin('player', 'player')
        for page, expected in self.dmPages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, 403)

    def testRawAdmin200(self):
        self.doLogin('admin', 'admin')
        page = '/monster/raw/%d' % self.monster['id']
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')

    def testRawDm403(self):
        self.doLogin('dm', 'dm')
        page = '/monster/raw/%d' % self.monster['id']
        rv = self.client.get(page)
        self.assertResponse(page, rv, 403)

    def testCreateMonster200(self):
        self.doLogin('dm', 'dm')
        monster = dict(self.monster)
        del monster['id']
        page = '/monster/api'
        rv = self.postJSON(page, monster)
        self.assertResponse(page, rv, 200, 'application/json')
        monsterData = rv.get_json()
        self.assertIn('id', monsterData)
        self.assertNotEquals(self.monster['id'], monsterData['id'])
        self._assertSameMonster(monster, monsterData)
        monsterData = self.dbGetObject('monster', monsterData['id'])
        self._assertSameMonster(monster, monsterData)

    def testCreateMonster403(self):
        self.doLogin('player', 'player')
        monster = dict(self.monster)
        del monster['id']
        page = '/monster/api'
        rv = self.postJSON(page, monster)
        self.assertResponse(page, rv, 403)

    def testEditMonster200(self):
        self.doLogin('dm', 'dm')
        monster = dict(self.monster)
        monster.update({
            'name': 'Big Monster',
            'size': 'large',
            'description': 'It grew up',
            })
        page = '/monster/api/%d' % monster['id']
        rv = self.patchJSON(page, monster)
        self.assertResponse(page, rv, 200, 'application/json')
        monsterData = rv.get_json()
        self._assertSameMonster(monster, monsterData)
        monsterData = self.dbGetObject('monster', monster['id'])
        self._assertSameMonster(monster, monsterData)

    def testEditMonster403(self):
        self.doLogin('player', 'player')
        monster = dict(self.monster)
        monster.update({
            'name': 'Big Monster',
            'size': 'large',
            'description': 'It grew up',
            })
        page = '/monster/api/%d' % monster['id']
        rv = self.patchJSON(page, monster)
        self.assertResponse(page, rv, 403)
        monsterData = self.dbGetObject('monster', monster['id'])
        self._assertSameMonster(self.monster, monsterData)

    def testDeleteMonster200(self):
        self.doLogin('dm', 'dm')
        monster = dict(self.monster)
        page = '/monster/api/%d' % monster['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 200)
        monsterData = self.dbGetObject('monster', monster['id'])
        self.assertIsNone(monsterData)

    def testDeleteMonster403(self):
        self.doLogin('player', 'player')
        monster = dict(self.monster)
        page = '/monster/api/%d' % monster['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 403)
        monsterData = self.dbGetObject('monster', monster['id'])
        self._assertSameMonster(monster, monsterData)

if __name__ == '__main__':
    unittest.main(verbosity=2)
