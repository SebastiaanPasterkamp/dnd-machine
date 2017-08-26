from flask import g
import json
import sqlite3
from passlib.hash import pbkdf2_sha256 as password
import parser
import re

from .config import get_config, get_item_data

def connect_db():
    """Connects to the specific database.
    """
    config = get_config()
    rv = sqlite3.connect(config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv

def get_db():
    """Opens a new database connection if there is none yet for the
    current application context.
    """
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

def markdownToToc(markdown):
    re_titles = re.compile('^(#+) (.*)', re.M)
    root = []
    level = 1

    current = root
    for match in re_titles.finditer(markdown):
        depth, title = match.groups()
        while len(depth) > level:
            if 'children' not in current[-1]:
                current[-1]['children'] = []
            current = current[-1]['children']
            level += 1
        if len(depth) > level:
            current = root
            level = len(depth)
            for _ in range(level):
                current = current[-1]['children']
        current.append({'title': title})
    return root

def datamapper_factory(datamapper):
    """Returns a datamapper for a type.
    """
    config = get_config()
    if datamapper == 'machine':
        return DndMachine(config['machine'])
    if datamapper == 'user':
        return UserMapper(get_db())
    if datamapper == 'party':
        return PartyMapper(get_db())
    if datamapper == 'character':
        return CharacterMapper(get_db(), config['character'])
    if datamapper == 'encounter':
        return EncounterMapper(get_db(), config['encounter'])
    if datamapper == 'monster':
        return MonsterMapper(get_db(), config['monster'])
    if datamapper == 'campaign':
        return CampaignMapper(get_db())
    raise ValueError("No datamapper for %s" % datamapper)

def mergeDict(a, b, path=None):
    "merges b into a"
    if path is None: path = []

    if not isinstance(a, dict) or not isinstance(b, dict):
        raise Exception("Conflict: a (%s) or b (%s) is not a dict" % (
            type(a), type(b)
            ))

    for key in b:
        if key in a:
            if isinstance(a[key], dict) and isinstance(b[key], dict):
                mergeDict(a[key], b[key], path + [str(key)])
            elif type(a[key]) != type(b[key]):
                raise Exception('Conflict at %s: %s vs %s' % (
                    '.'.join(path + [key]),
                    type(a[key]), type(b[key])
                    ))
        else:
            a[key] = b[key]
    return a


def resolveMath(obj, formula):
    replace = {}
    for m in re.finditer(ur'[a-z.]+', formula):
        replace[m.group(0)] = DataMapper.getPath(obj, m.group(0))
    for var, val in replace.iteritems():
        formula = formula.replace(var, str(val))
    code = parser.expr(formula).compile()
    return eval(code)

class DataMapper(object):
    table = None
    fields = []
    keepFields = []
    typeCastDefault = unicode
    typeCast = {}
    form_prefix = 'obj'

    def __init__(self, db):
        self.db = db
        self._steps = {}

    def _getType(self, path):
        path = path.split('.')
        if path[0] == self.form_prefix:
            path = '.'.join(path[1:])
        else:
            path = '.'.join(path)

        if path == 'id':
            return int
        typeCast = DataMapper.getPath(
            self.typeCast,
            path,
            self.typeCastDefault
            )
        return typeCast

    @staticmethod
    def getPath(structure, path, default=None):
        path = [
            step
            for step in path.split('.')
            if not step.isdigit()
            ]
        rv = structure
        for step in path:
            if isinstance(rv, dict):
                if step not in rv:
                    return default
                rv = rv[step]
            else:
                raise Exception("No dict or list '%r': %r" % (path, rv))
        return rv

    def setPath(self, structure, path, value):
        path = path.split('.')
        if path[0] != self.form_prefix:
            return

        if 'equipment' in path:
            print path, '=', value

        rv = structure
        for i in range(1, len(path)-1):
            step = path[i]
            next_type = dict
            if path[i+1].isdigit() or path[i+1].startswith('+'):
                next_type = list

            if step.isdigit() or step.startswith('+'):
                if not isinstance(rv, list):
                    raise Exception("Not a list at %s %r: %r" % (step, path, rv))
                if step.isdigit():
                    step = int(step)
                else:
                    key = step
                    step = self._steps.get(key, len(rv) + 1)
                    self._steps[key] = step
                rv.extend([
                    next_type()
                    for i in range(step - len(rv))
                    ])
            else:
                if not isinstance(rv, dict):
                    raise Exception("Not a dict at %s %r: %r" % (step, path, rv))
                if step not in rv:
                    rv[step] = next_type()
            rv = rv[step]

        step = path[-1]
        if step.isdigit() or step.startswith('+'):
            if not isinstance(rv, list):
                raise Exception("Not a list at %s %r: %r" % (step, path, rv))
            if step.isdigit():
                step = int(step)
            else:
                key = step
                step = self._steps.get(key, len(rv))
                self._steps[key] = step
            rv.extend([
                None
                for i in range(step - len(rv) + 1)
                ])

        rv[step] = value

    def setDefaults(self, obj):
        return obj

    def fromPost(self, form, old={}):
        self._steps = {}
        obj = self.setDefaults(old)
        for path, value in form.iteritems():
            cast = self._getType(path)
            if not len(value) and cast == int:
                continue
            value = cast(value)
            self.setPath(obj, path, value)
        for keep in self.keepFields + ['id']:
            if not obj.get(keep) and keep in old:
                obj[keep] = old[keep]
        return obj

    def _read(self, obj):
        if obj is None \
                or not isinstance(obj, dict) \
                or 'config' not in obj:
            raise ValueError("Invalid object: %r" % obj)
        if not obj['config']:
            obj['config'] = '{}'

        obj['config'] = json.loads(obj['config'])
        for field in self.fields + ['id']:
            if field in obj:
                cast = self._getType(field)
                if not len(field) and cast == int:
                    continue
                obj['config'][field] = cast(obj[field])
        return obj['config']

    def _write(self, obj):
        if obj is None \
                or not isinstance(obj, dict):
            raise ValueError("Invalid object: %r" % obj)

        new_obj = dict(
            (field, obj[field])
            for field in self.fields
            if field in obj
            )
        new_obj['config'] = dict(
            (field, value)
            for field, value in obj.iteritems()
            if field not in self.fields
            )
        if 'id' in obj:
            new_obj['id'] = obj['id']
            del(new_obj['config']['id'])
        new_obj['config'] = json.dumps(new_obj['config'])
        return new_obj

    def getById(self, obj_id):
        """Returns an object from table by obj_id"""
        cur = self.db.execute("""
            SELECT *
            FROM `%s`
            WHERE `id` = ?
            """ % self.table,
            [obj_id]
            )
        obj = cur.fetchone()
        if obj is None:
            return None
        obj = self._read(dict(obj))
        obj = self.setDefaults(obj)
        return obj

    def getMultiple(self, where="1", values={}):
        """Returns a list of obj matching the where clause"""
        cur = self.db.execute("""
            SELECT * FROM `%s` WHERE %s
            """ % (self.table, where),
            values
            )
        objs = cur.fetchall() or []
        objs = [
            self._read(dict(obj))
            for obj in objs
            ]
        objs = [
            self.setDefaults(obj)
            for obj in objs
            ]
        return objs

    def save(self, obj):
        """Insert or Update an obj"""
        if obj["id"]:
            return self.update(obj)
        return self.insert(obj)

    def insert(self, obj):
        """Insert a new obj"""
        new_obj = self._write(obj)

        cur = self.db.execute("""
            INSERT INTO `%s`
                (`config`, %s)
            VALUES
                (:config, %s)
            """ % (
                self.table,
                ', '.join(["`%s`" % f for f in self.fields]),
                ', '.join([":%s" % f for f in self.fields])
                ),
            new_obj
            )
        self.db.commit()
        return self.getById(cur.lastrowid)

    def update(self, obj):
        """Updates an existing obj"""
        new_obj = self._write(obj)

        cur = self.db.execute("""
            UPDATE `%s`
            SET `config` = :config, %s
            WHERE `id` = :id
            """ % (
                self.table,
                ', '.join(["`%s` = :%s" % (f, f) for f in self.fields])
                ),
            new_obj
            )
        self.db.commit()
        return self.getById(obj['id'])

    def delete(self, obj):
        """Deletes an object from the table"""
        cur = self.db.execute("""
            DELETE
            FROM `%s`
            WHERE `id` = ?
            """ % self.table,
            [obj['id']]
            )
        self.db.commit()


class UserMapper(DataMapper):
    form_prefix = "user"
    table = "users"
    fields = ['username', 'password', 'email']
    keepFields = ['username', 'password', 'role']
    typeCastDefault = unicode
    typeCast = {}

    def fromPost(self, form, old={}):
        user = super(UserMapper, self).fromPost(form, old)
        if len(user['password']):
            try:
                user['password'] = password.hash(user['password'])
            except AttributeError:
                user['password'] = password.encrypt(user['password'])
            else:
                user['password'] = old['password']
        else:
            user['password'] = old['password']
        return user

    def getList(self, search=None):
        """Returns a list of users matching the search parameter"""
        return self.getMultiple(
            "`username` LIKE :search OR `email` LIKE :search",
            {"search": '%%%s%%' % search}
            )

    def getByExactMatch(self, search=None):
        """Returns a user by exact name or email"""
        cur = self.db.execute("""
            SELECT id
            FROM `%s`
            WHERE `name` = ? or email = ?
            """ % self.table,
            [search, search]
            )
        obj = cur.fetchone()
        if obj is None:
            return None
        obj = dict(obj)
        return self.getById(obj['id'])


class CharacterMapper(DataMapper):
    form_prefix = "character"
    table = "character"
    fields = ['name', 'level']
    keepFields = ['user_id', 'race', 'class', 'background', 'base_stats', 'stats_bonus', 'xp']
    typeCast = {
        'level': int,
        'user_id': int,
        "xp": int,
        'base_stats': {
            'strength': int,
            'dexterity': int,
            'constitution': int,
            'intelligence': int,
            'wisdom': int,
            'charisma': int
            },
        'stats_bonus': {
            'strength': int,
            'dexterity': int,
            'constitution': int,
            'intelligence': int,
            'wisdom': int,
            'charisma': int
            },
        'stats': {
            'strength': int,
            'dexterity': int,
            'constitution': int,
            'intelligence': int,
            'wisdom': int,
            'charisma': int
            },
        'modifiers': {
            'strength': int,
            'dexterity': int,
            'constitution': int,
            'intelligence': int,
            'wisdom': int,
            'charisma': int
            }
        }

    def __init__(self, db, config):
        super(CharacterMapper, self).__init__(db)
        self.defaultConfig = config["default"]

    def setDefaults(self, character):
        if 'skills' in character \
                and isinstance(character['skills'], list):
            character['proficiencies']['skills'] = character['skills']
            character['skills'] = {}
        character = mergeDict(character, self.defaultConfig)
        return character

    def getList(self, search=None):
        """Returns a list of characters matching the search parameter"""
        return self.getMultiple(
            "`name` LIKE :search",
            {"search": '%%%s%%' % search}
            )

    def getByPartyId(self, party_id):
        """Returns all characters in a party by party_id"""
        cur = self.db.execute("""
            SELECT c.*
            FROM `party_characters` AS pc
            JOIN `%s` AS c ON (pc.character_id=c.id)
            WHERE `party_id` = ?
            """ % self.table,
            [party_id]
            )
        characters = cur.fetchall() or []
        return [
            self.setDefaults(self._read(dict(character)))
            for character in characters
            ]

    def getByUserId(self, user_id):
        """Returns all characters from a user by user_id"""
        cur = self.db.execute("""
            SELECT c.*
            FROM `user_characters` AS uc
            JOIN `%s` AS c ON (uc.character_id=c.id)
            WHERE `user_id` = ?
            """ % self.table,
            [user_id]
            )
        characters = cur.fetchall() or []
        return [
            self.setDefaults(self._read(dict(character)))
            for character in characters
            ]


class PartyMapper(DataMapper):
    form_prefix = "party"
    table = "party"
    fields = ['name', 'user_id']
    keepFields = ['user_id']
    typeCast = {
        'user_id': int}

    def getList(self, search=None):
        """Returns a list of parties matching the search parameter"""
        return self.getMultiple(
            "`name` LIKE :search",
            {"search": '%%%s%%' % search}
            )

    def getByDmUserId(self, user_id):
        """Returns all parties run by the DM by user_id"""
        cur = self.db.execute("""
            SELECT *
            FROM `%s`
            WHERE `user_id` = ?
            """ % self.table,
            [user_id]
            )
        parties = cur.fetchall() or []
        return [
            self._read(dict(party))
            for party in parties
            ]

    def getByUserId(self, user_id):
        """Returns all parties where a user by user_id
        has characters involved"""
        cur = self.db.execute("""
            SELECT p.*
            FROM `%s` AS p
            JOIN `party_characters` AS pc ON (p.id=pc.party_id)
            JOIN `user_characters` AS uc USING (character_id)
            WHERE uc.`user_id` = ?
            """ % self.table,
            [user_id]
            )
        parties = cur.fetchall() or []
        return [
            self._read(dict(party))
            for party in parties
            ]

    def addCharacter(self, party_id, character_id):
        """Add character to party"""
        cur = self.db.execute("""
            INSERT INTO `party_characters` (`party_id`, `character_id`)
            VALUES (?, ?)
            """,
            [party_id, character_id]
            )
        self.db.commit()

    def delCharacter(self, party_id, character_id):
        """Removes character from party"""
        cur = self.db.execute("""
            DELETE FROM `party_characters`
            WHERE
                `party_id` = ?
                AND `character_id` = ?
            """,
            [party_id, character_id]
            )
        self.db.commit()


class MonsterMapper(DataMapper):
    form_prefix = "monster"
    table = "monster"
    fields = ['name', 'challenge_rating', 'xp_rating', 'xp']
    typeCastDefault = int
    typeCast = {
        'name': unicode,
        'challenge_rating': float,
        'xp_rating': float,
        'xp': int,
        'size': unicode,
        'type': unicode,
        'alignment': unicode,
        'languages': unicode,
        'attacks': {
            'name': unicode,
            'description': unicode,
            'damage': {
                'type': unicode
            },
            'mode': unicode,
            'target': unicode,
            'on_hit': unicode,
            'on_mis': unicode
            },
        'multiattack': {
            'name': unicode,
            'description': unicode,
            'condition': unicode,
            'sequence': unicode
            }
        }

    def __init__(self, db, config):
        super(MonsterMapper, self).__init__(db)
        self.defaultConfig = config["default"]

    def setDefaults(self, monster):
        monster = mergeDict(monster, self.defaultConfig)
        return monster

    def getList(self, search=None):
        """Returns a list of parties matching the search parameter"""
        return self.getMultiple(
            "`name` LIKE :search",
            {"search": '%%%s%%' % search}
            )

    def getByEncounterId(self, encounter_id):
        """Returns all monsters in an encounter by encounter_id"""
        cur = self.db.execute("""
            SELECT m.*
            FROM `encounter_monsters` AS em
            JOIN `monster` AS m ON (em.monster_id=m.id)
            WHERE `encounter_id` = ?
            """,
            [encounter_id]
            )
        monsters = [
            self.setDefaults(self._read(dict(m)))
            for m in cur.fetchall() or []
            ]
        return monsters


class EncounterMapper(DataMapper):
    form_prefix = "encounter"
    table = "encounter"
    fields = ['name', 'user_id', 'size', 'challenge_rating', 'xp_rating', 'xp']
    keepFields = ['user_id', 'size', 'challenge_rating', 'xp_rating', 'xp']
    typeCast = {
        'user_id': int,
        'size': int,
        'challenge_rating': float,
        'xp_rating': float,
        'xp': int
        }

    def __init__(self, db, config):
        super(EncounterMapper, self).__init__(db)
        self.encounter_modifiers = config["encounter_modifiers"]

    def getList(self, search=None):
        """Returns a list of encounters matching the search parameter"""
        return self.getMultiple(
            "`name` LIKE :search",
            {"search": '%%%s%%' % search}
            )

    def getByDmUserId(self, user_id):
        """Returns all encounterx created by DM by user_id"""
        cur = self.db.execute("""
            SELECT *
            FROM `%s`
            WHERE `user_id` = ?
            """ % self.table,
            [user_id]
            )
        encounters = cur.fetchall() or []
        return [
            self._read(dict(encounter))
            for encounter in encounters
            ]

    def addMonster(self, encounter_id, monster_id):
        """Add monster to encounter"""
        cur = self.db.execute("""
            INSERT INTO `encounter_monsters` (`encounter_id`, `monster_id`)
            VALUES (?, ?)
            """,
            [encounter_id, monster_id]
            )
        self.db.commit()

    def delMonster(self, encounter_id, monster_id):
        """Remopves monster from encounter"""
        cur = self.db.execute("""
            DELETE FROM `encounter_monsters`
            WHERE
                `encounter_id` = ?
                AND `monster_id` = ?
                LIMIT 1
            """,
            [encounter_id, monster_id]
            )
        self.db.commit()

    def modifierByPartySize(self, size):
        for data in self.encounter_modifiers['party']:
            if data['min'] <= size <= data['max']:
                return data['modifier']
        return 0.0

    def modifierByEncounterSize(self, size):
        for data in self.encounter_modifiers['encounter']:
            if data['min'] <= size <= data['max']:
                return data['modifier']
        return 1.0

    def computeChallenge(self, encounter, monsters=[], party=None):
        encounter["size"] = len(monsters)
        encounter['modifier'] = {
            'party': self.modifierByPartySize(party['size']) if party else 0.0,
            'monster': self.modifierByEncounterSize(encounter['size'])
            }
        encounter['modifier']['total'] = sum(encounter['modifier'].values())

        encounter['challenge_rating'] = sum([
            m['challenge_rating']
            for m in monsters
            ]) * encounter['modifier']['monster']
        encounter['challenge_modified'] = sum([
            m['challenge_rating']
            for m in monsters
            ]) * encounter['modifier']['total']
        encounter['xp'] = sum([
            m['xp']
            for m in monsters
            ])
        encounter['xp_rating'] = sum([
            m['xp_rating']
            for m in monsters
            ]) * encounter['modifier']['monster']
        encounter['xp_modified'] = sum([
            m['xp_rating']
            for m in monsters
            ]) * encounter['modifier']['total']
        return encounter

class CampaignMapper(DataMapper):
    form_prefix = "campaign"
    table = "campaign"
    fields = ['name', 'user_id']
    keepFields = ['name', 'user_id']
    typeCast = {
        'user_id': int
        }

    def getList(self, search=None):
        """Returns a list of campaigns matching the search parameter"""
        return self.getMultiple(
            "`name` LIKE :search",
            {"search": '%%%s%%' % search}
            )

    def getByDmUserId(self, user_id):
        """Returns all campaigns created by DM by user_id"""
        cur = self.db.execute("""
            SELECT *
            FROM `%s`
            WHERE `user_id` = ?
            """ % self.table,
            [user_id]
            )
        campaigns = cur.fetchall() or []
        return [
            self._read(dict(campaign))
            for campaign in campaigns
            ]

class DndMachine(object):
    def __init__(self, config):
        self.xp_at_level = config['xp_at_level']
        self.challenge_rating = config["challenge_rating"]
        self.monster_scaling = config["monster_scaling"]
        self.size_hit_dice = config["size_hit_dice"]
        self.attack_modifier = config["attack_modifier"]
        self.monster_types = config["monster_types"]

    def diceAverage(self, size, number=1, bonus=0):
        return number * ((size+1)/2) + bonus

    def diceCritical(self, size, number=1, bonus=0):
        return number * size + number * ((size+1)/2) + bonus

    def diceNotation(self, number, size, bonus=0):
        notation = []
        if number:
            notation.append("%dd%d" % (number, size))
        if bonus:
            notation.append("%d" % bonus)
        return '+'.join(notation)

    def xpAtLevel(self, level):
        return self.xp_at_level[str(level)]

    def challengeByLevel(self, level, formula=False):
        """Returns the Challenge Rating in XP by level
        use formula=True to use a mathematical approach,
        use formula=False to use a lookup table"""

        challenge = self.challenge_rating['scale']["1"]
        if formula:
            challenge = [
                self.challenge_rating['linear'] * i * level \
                    + self.challenge_rating['power'] * i * level**2 \
                    + self.challenge_rating['offset'] * i
                for i in range(len(self.challenge_rating['ratings']))
                ]
            return dict(zip(
            ['easy', 'medium', 'hard', 'deadly'],
            challenge
            ))
        elif str(level) in self.challenge_rating['scale']:
            challenge = self.challenge_rating['scale'][str(level)]

        return dict(zip(
            self.challenge_rating['ratings'],
            challenge
            ))

    def monsterStatByChallengeRating(self, challenge_rating, stat=None):
        data = min(
            self.monster_scaling,
            key=lambda data: abs(data['challenge'] - challenge_rating)
            )
        if stat is not None:
            return data.get(stat, None)
        return data

    def monsterChallengeRatingByStat(self, stat, value, target=None):
        indexes = []
        for index in range(len(self.monster_scaling)):
            data = self.monster_scaling[index]
            if data[stat]['min'] <= value <= data[stat]['max']:
                indexes.append(index)
        if not indexes:
            return 0, 0
        if target is None:
            index = indexes[0]
        else:
            index = min(indexes, key=lambda i: abs(i - target))
        data = self.monster_scaling[index]
        return data["challenge"], index

    def computeCharacterStatistics(self, character):
        items = get_item_data()
        character_mapper = datamapper_factory('character')

        for stat in items["statistics"]:
            stat = stat["name"]
            character["stats"][stat] = character["base_stats"][stat] \
                + character["stats_bonus"][stat]
            character["modifiers"][stat] = int(
                (character["stats"][stat] - 10) / 2
                )

        for skill in items["skills"]:
            stat, skill = skill["stat"], skill["name"]
            character["skills"][skill] = character["stats"][stat]
            if skill in character["proficiencies"]["skills"]:
                character["skills"][skill] += character["proficiency"]

        for path, compute in character["computed"].iteritems():
            value = resolveMath(character, compute.get("formula", ""))
            for bonus in compute.get('bonus', []):
                value += resolveMath(character, bonus)
            character_mapper.setPath(character, 'character.' + path, value)

        cr = self.challengeByLevel(character['level'])
        character.update(cr)

        character['xp_level'] = self.xpAtLevel(character['level'])
        character['xp_next_level'] = \
            self.xpAtLevel(character['level'] + 1)

        return character

    def computeMonsterStatistics(self, monster):
        for stat, value in monster["stats"].iteritems():
            monster["modifiers"][stat] = (value - 10) / 2

        monster["hit_points"] = self.diceAverage(
                self.size_hit_dice.get(monster["size"], 4),
                monster["level"],
                monster["modifiers"]["constitution"] * monster["level"]
                )

        monster["hit_points_notation"] = self.diceNotation(
            monster["level"],
            self.size_hit_dice.get(monster["size"], 4),
            monster["modifiers"]["constitution"] * monster["level"]
            )

        monster["average_damage"] = 0
        monster["critical_damage"] = 0
        monster["attack_bonus"] = 0
        monster["spell_save_dc"] = 0

        monster["attacks"] = [
            attack
            for attack in monster["attacks"]
            if attack.get("name", "")
            ]
        primary_attack = monster["proficiency"]
        for attack in monster["attacks"]:
            attack_method = attack.get("method", "melee")

            attack["modifier"] = monster["modifiers"].get(
                self.attack_modifier.get(attack_method, "strength"), 0
                ) + primary_attack
            attack["bonus"] = attack["modifier"] \
                if attack_method in ["melee", "ranged"] \
                else 0
            attack["spell_save_dc"] = attack["modifier"] \
                if attack_method not in ["melee", "ranged"] \
                else 0

            attack["damage"] = [
                damage
                for damage in attack.get("damage", [])
                if any(damage.get(n, 0)
                       for n in ['dice_count', 'bonus']
                       )
                ]
            default_bonus = attack['modifier']
            for damage in attack["damage"]:
                damage["average"] = self.diceAverage(
                    damage["dice_size"],
                    damage["dice_count"],
                    default_bonus \
                            if default_bonus \
                            else damage.get('bonus', 0)
                    )
                damage["notation"] = self.diceNotation(
                    damage["dice_count"],
                    damage["dice_size"],
                    default_bonus \
                            if default_bonus \
                            else damage.get('bonus', 0)
                    )
                damage["critical"] = self.diceCritical(
                    damage["dice_size"],
                    damage["dice_count"],
                    default_bonus \
                            if default_bonus \
                            else damage.get('bonus', 0)
                    )
                # Primary attack gets stats modifier as bonus
                default_bonus = 0
            attack["average"] = sum([
                damage["average"]
                for damage in attack["damage"]
                ])
            attack["notation"] = ' + '.join([
                "%(notation)s %(type)s" % (damage)
                for damage in sorted(
                    attack["damage"],
                    key=lambda d: d["average"],
                    reverse=True
                    )
                ])
            attack["critical"] = sum([
                damage["critical"]
                for damage in attack["damage"]
                ]) + attack["modifier"]
            if attack["average"] > monster["average_damage"]:
                monster["average_damage"] = attack["average"]
                monster["attack_bonus"] = attack["bonus"]
                monster["critical_damage"] = attack["critical"]
                monster["spell_save_dc"] = attack["spell_save_dc"]

        monster["multiattack"] = [
            rotation
            for rotation in monster["multiattack"]
            if rotation.get("name", "")
            ]
        for multiattack in monster["multiattack"]:
            multiattack["average"] = sum([
                attack["average"]
                for attack_name in multiattack["sequence"]
                for attack in monster["attacks"]
                if attack["name"] == attack_name
                ])
            multiattack["critical"] = sum([
                attack["critical"]
                for attack_name in multiattack["sequence"]
                for attack in monster["attacks"]
                if attack["name"] == attack_name
                ])
            if multiattack["average"] > monster["average_damage"]:
                monster["average_damage"] = multiattack["average"]
                monster["critical_damage"] = multiattack["critical"]
                monster["attack_bonus"] = max([
                    attack["modifier"]
                    for attack_name in multiattack["sequence"]
                    for attack in monster["attacks"]
                    if attack["name"] == attack_name
                    ])
                monster["spell_save_dc"] = max([
                    attack["spell_save_dc"]
                    for attack_name in multiattack["sequence"]
                    for attack in monster["attacks"]
                    if attack["name"] == attack_name
                    ])

        hp, hp_i = self.monsterChallengeRatingByStat(
            "hit_points", monster["hit_points"]
            )
        ac, ac_i = self.monsterChallengeRatingByStat(
            "armor_class", monster["armor_class"], hp_i
            )
        ad, ad_i = self.monsterChallengeRatingByStat(
            "average_damage", monster["average_damage"]
            )
        ab, ab_i = self.monsterChallengeRatingByStat(
            "attack_bonus", monster["attack_bonus"], ad_i
            )
        dc, dc_i = self.monsterChallengeRatingByStat(
            "spell_save_dc", monster["spell_save_dc"], ad_i
            )

        defensive = hp + (ac - hp) / 2.0
        offensive = ad + max([(ab - ad) / 2.0, (dc - ad) / 2.0])
        challenge_rating = (defensive + offensive) / 2.0

        monster["challenge_rating"] = challenge_rating
        monster["proficiency"] = self.monsterStatByChallengeRating(
            challenge_rating, "proficiency"
            )
        monster["xp"] = self.monsterStatByChallengeRating(
            challenge_rating, "xp"
            )
        monster["xp_rating"] = monster["xp"]

        return monster
