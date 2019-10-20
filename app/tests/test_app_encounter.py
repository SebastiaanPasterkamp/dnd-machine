import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app import migrate

from baseapptest import BaseAppTestCase

class AppEncounterTestCase(BaseAppTestCase):

    def setUp(self):
        super(AppEncounterTestCase, self).setUp()
        users = {
            'player': ['player'],
            'dm': ['dm'],
            'trudy': ['dm'],
            }
        monsters = {
            'Small': {'size': 'small'},
            'Medium': {'size': 'medium'},
            'Large': {'size': 'large'},
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
        self.monsters = {}
        for name, monster in list(monsters.items()):
            monster.update({'name': name})
            self.monsters[name] = self.createMonster(monster)

        self.campaign = self.createCampaign({
            'name': 'Test',
            'user_id': self.users['dm']['id'],
            })

        self.encounters = {}
        self.encounters['small'] = self.createEncounter(
            {'name': 'Small', 'campaign_id': self.campaign['id']},
            {'Small': 2},
            self.monsters,
            self.users['dm'],
            )
        self.encounters['mixed'] = self.createEncounter(
            {'name': 'Mixed'},
            {'Medium': 2, 'Large': 2},
            self.monsters,
            self.users['dm'],
            )
        migrate(self.app, ['monster', 'encounter'])
        encounterId = self.encounters['small']['id']
        self.dmPages = {
            '/encounter/list': (200, 'text/html'),
            '/encounter/api': (200, 'application/json'),
            '/encounter/new': (200, 'text/html'),
            '/encounter/show/%d' % encounterId: (200, 'text/html'),
            '/encounter/edit/%d' % encounterId: (200, 'text/html'),
            }
        self.ownedPages = {
            '/encounter/api/%d' % encounterId: (200, 'application/json'),
            }

    def testProtectedPages401(self):
        pages = {}
        pages.update(self.dmPages)
        pages.update(self.ownedPages)
        for page, expected in list(pages.items()):
            rv = self.client.get(
                page,
                headers={'X-Requested-With': 'XMLHttpRequest'}
                )
            self.assertResponse(page, rv, 401)

    def testDmPages200(self):
        self.doLogin('dm', 'dm')
        pages = {}
        pages.update(self.dmPages)
        pages.update(self.ownedPages)
        for page, expected in list(pages.items()):
            rv = self.client.get(page)
            self.assertResponse(page, rv, *expected)

    def testAdminPages200(self):
        self.doLogin('admin', 'admin')
        pages = {}
        pages.update(self.dmPages)
        pages.update(self.ownedPages)
        for page, expected in list(pages.items()):
            rv = self.client.get(page)
            self.assertResponse(page, rv, *expected)

    def testDmPages403(self):
        self.doLogin('player', 'player')
        pages = {}
        pages.update(self.dmPages)
        pages.update(self.ownedPages)
        for page, expected in list(pages.items()):
            rv = self.client.get(page)
            self.assertResponse(page, rv, 403)

    def testDmOwnedPages403(self):
        self.doLogin('trudy', 'trudy')
        for page, expected in list(self.ownedPages.items()):
            rv = self.client.get(page)
            self.assertResponse(page, rv, 403)

    def testDmNotOwnedFiltered(self):
        self.doLogin('trudy', 'trudy')
        page = '/encounter/api'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        encounterData = rv.get_json()
        self.assertEqual([], encounterData)

    def testRawAdmin200(self):
        self.doLogin('admin', 'admin')
        page = '/encounter/raw/%d' % self.encounters['small']['id']
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')

    def testRawDm403(self):
        self.doLogin('dm', 'dm')
        page = '/encounter/raw/%d' % self.encounters['small']['id']
        rv = self.client.get(page)
        self.assertResponse(page, rv, 403)

    def testCreateEncounter200(self):
        self.doLogin('dm', 'dm')
        orig = self.encounters['small']
        encounter = dict(orig)
        del encounter['id']
        page = '/encounter/api'
        rv = self.postJSON(page, encounter)
        self.assertResponse(page, rv, 200, 'application/json')
        encounterData = rv.get_json()
        self.assertIn('id', encounterData)
        self.assertNotEqual(orig['id'], encounterData['id'])
        self.assertDictContainsSubset(encounter, encounterData)
        encounterData = self.dbGetObject('encounter', encounterData['id'])
        self.assertDictContainsSubset(encounter, encounterData)

    def testCreateEncounter403(self):
        self.doLogin('player', 'player')
        encounter = dict(self.encounters['small'])
        del encounter['id']
        page = '/encounter/api'
        rv = self.postJSON(page, encounter)
        self.assertResponse(page, rv, 403)

    def testEditEncounter200(self):
        self.doLogin('dm', 'dm')
        encounter = dict(self.encounters['small'])
        encounter.update({
            'name': 'harder',
            'campaign_id': None,
            'description': 'It got tougher',
            'monster_ids': [{
                'id': self.monsters['Medium']['id'],
                'count': 2
                }],
            })
        page = '/encounter/api/%d' % encounter['id']
        rv = self.patchJSON(page, encounter)
        self.assertResponse(page, rv, 200, 'application/json')
        encounterData = rv.get_json()
        self.assertDictContainsSubset(encounter, encounterData)
        encounterData = self.dbGetObject('encounter', encounter['id'])
        self.assertDictContainsSubset(encounter, encounterData)

    def testEditEncounter403(self):
        self.doLogin('trudy', 'trudy')
        orig = self.encounters['small']
        encounter = dict(orig)
        encounter.update({
            'name': 'harder',
            'description': 'It got tougher',
            'monster_ids': [{
                'id': self.monsters['Medium']['id'],
                'count': 2
                }],
            })
        page = '/encounter/api/%d' % encounter['id']
        rv = self.patchJSON(page, encounter)
        self.assertResponse(page, rv, 403)
        encounterData = self.dbGetObject('encounter', encounter['id'])
        self.assertDictContainsSubset(orig, encounterData)

    def testDeleteEncounter200(self):
        self.doLogin('dm', 'dm')
        encounter = dict(self.encounters['small'])
        page = '/encounter/api/%d' % encounter['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 200)
        encounterData = self.dbGetObject('encounter', encounter['id'])
        self.assertIsNone(encounterData)

    def testDeleteEncounter403(self):
        self.doLogin('trudy', 'trudy')
        encounter = dict(self.encounters['small'])
        page = '/encounter/api/%d' % encounter['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 403)
        encounterData = self.dbGetObject('encounter', encounter['id'])
        self.assertDictContainsSubset(encounter, encounterData)

if __name__ == '__main__':
    unittest.main(verbosity=2)
