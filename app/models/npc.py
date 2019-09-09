import re
import json
from math import floor

from .base import JsonObject, JsonObjectDataMapper

class NpcObject(JsonObject):
    _version = '1.0'
    _pathPrefix = "npc"
    _defaultConfig = {
        "name": "",
        "campaign_id": None,
        "race": "",
        "size": "medium",
        "gender": "",
        "class": "",
        "description": "",
        "location": "",
        "organization": "",
        "alignment": "true neutral",
        "level": 1,
        "hit_dice": 8,
        "hit_points_notation": "1d4",
        "hit_points": 2,
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
        "spell": {
            "stat": "charisma",
            "safe_dc": 0,
            "attack_modifier": 0,
            "list": [],
            },
        "equipment": [],
        "weapon": [],
        "armor": [],
        "items": {
            "artisan": [],
            "kit": [],
            "gaming": [],
            "musical": [],
            "trinket": []
            },
        "proficiency": 2,
        "traits": {},
        "features": [],
        "languages": [],
        "computed": {
            "armor_class": {
                "formula": "10 + statistics.modifiers.dexterity"
                },
            "spell.safe_dc": {
                "formula": "8 + npc.proficiency + statistics.modifiers['npc.spell.stat']"
                },
            "spell.attack_modifier": {
                "formula": "npc.proficiency + statistics.modifiers['npc.spell.stat']"
                },
            },
        }
    _fieldTypes = {
        'id': int,
        'campaign_id': int,
        "level": int,
        "hit_dice": int,
        "hit_points": int,
        "speed": int,
        "proficiency": int,
        "passive_perception": int,
        "spell": {
            "safe_dc": int,
            "attack_modifier": int,
            },
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
            "id": int,
            "value": int,
            "bonus": int,
            "disadvantage": bool,
            "strength": int,
            "cost": {
                "*": int
                },
            "weight": {
                "*": float
                }
            },
        "weapons": {
            "id": int,
            "damage": {
                "dice_count": int,
                "dice_size": int,
                "bonus": int,
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
            "cost": {
                "*": int
                },
            "weight": {
                "*": float
                }
            },
        "items": {
            "*": {
                '*': 'auto',
                'worth': {
                    '*': int
                    },
                'weight': {
                    '*': float
                    },
                },
            'trinket': 'auto',
            },
        "abilities": {
            "*": {
                "*": str,
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

            for path, compute in list(self._config.get('computed', {}).items()):
                if 'formula' not in compute:
                    continue
                compute['formula'] = re_mod.sub(
                    "statistics.modifiers",
                    compute['formula']
                    )

            self.statistics = {
                "bare": self['base_stats'],
                "bonus": self['stats_bonus'],
                "base": self['stats'],
                "modifiers": self['modifiers']
                }
            del self['base_stats']
            del self['stats_bonus']
            del self['stats']
            del self['modifiers']

        if isinstance(self.traits, list):
            self.traits = dict([
                (trait['name'], trait['description'])
                for trait in self.traits
                ])

        def fixComputed(old, new, pattern=None):
            re_mod = re.compile(pattern or re.escape(old))
            computed = self._config.get('computed', {})
            if old in computed:
                if new not in computed:
                    computed[new] = computed[old]
                del computed[old]
            for path, compute in list(computed.items()):
                if 'formula' not in compute:
                    continue
                compute['formula'] = re_mod.sub(
                    new,
                    compute['formula']
                    )

        migrate = {
            "spell_stat": "spell.stat",
            "spell_attack_modifier": "spell.attack_modifier",
            "spell_safe_dc": "spell.safe_dc",
            }
        for old, new in list(migrate.items()):
            fixComputed(old, new)
            if old in self:
                if isinstance(self[old], dict):
                    del self[old]
                    continue
                try:
                    self[new] = self[old]
                except Exception as e:
                    print(e)
                    pass
                finally:
                    del self[old]

        self.armor = []
        self.weapons = []
        self.items = {
            "artisan": [],
            "kit": [],
            "gaming": [],
            "musical": [],
            "trinket": []
            }

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
            self.statisticsModifiers[stat] = floor(
                (self.statisticsBase[stat] - 10.0) / 2.0
                )
            self.saving_throws[stat] = self.statisticsModifiers[stat]

        self.initiative_bonus = self.statisticsModifiersDexterity
        self.passive_perception = 10 + self.statisticsModifiersWisdom

        for path, compute in list(self.computed.items()):
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

        self.update(
            machine.identifyEquipment(self.equipment)
            )

        for weapon in self.weapons:
            weapon = machine.computeWeaponStats(weapon, self, True)

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
            for ability in list(self.abilities.values()):
                for key, val in list(ability.items()):
                    if key.endswith('_formula'):
                        ability[key[:-8]] = machine.resolveMath(
                            self, val)

class NpcMapper(JsonObjectDataMapper):
    obj = NpcObject
    table = "npc"
    fields = ["name", "campaign_id", "location", "organization"]
    order = 'name'

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

    def getByCampaignId(self, campaign_id):
        """Returns a list of npc associated with a campaign"""
        return self.getMultiple(
            "`campaign_id` = :campaignId",
            {"campaignId": campaign_id}
            )
