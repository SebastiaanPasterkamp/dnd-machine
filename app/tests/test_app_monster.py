import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app import migrate

from baseapptest import BaseAppTestCase

class AppMonsterTestCase(BaseAppTestCase):

    def setUp(self):
        super(AppMonsterTestCase, self).setUp()
        users = {
            'player': ['player'],
            'author': ['dm'],
            'dm': ['dm'],
            }
        self.users = {}
        for name, role in list(users.items()):
            self.users[name] = self.createUser({
                'username': name,
                'password': name,
                'email': name + '@example.com',
                'role': role,
                })
            self.users[name]['password'] = name

        self.campaign = self.createCampaign({
            'name': 'Test',
            'user_id': self.users['author']['id'],
            })

        monsters = {
            'generic': {
                'name': 'Little Beast',
                'user_id': self.users['dm']['id'],
                'size': 'small',
                },
            'specific': {
                'name': 'Big Bad End Guy',
                'user_id': self.users['author']['id'],
                'campaign_id': self.campaign['id'],
                'size': 'medium',
                },
            }
        self.monsters = {}
        for name, monster in monsters.items():
            self.monsters[name] = self.createMonster(monster)
        migrate(self.app, ['monster'])

        genericId = self.monsters['generic']['id']
        self.dmPages = {
            '/monster/list': (200, 'text/html'),
            '/monster/api': (200, 'application/json'),
            '/monster/show/%d' % genericId: (200, 'text/html'),
            '/monster/api/%d' % genericId: (200, 'application/json'),
            '/monster/new': (200, 'text/html'),
            '/monster/edit/%d' % genericId: (200, 'text/html'),
            '/monster/copy/%d' % genericId: (302, None),
            }
        specificId = self.monsters['specific']['id']
        self.authorPages = {
            '/monster/api/%d' % specificId: (200, 'application/json'),
            '/monster/copy/%d' % specificId: (302, None),
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
        for page in self.dmPages:
            rv = self.client.get(
                page,
                headers={'Accept': 'application/json'},
                )
            self.assertResponse(page, rv, 401)

    def testDmPages200(self):
        self.doLogin('dm', 'dm')
        for page, expected in list(self.dmPages.items()):
            rv = self.client.get(page)
            self.assertResponse(page, rv, *expected)

    def testAuthorPages200(self):
        self.doLogin('author', 'author')
        pages = self.dmPages.copy()
        pages.update(self.authorPages)
        del pages['/monster/edit/%d' % self.monsters['generic']['id']]
        for page, expected in pages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, *expected)

    def testDmPages403(self):
        self.doLogin('player', 'player')
        for page in self.dmPages:
            rv = self.client.get(page)
            self.assertResponse(page, rv, 403)

    def testAuthorPages403(self):
        self.doLogin('dm', 'dm')
        for page in self.authorPages:
            rv = self.client.get(page)
            self.assertResponse(page, rv, 403)

    def testRawAdmin200(self):
        self.doLogin('admin', 'admin')
        page = '/monster/raw/%d' % self.monsters['generic']['id']
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')

    def testRawDm403(self):
        self.doLogin('dm', 'dm')
        page = '/monster/raw/%d' % self.monsters['generic']['id']
        rv = self.client.get(page)
        self.assertResponse(page, rv, 403)

    def testListMonstersProtected(self):
        self.doLogin('dm', 'dm')
        monsterIds = [
            self.monsters['generic']['id'],
            ]
        page = '/monster/api'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        objIds = [obj['id'] for obj in rv.get_json()]
        self.assertListEqual(sorted(monsterIds), sorted(objIds))

    def testListMonstersOwned(self):
        self.doLogin('author', 'author')
        monsterIds = [
            self.monsters['generic']['id'],
            self.monsters['specific']['id'],
            ]
        page = '/monster/api'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        objIds = [obj['id'] for obj in rv.get_json()]
        self.assertListEqual(sorted(monsterIds), sorted(objIds))

    def testCreateMonster200(self):
        self.doLogin('author', 'author')
        monster = dict(self.monsters['specific'])
        del monster['id']
        page = '/monster/api'
        rv = self.postJSON(page, monster)
        self.assertResponse(page, rv, 200, 'application/json')
        monsterData = rv.get_json()
        self.assertIn('id', monsterData)
        self.assertNotEqual(self.monsters['generic']['id'], monsterData['id'])
        self._assertSameMonster(monster, monsterData)
        monsterData = self.dbGetObject('monster', monsterData['id'])
        self._assertSameMonster(monster, monsterData)

    def testCopyMonster200(self):
        self.doLogin('author', 'author')
        monster = dict(self.monsters['generic'])
        page = '/monster/copy/%d' % monster['id']
        rv = self.client.get(page, follow_redirects=False)
        new_id = int(rv.location.split('/')[-1])
        monster.update({
            'id': new_id,
            'name': monster['name'] + ' (Copy)',
            'user_id': self.users['author']['id'],
            })
        monsterData = self.dbGetObject('monster', new_id)
        self._assertSameMonster(monster, monsterData)

    def testCreateMonster403(self):
        self.doLogin('player', 'player')
        monster = dict(self.monsters['generic'])
        del monster['id']
        page = '/monster/api'
        rv = self.postJSON(page, monster)
        self.assertResponse(page, rv, 403)

    def testEditMonster200(self):
        self.doLogin('dm', 'dm')
        monster = dict(self.monsters['generic'])
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
        monster = dict(self.monsters['generic'])
        monster.update({
            'name': 'Big Monster',
            'size': 'large',
            'description': 'It grew up',
            })
        page = '/monster/api/%d' % monster['id']
        rv = self.patchJSON(page, monster)
        self.assertResponse(page, rv, 403)
        monsterData = self.dbGetObject('monster', monster['id'])
        self._assertSameMonster(self.monsters['generic'], monsterData)

    def testEditMonsterDm403(self):
        self.doLogin('dm', 'dm')
        monster = dict(self.monsters['specific'])
        monster.update({
            'name': 'Weally Worse End Guy',
            'size': 'large',
            'description': 'The end is nigh',
            })
        page = '/monster/api/%d' % monster['id']
        rv = self.patchJSON(page, monster)
        self.assertResponse(page, rv, 403)
        monsterData = self.dbGetObject('monster', monster['id'])
        self._assertSameMonster(self.monsters['specific'], monsterData)

    def testDeleteMonster200(self):
        self.doLogin('dm', 'dm')
        page = '/monster/api/%d' % self.monsters['generic']['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 200)
        monsterData = self.dbGetObject('monster', self.monsters['generic']['id'])
        self.assertIsNone(monsterData)

    def testDeleteMonster403(self):
        self.doLogin('player', 'player')
        monster = dict(self.monsters['generic'])
        page = '/monster/api/%d' % monster['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 403)
        monsterData = self.dbGetObject('monster', monster['id'])
        self._assertSameMonster(monster, monsterData)

    def testDeleteMonsterDm403(self):
        self.doLogin('author', 'author')
        monster = dict(self.monsters['generic'])
        page = '/monster/api/%d' % monster['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 403)
        monsterData = self.dbGetObject('monster', monster['id'])
        self._assertSameMonster(monster, monsterData)

if __name__ == '__main__':
    unittest.main(verbosity=2)
