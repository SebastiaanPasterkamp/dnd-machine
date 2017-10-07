from base import JsonObject, JsonObjectDataMapper

from ..config import get_config, get_item_data
from dndmachine import DndMachine

class MonsterObject(JsonObject):
    def __init__(self, config={}):
        super(MonsterObject, self).__init__(
            config,
            pathPrefix = "monster",
            defaultConfig = {
                "name": u"",
                "size": u"small",
                "type": u"beast",
                "level": 1,
                "motion": {
                    "walk": 20
                    },
                "alignment": u"Neutral Evil",
                "hit_points": 2,
                "hit_points_notation": u"1d4",
                "armor_class": 10,
                "proficiency": 0,
                "passive_perception": 0,
                "traits": [],
                "features": [],
                "languages": [],
                "multiattack": [],
                "attacks": [],
                "attack_modifier": {
                    "melee": "strength",
                    "ranged": "dexterity",
                    "spell": "charisma"
                },
                "stats": {
                    "strength": 10,
                    "dexterity": 10,
                    "constitution": 10,
                    "intelligence": 10,
                    "wisdom": 10,
                    "charisma": 10
                    },
                "modifiers": {
                    "strength": 0,
                    "dexterity": 0,
                    "constitution": 0,
                    "intelligence": 0,
                    "wisdom": 0,
                    "charisma": 0
                    },
                "challenge": 0.0,
                "xp": 10
                },
            fieldTypes = {
                'xp': int,
                'level': int,
                'challenge': float,
                'average_damage': int,
                'critical_damage':int,
                'attack_bonus': int,
                'spell_save_dc': int,
                'motion': {
                    "*": int
                    },
                'traits': {
                    '*': unicode
                    },
                'multiattack': {
                    'average': int,
                    'critical': int
                    },
                'attacks': {
                    'bonus': int,
                    'spell_save_dc': int,
                    'average': int,
                    'critical': int,
                    'reach': {
                        '*': int
                        },
                    'damage': {
                        '*': int,
                        'mode': unicode,
                        'type': unicode,
                        'notation': unicode
                        }
                    },
                'hit_points': int,
                'armor_class': int,
                'proficiency': int,
                'stats': {
                    "*": int
                    },
                'modifiers': {
                    "*": int
                    }
                }
            )
        self.compute()

    def compute(self):
        config = get_config()
        machine = DndMachine(config['machine'], get_item_data())

        for stat, value in self.stats.iteritems():
            self.modifiers[stat] = (value - 10) / 2

        self.passive_perception = 10 + self.modifiersWisdom

        dice_size = machine.findByName(
            self.size, machine.size_hit_dice)['dice_size']

        self.hit_points = machine.diceAverage(
                dice_size,
                self.level,
                self.modifiersConstitution * self.level
                )

        self.hit_points_notation = machine.diceNotation(
            dice_size,
            self.level,
            self.modifiersConstitution * self.level
            )

        self.average_damage = 0
        self.critical_damage = 0
        self.attack_bonus = 0
        self.spell_save_dc = 0

        self.attacks = [
            attack
            for attack in self.attacks
            if attack.get("name", False)
            ]
        for attack in self.attacks:
            if 'range_min' in attack:
                attack['reach'] = {
                    'min': attack['range_min'],
                    'max': attack['range_max']
                    }
                del(attack['range_min'])
                del(attack['range_max'])
            if 'range' in attack:
                attack['reach'] = attack['range']
                del(attack['range'])

            attack["damage"] = [
                damage
                for damage in attack.get("damage", [])
                if damage.get("type", False)
                ]

            for damage in attack["damage"]:
                damage["mode"] = damage.get("mode", "melee")
                damage["bonus"] = self.modifiers.get(
                    self.attack_modifier.get(
                        damage["mode"], "strength"
                        ), 0
                    )
                damage.update(machine.diceCast(
                    damage["dice_size"],
                    damage["dice_count"],
                    damage["bonus"]
                    ))

            attack["damage"] = sorted(
                    attack["damage"],
                    key=lambda d: d["average"],
                    reverse=True
                    )

            attack["modifier"] = attack["damage"][0]["bonus"]
            if attack["damage"][0]["mode"] in ["melee", "ranged"]:
                attack["bonus"] = \
                    attack["modifier"] + self.proficiency
                attack["spell_save_dc"] = 0
            else:
                attack["bonus"] = 0
                attack["spell_save_dc"] = \
                    attack["modifier"] + self.proficiency

            attack["average"] = sum([
                damage["average"]
                for damage in attack["damage"]
                ])
            attack["critical"] = sum([
                damage["critical"]
                for damage in attack["damage"]
                ])
            attack["notation"] = ' + '.join([
                "%(notation)s %(type)s" % (damage)
                for damage in attack["damage"]
                ])
            if attack["average"] > self.average_damage:
                self.average_damage = attack["average"]
                self.critical_damage = attack["critical"]
                self.attack_bonus = attack.get("bonus", 0)
                self.spell_save_dc = attack.get("spell_save_dc", 0)

        self.multiattack = [
            rotation
            for rotation in self.multiattack
            if rotation.get("name", "")
            ]
        for multiattack in self.multiattack:
            multiattack["average"] = sum([
                attack["average"]
                for attack_name in multiattack["sequence"]
                for attack in self.attacks
                if attack["name"] == attack_name
                ])
            multiattack["critical"] = sum([
                attack["critical"]
                for attack_name in multiattack["sequence"]
                for attack in self.attacks
                if attack["name"] == attack_name
                ])
            if multiattack["average"] > self.average_damage:
                self.average_damage = multiattack["average"]
                self.critical_damage = multiattack["critical"]

        self.traits = [
            trait
            for trait in self.traits
            if trait and trait.get('name')
            ]

        challenge = machine.computeMonsterChallengeRating(
            self.hit_points, self.armor_class,
            self.average_damage, self.attack_bonus, self.spell_save_dc)

        if challenge['proficiency'] != self.proficiency:
            self.update(challenge)
        else:
            self.config.update(challenge)


class MonsterMapper(JsonObjectDataMapper):
    obj = MonsterObject
    table = "monster"
    fields = ['name', 'challenge_rating', 'xp_rating', 'xp']

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
        monsters = cur.fetchall() or []
        return [
            self._read(dict(monster))
            for monster in monsters
            if monster
            ]
