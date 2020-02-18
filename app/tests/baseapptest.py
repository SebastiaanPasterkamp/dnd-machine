import unittest
import os
import sys
import json
from flask import Response as BaseResponse
from passlib.hash import pbkdf2_sha256

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app import create_app, _initdb
from config import get_config

class Response(BaseResponse):
    def get_json(self):
        try:
            return json.loads(self.get_data())
        except:
            return None

class BaseAppTestCase(unittest.TestCase):

    def setUp(self):
        config = get_config()
        config.update({
            'DATABASE': 'file:memory.db?mode=memory&cache=shared',
            'MAX_CONNECTIONS': 2,
            'SERVER_NAME': 'localhost.localdomain:5000',
            'TESTING': True,
            'DEBUG': True,
            })

        self.app = create_app(config)
        self.app.response_class = Response
        self.client = self.app.test_client(use_cookies=True)
        self.app.testing = True
        with self.app.db.connect() as db:
            _initdb(db)

    def tearDown(self):
        self.app.db.close()

    def createUser(self, user):
        password = user.get('password')
        try:
            user['password'] = pbkdf2_sha256.hash(password)
        except AttributeError:
            user['password'] = pbkdf2_sha256.encrypt(password)

        recovery = user.get('recovery')
        if recovery:
            try:
                user['recovery'] = pbkdf2_sha256.hash(recovery)
            except AttributeError:
                user['recovery'] = pbkdf2_sha256.encrypt(recovery)

        return self.dbInsertObject(
            'user',
            user,
            ['username', 'password', 'email']
            )

    def createCharacter(self, character, user):
        obj = {
            'user_id': user['id'],
            'race': 'Human',
            'class': 'Fighter',
            'background': 'Soldier',
            'xp': 0,
            'level': 1,
            'hit_dice': 10,
            'info': {},
            'languages': ['common'],
            'equipment': [
                'Leather Armor',
                'Handaxe',
                ],
            'proficiencies': {
                'armor': ['Leather Armor'],
                'weapons': ['Handaxe'],
                },
            }
        obj.update(character)
        obj = self.dbInsertObject(
            'character',
            obj,
            ['name', 'user_id', 'level']
            )
        return obj

    def createParty(self, party, members, dm):
        obj = {
            'user_id': dm['id'],
            'size': len(members),
            'member_ids': [char['id'] for char in members],
            }
        obj.update(party)
        obj = self.dbInsertObject(
            'party',
            obj,
            ['name', 'user_id']
            )
        for char in members:
            self.dbInsertLink('party_characters', {
                'party_id': obj['id'],
                'character_id': char['id'],
                })
        return obj

    def createMonster(self, monster):
        obj = {
            "name": "Monster",
            "size": "medium",
            "type": "Beast",
            "alignment": "neutral evil",
            "level": 3,
            "armor_class": 13,
            "attacks": [{
                "name": "Smash",
                "target": "single",
                "damage": [{
                    "dice_count": 1,
                    "dice_size": 4,
                    "mode": "melee",
                    "type": "bludgeoning"
                    }],
                }],
            "motion": {
                "walk": 20
                },
            "challenge_rating": 0.125,
            "xp": 25,
            "xp_rating": 18,
            }
        obj.update(monster)
        return self.dbInsertObject(
            'monster',
            obj,
            ['name', 'campaign_id', 'challenge_rating', 'xp_rating', 'xp']
            )

    def createNpc(self, npc):
        obj = {
            "name": "NPC",
            "size": "medium",
            "race": "Human",
            "gender": "male",
            "location": "",
            "organization": "",
            "class": "",
            "alignment": "true neutral",
            "level": 1,
            }
        obj.update(npc)
        return self.dbInsertObject(
            'npc',
            obj,
            ['name', 'campaign_id', 'location', 'organization']
            )

    def createEncounter(self, encounter, monster_ids, monsters, dm):
        obj = {
            'user_id': dm['id'],
            'size': sum(
                count
                for count in list(monster_ids.values())
                ),
            'monster_ids': [
                {'id': monsters[name]['id'], 'count': count}
                for name, count in list(monster_ids.items())
                ],
            'challenge_rating': 0.0,
            'xp_rating': 0,
            'xp': 0,
            }
        obj.update(encounter)
        obj = self.dbInsertObject(
            'encounter',
            obj,
            [
                'name', 'campaign_id', 'user_id', 'size',
                'challenge_rating', 'xp_rating', 'xp'
                ]
            )
        # Incorrect value at this point
        del obj['challenge_rating']
        del obj['xp_rating']
        del obj['xp']
        for name, count in list(monster_ids.items()):
            self.dbInsertLink('encounter_monsters', {
                'encounter_id': obj['id'],
                'monster_id': monsters[name]['id'],
                'count': count,
                })
        return obj

    def createCampaign(self, campaign):
        return self.dbInsertObject(
            'campaign',
            campaign,
            ['name', 'user_id'],
            )

    def dbInsertObject(self, table, obj, columns=[]):
        data = dict(
            (key, value)
            for key, value in obj.items()
            if key in columns
            )
        data['config'] = json.dumps(dict(
            (key, value)
            for key, value in obj.items()
            if key not in columns
            ))

        with self.app.db.connect() as db:
            result = db.execute("""
                INSERT INTO `%s`
                    (`%s`)
                VALUES
                    (:%s)
                """ % (
                    table,
                    '`, `'.join(list(data.keys())),
                    ', :'.join(list(data.keys())),
                    ),
                data
                )
            db.commit()
        return self.dbGetObject(table, result.lastrowid)

    def dbInsertLink(self, table, data={}):
        with self.app.db.connect() as db:
            result = db.execute("""
                INSERT INTO `%s` (`%s`)
                VALUES (:%s)
                """ % (
                    table,
                    '`, `'.join(list(data.keys())),
                    ', :'.join(list(data.keys())),
                    ),
                data
                )
            db.commit()

    def dbGetObject(self, table, objId):
        with self.app.db.connect() as db:
            rows = db.execute("""
                SELECT *
                FROM `%s`
                WHERE `id` = :objId
                """ % table,
                {
                    'objId': objId,
                    }
                )
            obj = rows.fetchone()
        if obj is None:
            return None
        obj = dict(obj)
        obj.update(json.loads(obj['config']))
        del obj['config']
        return obj

    def assertResponse(self, page, rv, code, mimetype=None):
        self.assertEqual(
            rv.status_code,
            code,
            "%s: returns status code %r (not %r)" % (
                page,
                code,
                rv.status_code,
                )
            )
        if mimetype:
            self.assertEqual(
                rv.mimetype,
                mimetype,
                "%s: has mimetype %r (not %r)" % (
                    page,
                    mimetype,
                    rv.mimetype,
                    )
                )

    def postJSON(self, path, data):
        return self.client.post(
            path,
            data=json.dumps(data),
            content_type='application/json',
            headers={'Accept': 'application/json'},
            )

    def patchJSON(self, path, data):
        return self.client.patch(
            path,
            data=json.dumps(data),
            content_type='application/json',
            headers={'Accept': 'application/json'},
            )

    def doLogin(self, username, password):
        return self.postJSON('/login', {
            'username': username,
            'password': password,
            })

    def doLogout(self, follow_redirects=True):
        return self.client.get(
            '/logout',
            follow_redirects=follow_redirects,
            headers={'Accept': 'application/json'},
            )

if __name__ == '__main__':
    unittest.main()
