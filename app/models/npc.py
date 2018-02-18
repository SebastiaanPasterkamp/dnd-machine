import re

from base import JsonObject, JsonObjectDataMapper

class NpcObject(JsonObject):
    _version = '1.0'
    _pathPrefix = "npc"
    _defaultConfig = {
        "name": u"",
        "race": u"",
        "size": u"medium",
        "gender": u"",
        "class": u"",
        "description": u"",
        "location": u"",
        "organization": u"",
        "alignment": u"true neutral",
        "level": 1,
        "hit_dice": 8,
        "hit_points_notation": u"1d4",
        "hit_points": 2,
        "spell_stat": "intelligence",
        "statistics": {
            "bare": {
                "strength": 8,
                "dexterity": 8,
                "constitution": 8,
                "intelligence": 8,
                "wisdom": 8,
                "charisma": 8
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
        "saving_throws": {
            "strength": 0,
            "dexterity": 0,
            "constitution": 0,
            "intelligence": 0,
            "wisdom": 0,
            "charisma": 0
            },
        "equipment": [],
        "weapon": [],
        "armor": [],
        "proficiency": 2,
        "traits": [],
        "features": [],
        "languages": [],
        "computed": {
            "unarmored": {
                "formula": "10 + statistics.modifiers.dexterity"
                }
            },
            "spell_safe_dc": {
                "formula": "8 + npc.proficiency + statistics.modifiers['npc.spell_stat']"
            },
            "spell_attack_modifier": {
                "formula": "npc.proficiency + statistics.modifiers.wisdom"
            },
        }
    _fieldTypes = {
        'id': int,
        "level": int,
        "hit_dice": int,
        "hit_points": int,
        "speed": int,
        "proficiency": int,
        "passive_perception": int,
        "spell_safe_dc": int,
        "spell_attack_modifier": int,
        "armor_class": int,
        "armor_class_bonus": int,
        "statistics": {
            "*": {
                "*": int
                }
            },
        "saving_throws": {
            "*": int
            },
        "armor": {
            "value": int,
            "bonus": int,
            "strength": int,
            "cost": {
                "*": int
                }
            },
        "weapons": {
            "damage": {
                "dice_count": int,
                "dice_size": int
                },
            "range": {
                "min": int,
                "max": int
                },
            "versatile": {
                "dice_count": int,
                "dice_size": int
                },
            "bonus": int,
            "bonus_alt": int,
            "cost": {
                "*": int
                }
            },
        "abilities": {
            "*": {
                "*": unicode,
                "uses": int,
                "bonus": int
                }
            },
        "computed": {
            "*": {
                "bonus": int
                }
            }
        }

    @property
    def mapper(self):
        return self._mapper

    @mapper.setter
    def mapper(self, mapper):
        self._mapper = mapper
        return self._mapper

    def migrate(self, mapper=None):
        if "base_stats" in self._config:
            re_mod = re.compile(r"(?<!statistics\.)modifiers")

            for path, compute in self._config['computed'].items():
                if 'formula' not in compute:
                    continue
                compute['formula'] = re_mod.sub(
                    "statistics.modifiers",
                    compute['formula']
                    )

            self.statistics = {
                "bare": self._config['base_stats'],
                "bonus": self._config['stats_bonus'],
                "base": self._config['stats'],
                "modifiers": self._config['modifiers']
                }
            del self._config['base_stats']
            del self._config['stats_bonus']
            del self._config['stats']
            del self._config['modifiers']

        super(NpcObject, self).migrate()

    def compute(self):
        machine = self.mapper.machine
        itemMapper = self.mapper.items

        self.version = self._version

        self.statisticsBase = {}
        self.statisticsModifiers = {}
        for stat in itemMapper.statistics:
            stat = stat["code"]
            self.statisticsBase[stat] = self.statisticsBare[stat] \
                + sum(self.statisticsBonus[stat])
            self.statisticsModifiers[stat] = int(
                (self.statisticsBase[stat] - 10.0) / 2.0
                )
            self.saving_throws[stat] = self.statisticsModifiers[stat]

        self.initiative_bonus = self.statisticsModifiersDexterity
        self.passive_perception = 10 + self.statisticsModifiersWisdom

        for path, compute in self.computed.items():
            value = machine.resolveMath(
                self, compute.get("formula", ""))
            for bonus in compute.get("bonus", []):
                value += machine.resolveMath(self, bonus)
            self.setPath(path, value)

        dice_size = machine.findByName(
            self.size,
            machine.size_hit_dice
            )['dice_size']

        self.hit_points = machine.diceAverage(
                self.hit_dice or dice_size,
                self.level,
                self.statisticsModifiersConstitution * self.level
                )

        self.hit_points_notation = machine.diceNotation(
            self.hit_dice,
            self.level,
            self.statisticsModifiersConstitution * self.level
            )

        self.traits = [
            trait
            for trait in self.traits
            if trait['name']
            ]

        self.armor = []
        self.weapons = []
        search = {
            "armor": [
                "armor.light.items",
                "armor.medium.items",
                "armor.heavy.items",
                "armor.shield.items"
                ],
            "weapons": [
                "weapons.simple.melee.items",
                "weapons.simple.ranged.items",
                "weapons.martial.melee.items",
                "weapons.martial.ranged.items"
                ]
            }
        def findObj(item):
            objs = self.mapper.weapon.getMultiple(
                'name COLLATE nocase = :name',
                {'name': item}
                )
            if len(objs):
                return 'weapons', objs[0]._config
            objs = self.mapper.armor.getMultiple(
                'name COLLATE nocase = :name',
                {'name': item}
                )
            if len(objs):
                return 'armor', objs[0]._config

            obj = itemMapper.itemByNameOrCode(item, 'tools')
            if obj is not None:
                return 'items%s' % obj['type'].capitalize(), obj
            return None, None

        for items in self.equipment:
            count, item = 1, items
            matches = re.match(r'^(\d+)\sx\s(.*)$', items)
            if matches != None:
                count, items = int(matches.group(1)), \
                    matches.group(2)
            dest, obj = findObj(item)
            dest = dest or 'misc'
            if obj:
                self[dest] = self[dest] + [obj] * count
            else:
                self.itemsMisc = self.itemsMisc + [items]

        for weapon in self.weapons:
            attack_modifier = "strength"
            if "ranged" in weapon["property"]:
                attack_modifier = "dexterity"
            if "finesse" in weapon['property']:
                attack_modifier = max({
                    "strength": self.statisticsModifiersStrength,
                    "dexterity": self.statisticsModifiersDexterity,
                    })

            dmg = itemMapper.itemByNameOrCode(
                weapon["damage"]["type"], 'damage_types')
            weapon["damage"]["type_label"] = dmg["label"]
            weapon["damage"]["type_short"] = dmg["short"]

            weapon["bonus"] = weapon["damage"]["bonus"] \
                = self.statisticsModifiers[attack_modifier] \
                    + self.proficiency

            weapon["damage"]["notation"] = machine.diceNotation(
                weapon["damage"]["dice_size"],
                weapon["damage"]["dice_count"],
                weapon["damage"]["bonus"]
                )

            if "versatile" in weapon["property"]:
                weapon["versatile"]["bonus"] = weapon["damage"]["bonus"]
                weapon["versatile"]["notation"] = machine.diceNotation(
                    weapon["versatile"]["dice_size"],
                    weapon["versatile"]["dice_count"],
                    weapon["versatile"]["bonus"]
                    )

        self.armor_class = self.unarmored
        self.armor_class_bonus = 0
        for armor in self.armor:
            value = 0
            if "value" in armor \
                    and armor["value"] > self.armor_class:
                self.armor_class = armor["value"]
            if "formula" in armor:
                value = machine.resolveMath(self, armor["formula"])
                if value > self.armor_class:
                    self.armor_class = value
            if "bonus" in armor \
                    and armor["bonus"] > self.armor_class_bonus:
                self.armor_class_bonus = armor["bonus"]

        if 'abilities' in self:
            for ability in self.abilities.values():
                for key, val in ability.items():
                    if key.endswith('_formula'):
                        ability[key[:-8]] = machine.resolveMath(
                            self, val)

class NpcMapper(JsonObjectDataMapper):
    obj = NpcObject
    table = "npc"
    fields = ["name", "location", "organization"]

    def __init__(self, db, mapper, config={}):
        self.mapper = mapper
        super(NpcMapper, self).__init__(db)

    def _read(self, dbrow):
        obj = super(NpcMapper, self)._read(dbrow)
        obj.mapper = self.mapper
        return obj

    def create(self, config=None):
        obj = super(NpcMapper, self).create(config)
        obj.mapper = self.mapper
        return obj

    def getList(self, search=None):
        """Returns a list of npc matching the search parameter"""
        return self.getMultiple(
            """`name` LIKE :search
            OR `location` LIKE :search
            OR `organization` LIKE :search
            """,
            {"search": "%%%s%%" % search}
            )

