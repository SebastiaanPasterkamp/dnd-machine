from base import JsonObject, JsonObjectDataMapper

class MonsterObject(JsonObject):
    _version = '1.0'
    _pathPrefix = "monster"
    _defaultConfig = {
        "name": u"",
        "size": u"small",
        "type": u"beast",
        "level": 1,
        "motion": {},
        "alignment": u"Neutral Evil",
        "hit_points": 2,
        "hit_points_notation": u"1d4",
        "armor_class": 10,
        "proficiency": 2,
        "passive_perception": 0,
        "traits": {},
        "features": [],
        "languages": [],
        "multiattack": [],
        "attacks": [],
        "attack_modifier": {
            "melee": "strength",
            "ranged": "dexterity",
            "spell": "charisma"
        },
        "statistics": {
            "bare": {
                "strength": 10,
                "dexterity": 10,
                "constitution": 10,
                "intelligence": 10,
                "wisdom": 10,
                "charisma": 10
                },
            "bonus": {
                "strength": [],
                "dexterity": [],
                "constitution": [],
                "intelligence": [],
                "wisdom": [],
                "charisma": []
                },
            "base": {
                "strength": 8,
                "dexterity": 8,
                "constitution": 8,
                "intelligence": 8,
                "wisdom": 8,
                "charisma": 8
                },
            "modifiers": {
                "strength": 0,
                "dexterity": 0,
                "constitution": 0,
                "intelligence": 0,
                "wisdom": 0,
                "charisma": 0
                }
            },
        "challenge": 0.0,
        "xp": 10
        }
    _fieldTypes = {
        'id': int,
        'xp': int,
        'level': int,
        'dice_size': int,
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
        "statistics": {
            "*": {
                "*": int
                }
            },
        }

    @property
    def mapper(self):
        return self._mapper

    @mapper.setter
    def mapper(self, mapper):
        self._mapper = mapper
        return self._mapper

    def migrate(self, mapper=None):
        if "stats" in self._config:
            self.statistics = {
                "bare": self._config['stats'],
                "base": self._config['stats'],
                "modifiers": self._config['modifiers']
                }
            del self._config['stats']
            del self._config['modifiers']
        if isinstance(self.traits, list):
            self.traits = {}

        super(MonsterObject, self).migrate()

    def compute(self):
        machine = self.mapper.machine
        itemMapper = self.mapper.items

        self.version = self._version

        for stat in itemMapper.statistics:
            stat = stat["code"]
            self.statisticsBase[stat] = self.statisticsBare[stat]
            self.statisticsModifiers[stat] = int(
                (self.statisticsBase[stat] - 10.0) / 2.0
                )

        self.passive_perception = 10 + self.statisticsModifiersWisdom

        self.dice_size = machine.findByName(
            self.size,
            machine.size_hit_dice
            )['dice_size']

        self.hit_points = machine.diceAverage(
                self.dice_size,
                self.level,
                self.statisticsModifiersConstitution * self.level
                )

        self.hit_points_notation = machine.diceNotation(
            self.dice_size,
            self.level,
            self.statisticsModifiersConstitution * self.level
            )

        self.average_damage = 0
        self.critical_damage = 0
        self.attack_bonus = 0
        self.spell_save_dc = 0

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

            attack["mode"] = attack.get("mode", "melee")
            attack["bonus"] = 0
            attack["spell_save_dc"] = 0
            mod = self.statisticsModifiers.get(
                self.attack_modifier.get(
                    attack["mode"], "strength"
                    ), 0
                )
            attack["modifier"] = mod + self.proficiency
            if attack["mode"] == "spell":
                attack["spell_save_dc"] = 8 + attack["modifier"]
            else:
                attack["bonus"] = mod

            attack["damage"] = attack.get("damage", [])
            for i, damage in enumerate(attack["damage"]):
                damage["dice_size"] = damage.get("dice_size", 4)
                damage["dice_count"] = damage.get("dice_count", 0)
                damage["type"] = damage.get("type", "")
                damage.update(machine.diceCast(
                    damage["dice_size"],
                    damage["dice_count"]
                    ))

            attack["damage"] = sorted(
                    attack["damage"],
                    key=lambda d: d["average"],
                    reverse=True
                    )
            if len(attack["damage"]):
                attack["damage"][0].update(machine.diceCast(
                    attack["damage"][0]["dice_size"],
                    attack["damage"][0]["dice_count"],
                    attack["bonus"]
                    ))

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
                self.attack_bonus = attack["modifier"]
                self.spell_save_dc = attack["spell_save_dc"]

        for multiattack in self.multiattack:
            multiattack["sequence"] = multiattack.get(
                "sequence", [])
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

        challenge = machine.computeMonsterChallengeRating(
            self.hit_points, self.armor_class,
            self.average_damage, self.attack_bonus, self.spell_save_dc)

        recompute = challenge['proficiency'] != self.proficiency
        self.update(challenge)
        if recompute:
            self.compute()


class MonsterMapper(JsonObjectDataMapper):
    obj = MonsterObject
    table = "monster"
    fields = ['name', 'challenge_rating', 'xp_rating', 'xp']
    order = 'name'

    def __init__(self, db, mapper, config={}):
        self.mapper = mapper
        super(MonsterMapper, self).__init__(db)

    def _read(self, dbrow):
        obj = super(MonsterMapper, self)._read(dbrow)
        obj.mapper = self.mapper
        return obj

    def create(self, config=None):
        obj = super(MonsterMapper, self).create(config)
        obj.mapper = self.mapper
        return obj

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
