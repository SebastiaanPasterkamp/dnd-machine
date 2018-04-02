import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app.app import migrate

from __init__ import BaseAppTestCase

class AppPartyTestCase(BaseAppTestCase):

    def setUp(self):
        super(AppPartyTestCase, self).setUp()
        users = {
            u'alice': [u'player'],
            u'bob': [u'player'],
            u'trudy': [u'player'],
            u'dm': [u'dm']
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
                    'name': name,
                    },
                self.users[name]
                )
        self.party = self.createParty(
            {
                'name': 'test',
                'description': 'Test party',
                },
            [
                self.characters['alice'],
                self.characters['bob'],
                ],
            self.users['dm']
            )
        self.party.update({
            u'challenge': {
                u'easy': 50,
                u'medium': 100,
                u'hard': 150,
                u'deadly': 200,
                }
            })
        partyId = self.party['id']
        self.dmPages = {
            '/party/new': (200, 'text/html'),
            '/party/show/%d' % partyId: (200, 'text/html'),
            '/party/edit/%d' % partyId: (200, 'text/html'),
            '/party/hosting': (200, 'application/json'),
            }
        self.partyPages = {
            '/party/list': (200, 'text/html'),
            '/party/api/%d' % partyId: (200, 'application/json'),
            }

        migrate(self.app, ['user', 'character', 'party'])

    def testProtectedPages401(self):
        pages = {}
        pages.update(self.dmPages)
        pages.update(self.partyPages)
        for page, expected in pages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, 401)

    def testDmPages200(self):
        self.doLogin('dm', 'dm')
        for page, expected in self.dmPages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, *expected)

    def testDmPages403(self):
        self.doLogin('alice', 'alice')
        for page, expected in self.dmPages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, 403)

    def testPartyPagesDm200(self):
        self.doLogin('dm', 'dm')
        for page, expected in self.partyPages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, *expected)

    def testPartyPagesUser200(self):
        self.doLogin('alice', 'alice')
        for page, expected in self.partyPages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, *expected)

    def testPartyPages403(self):
        self.doLogin('trudy', 'trudy')
        for page, expected in self.dmPages.items():
            rv = self.client.get(page)
            self.assertResponse(page, rv, 403)

    def testPartyGet403(self):
        self.doLogin('trudy', 'trudy')
        page = '/party/api/%d' % self.party['id']
        rv = self.client.get(page)
        self.assertResponse(page, rv, 403)

    def testPartyGetAdmin200(self):
        self.doLogin('admin', 'admin')
        page = '/party/api/%d' % self.party['id']
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        partyData = rv.get_json()
        self.assertDictContainsSubset(
            self.party,
            partyData
            )

    def testRawAdmin200(self):
        self.doLogin('admin', 'admin')
        page = '/party/raw/%d' % self.party['id']
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')

    def testRawDm403(self):
        self.doLogin('dm', 'dm')
        page = '/party/raw/%d' % self.party['id']
        rv = self.client.get(page)
        self.assertResponse(page, rv, 403)

    def testListEmpty(self):
        self.doLogin('trudy', 'trudy')
        page = '/party/api'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        partyData = rv.get_json()
        self.assertEquals([], partyData)

    def testListPopulatedAdmin(self):
        self.doLogin('admin', 'admin')
        party = dict(self.party)
        page = '/party/api'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        partyData = rv.get_json()
        self.assertEquals(
            1,
            len(partyData)
            )
        self.assertDictContainsSubset(
            party,
            partyData[0]
            )

    def testListPopulatedDm(self):
        self.doLogin('dm', 'dm')
        party = dict(self.party)
        page = '/party/api'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        partyData = rv.get_json()
        self.assertEquals(
            1,
            len(partyData)
            )
        self.assertDictContainsSubset(
            party,
            partyData[0]
            )

    def testListPopulatedPlayer(self):
        self.doLogin('alice', 'alice')
        party = dict(self.party)
        del party['challenge']
        page = '/party/api'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        partyData = rv.get_json()
        self.assertEquals(
            1,
            len(partyData)
            )
        self.assertEquals(
            party,
            partyData[0]
            )
        self.assertNotIn('challenge', partyData[0])

    def testHosting(self):
        self.doLogin('dm', 'dm')
        party = dict(self.party)
        page = '/party/hosting'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        partyData = rv.get_json()
        self.assertEquals(None, partyData)

        page = '/party/host/%s' % self.party['id']
        rv = self.postJSON(page, None)
        self.assertResponse(page, rv, 302)

        page = '/party/hosting'
        rv = self.client.get(page, follow_redirects=True)
        self.assertResponse(page, rv, 200, 'application/json')
        partyData = rv.get_json()
        self.assertEquals(party, partyData)

        page = '/party/host'
        rv = self.postJSON(page, None)
        self.assertResponse(page, rv, 200, 'application/json')
        partyData = rv.get_json()
        self.assertEquals(None, partyData)

        page = '/party/hosting'
        rv = self.client.get(page)
        self.assertResponse(page, rv, 200, 'application/json')
        partyData = rv.get_json()
        self.assertEquals(None, partyData)

    def testHosting403(self):
        self.doLogin('alice', 'alice')
        party = dict(self.party)
        page = '/party/host/%s' % self.party['id']
        rv = self.postJSON(page, None)
        self.assertResponse(page, rv, 403)

    def testCreateParty200(self):
        self.doLogin('dm', 'dm')
        party = dict(self.party)
        del party['id']
        page = '/party/api'
        rv = self.postJSON(page, party)
        self.assertResponse(page, rv, 200, 'application/json')
        partyData = rv.get_json()
        self.assertIn('id', partyData)
        self.assertNotEquals(self.party['id'], partyData['id'])
        self.assertDictContainsSubset(party, partyData)
        partyData = self.dbGetObject('party', partyData['id'])
        self.assertDictContainsSubset(party, partyData)

    def testCreateParty403(self):
        self.doLogin('trudy', 'trudy')
        party = dict(self.party)
        del party['id']
        page = '/party/api'
        rv = self.postJSON(page, party)
        self.assertResponse(page, rv, 403)

    def testEditParty200(self):
        self.doLogin('dm', 'dm')
        party = dict(self.party)
        party.update({
            'name': 'Edited',
            'description': 'Hello world',
            })
        page = '/party/api/%d' % party['id']
        rv = self.patchJSON(page, party)
        self.assertResponse(page, rv, 200, 'application/json')
        partyData = rv.get_json()
        self.assertDictContainsSubset(party, partyData)
        partyData = self.dbGetObject('party', partyData['id'])
        self.assertDictContainsSubset(party, partyData)

    def testEditParty403(self):
        self.doLogin('trudy', 'trudy')
        party = dict(self.party)
        party.update({
            'name': 'Edited',
            'description': 'Hello world',
            })
        page = '/party/api/%d' % party['id']
        rv = self.patchJSON(page, party)
        self.assertResponse(page, rv, 403)
        partyData = self.dbGetObject('party', self.party['id'])
        self.assertDictContainsSubset(self.party, partyData)

    def testDeleteParty200(self):
        party = dict(self.party)
        self.doLogin('dm', 'dm')
        page = '/party/api/%d' % party['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 200)
        partyData = self.dbGetObject('party', party['id'])
        self.assertIsNone(partyData)

    def testDeleteParty403(self):
        party = dict(self.party)
        self.doLogin('bob', 'bob')
        page = '/party/api/%d' % party['id']
        rv = self.client.delete(page)
        self.assertResponse(page, rv, 403)
        partyData = self.dbGetObject('party', party['id'])
        self.assertDictContainsSubset(party, partyData)

    def testPartyXp(self):
        party = dict(self.party)
        xp = 1200
        self.doLogin('dm', 'dm')
        page = '/party/xp/%d/%d' % (party['id'], xp)
        rv = self.client.get(page)
        self.assertResponse(page, rv, 302)
        for charId in party['member_ids']:
            charData = self.dbGetObject('character', charId)
            self.assertEquals(
                charData['xp'],
                xp / len(party['member_ids'])
                )

    def testPartyXp404(self):
        party = dict(self.party)
        xp = 1200
        self.doLogin('dm', 'dm')
        page = '/party/xp/%d/%d' % (999, xp)
        rv = self.client.get(page)
        self.assertResponse(page, rv, 404)

    def testPartyXp403(self):
        party = dict(self.party)
        xp = 1200
        self.doLogin('bob', 'bob')
        page = '/party/xp/%d/%d' % (party['id'], xp)
        rv = self.client.get(page)
        self.assertResponse(page, rv, 403)
        for charId in party['member_ids']:
            charData = self.dbGetObject('character', charId)
            self.assertEquals(charData['xp'], 0)

if __name__ == '__main__':
    unittest.main(verbosity=2)
