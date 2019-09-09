import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app import migrate

from baseapptest import BaseAppTestCase

class AppNpcTestCase(BaseAppTestCase):

    def setUp(self):
        super(AppNpcTestCase, self).setUp()
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

        npcs = {
            'generic': {
                'name': 'John Doe',
                'user_id': self.users['dm']['id'],
                'size': 'small',
                },
            'specific': {
                'name': 'Ortant Quessgi\'ver',
                'race': 'Imp',
                'user_id': self.users['author']['id'],
                'campaign_id': self.campaign['id'],
                'size': 'small',
                },
            }
        self.npcs = {}
        for name, npc in npcs.items():
            self.npcs[name] = self.createNpc(npc)
        migrate(self.app, ['npc'])

        genericId = self.npcs['generic']['id']
        self.dmPages = {
            '/npc/list': (200, 'text/html'),
            '/npc/races/api': (200, 'application/json'),
            '/npc/classes/api': (200, 'application/json'),
            '/npc/api': (200, 'application/json'),
            '/npc/show/%d' % genericId: (200, 'text/html'),
            '/npc/api/%d' % genericId: (200, 'application/json'),
            '/npc/new': (200, 'text/html'),
            '/npc/edit/%d' % genericId: (200, 'text/html'),
            '/npc/copy/%d' % genericId: (302, None),
            }
        specificId = self.npcs['specific']['id']
        self.authorPages = {
            '/npc/api/%d' % specificId: (200, 'application/json'),
            '/npc/copy/%d' % specificId: (302, None),
            }

    def _assertSameNpc(self, a, b):
        subset = dict((key, b.get(key)) for key in a)
        self.assertDictEqual(a, subset)

    def testProtectedPages401(self):
        for page in self.dmPages:
            rv = self.client.get(
                page,
                headers={'X-Requested-With': 'XMLHttpRequest'}
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
        del pages['/npc/edit/%d' % self.npcs['generic']['id']]
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
        page = '/npc/raw/%d' % self.npcs['generic']['id']
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')

    def testRawDm403(self):
        self.doLogin('dm', 'dm')
        page = '/npc/raw/%d' % self.npcs['generic']['id']
        rv = self.client.get(page)
        self.assertResponse(page, rv, 403)

    def testListNpcsProtected(self):
        self.doLogin('dm', 'dm')
        npcIds = [
            self.npcs['generic']['id'],
            ]
        page = '/npc/api'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        objIds = [obj['id'] for obj in rv.get_json()]
        self.assertListEqual(sorted(npcIds), sorted(objIds))

    def testListNpcsOwned(self):
        self.doLogin('author', 'author')
        npcIds = [
            self.npcs['generic']['id'],
            self.npcs['specific']['id'],
            ]
        page = '/npc/api'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        objIds = [obj['id'] for obj in rv.get_json()]
        self.assertListEqual(sorted(npcIds), sorted(objIds))

    def testCreateNpc200(self):
        self.doLogin('author', 'author')
        npc = dict(self.npcs['specific'])
        del npc['id']
        page = '/npc/api'
        rv = self.postJSON(page, npc)
        self.assertResponse(page, rv, 200, 'application/json')
        npcData = rv.get_json()
        self.assertIn('id', npcData)
        self.assertNotEqual(self.npcs['generic']['id'], npcData['id'])
        self._assertSameNpc(npc, npcData)
        npcData = self.dbGetObject('npc', npcData['id'])
        self._assertSameNpc(npc, npcData)

    def testCopyNpc200(self):
        self.doLogin('author', 'author')
        npc = dict(self.npcs['generic'])
        page = '/npc/copy/%d' % npc['id']
        rv = self.client.get(page, follow_redirects=False)
        new_id = int(rv.location.split('/')[-1])
        npc.update({
            'id': new_id,
            'name': npc['name'] + ' (Copy)',
            'user_id': self.users['author']['id'],
            })
        npcData = self.dbGetObject('npc', new_id)
        self._assertSameNpc(npc, npcData)

    def testCreateNpc403(self):
        self.doLogin('player', 'player')
        npc = dict(self.npcs['generic'])
        del npc['id']
        page = '/npc/api'
        rv = self.postJSON(page, npc)
        self.assertResponse(page, rv, 403)

    def testEditNpc200(self):
        self.doLogin('dm', 'dm')
        npc = dict(self.npcs['generic'])
        npc.update({
            'alignment': 'Chaotic Evil',
            'level': 5,
            'description': 'Plot twist :o',
            })
        page = '/npc/api/%d' % npc['id']
        rv = self.patchJSON(page, npc)
        self.assertResponse(page, rv, 200, 'application/json')
        npcData = rv.get_json()
        self._assertSameNpc(npc, npcData)
        npcData = self.dbGetObject('npc', npc['id'])
        self._assertSameNpc(npc, npcData)

    def testEditNpc403(self):
        self.doLogin('player', 'player')
        npc = dict(self.npcs['generic'])
        npc.update({
            'alignment': 'Chaotic Evil',
            'level': 5,
            'description': 'Plot twist :o',
            })
        page = '/npc/api/%d' % npc['id']
        rv = self.patchJSON(page, npc)
        self.assertResponse(page, rv, 403)
        npcData = self.dbGetObject('npc', npc['id'])
        self._assertSameNpc(self.npcs['generic'], npcData)

    def testEditNpcDm403(self):
        self.doLogin('dm', 'dm')
        npc = dict(self.npcs['specific'])
        npc.update({
            'alignment': 'Chaotic Evil',
            'level': 5,
            'description': 'Plot twist :o',
            })
        page = '/npc/api/%d' % npc['id']
        rv = self.patchJSON(page, npc)
        self.assertResponse(page, rv, 403)
        npcData = self.dbGetObject('npc', npc['id'])
        self._assertSameNpc(self.npcs['specific'], npcData)

    def testDeleteNpc200(self):
        self.doLogin('dm', 'dm')
        page = '/npc/api/%d' % self.npcs['generic']['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 200)
        npcData = self.dbGetObject('npc', self.npcs['generic']['id'])
        self.assertIsNone(npcData)

    def testDeleteNpc403(self):
        self.doLogin('player', 'player')
        npc = dict(self.npcs['generic'])
        page = '/npc/api/%d' % npc['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 403)
        npcData = self.dbGetObject('npc', npc['id'])
        self._assertSameNpc(npc, npcData)

    def testDeleteNpcDm403(self):
        self.doLogin('author', 'author')
        npc = dict(self.npcs['generic'])
        page = '/npc/api/%d' % npc['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 403)
        npcData = self.dbGetObject('npc', npc['id'])
        self._assertSameNpc(npc, npcData)

if __name__ == '__main__':
    unittest.main(verbosity=2)
