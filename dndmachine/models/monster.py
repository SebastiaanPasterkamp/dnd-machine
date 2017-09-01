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
                "proficiency": 2,
                "traits": [],
                "features": [],
                "languages": [],
                "multiattack": [],
                "attacks": [
                    {"damage": []}
                    ],
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
            defaultFieldType = int,
            fieldTypes = {
                'name': unicode,
                'challenge_rating': float,
                'xp_rating': float,
                'xp': int,
                'size': unicode,
                'type': unicode,
                'alignment': unicode,
                'languages': unicode,
                'traits': {
                    'name': unicode,
                    'description': unicode
                    },
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
            )

    def compute(self):
        config = get_config()
        machine = DndMachine(config['machine'])

        for stat, value in self.stats.iteritems():
            self.modifiers[stat] = (value - 10) / 2

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
            if attack.get("name", "")
            ]
        for attack in self.attacks:
            attack_method = attack.get("method", "melee")

            attack["modifier"] = self.modifiers.get(
                machine.attack_modifier.get(attack_method, "strength"), 0
                )
            attack["bonus"] = attack["modifier"] + self.proficiency \
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
                damage.update(machine.diceCast(
                    damage["dice_size"],
                    damage["dice_count"],
                    default_bonus \
                            if default_bonus \
                            else damage.get('bonus', 0)
                    ))
                # Primary attack gets stats modifier as bonus
                default_bonus = 0
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
                for damage in sorted(
                    attack["damage"],
                    key=lambda d: d["average"],
                    reverse=True
                    )
                ])
            if attack["average"] > self.average_damage:
                self.average_damage = attack["average"]
                self.attack_bonus = attack["bonus"]
                self.critical_damage = attack["critical"]
                self.spell_save_dc = attack["spell_save_dc"]

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
                self.attack_bonus = max([
                    attack["modifier"]
                    for attack_name in multiattack["sequence"]
                    for attack in self.attacks
                    if attack["name"] == attack_name
                    ])
                self.spell_save_dc = max([
                    attack["spell_save_dc"]
                    for attack_name in multiattack["sequence"]
                    for attack in self.attacks
                    if attack["name"] == attack_name
                    ])

        self.traits = [
            trait
            for trait in self.traits
            if trait and trait.get('name')
            ]

        challenge = machine.computeMonsterChallengeRating(
            self.hit_points, self.armor_class,
            self.average_damage, self.attack_bonus, self.spell_save_dc)

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
