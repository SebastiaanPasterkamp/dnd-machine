import re
from math import ceil, floor

from base import JsonObject, JsonObjectDataMapper

from ..config import get_character_data

class CharacterObject(JsonObject):
    _version = '1.0'
    _pathPrefix = "character"
    _defaultConfig = {
        "name": u"",
        "creation": [],
        "race": u"",
        "class": u"",
        "background": u"",
        "alignment": u"true neutral",
        "level": 1,
        "xp": 0,
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
        "challenge": {},
        "skills": {},
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
        "languages": [],
        "abilities": {},
        "proficiencies": {
            "armor": [],
            "weapons": [],
            "tools": [],
            "saving_throws": [],
            "advantages": [],
            "expertise": [],
            "skills": [],
            "talent": []
            },
        "spell": {
            "safe_dc": 0,
            "attack_modifier": 0,
            "max_cantrips": 0,
            "max_known": 0,
            "max_prepared": 0,
            "list": [],
            "prepared": [],
            "slots": {},
            "level": {}
            },
        "personality": {
            "traits": "",
            "ideals": "",
            "bonds": "",
            "flaws": ""
            },
        "appearance": "",
        "computed": {
            "unarmored": {
                "formula": "10 + statistics.modifiers.dexterity"
                }
            },
        "wealth": {
            "cp": 0,
            "sp": 0,
            "ep": 0,
            "gp": 0,
            "pp": 0
            },
        "level_up": {
            "creation": [],
            "config": []
            }
        }
    _fieldTypes = {
        'id': int,
        "user_id": int,
        "xp": int,
        "xp_progress": int,
        "xp_level": int,
        "downtime": int,
        "renown": int,
        "adventure_items": int,
        "level": int,
        "hit_points": int,
        "hit_dice": int,
        "speed": int,
        "age": int,
        "weight": float,
        "height": float,
        "proficiency": int,
        "initiative_bonus": int,
        "passive_perception": int,
        "armor_class": int,
        "armor_class_bonus": int,
        "equipment": 'auto',
        "challenge": {
            "*": int
            },
        "statistics": {
            "*": {
                "*": int
                }
            },
        "saving_throws": {
            "*": int
            },
        "skills": {
            "*": int
            },
        "wealth": {
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
        "spell": {
            "safe_dc": int,
            "attack_modifier": int,
            "max_cantrips": int,
            "max_known": int,
            "max_prepared": int,
            "slots": {
                "*": int
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
            }
        }

    @property
    def mapper(self):
        return self._mapper

    @mapper.setter
    def mapper(self, mapper):
        self._mapper = mapper
        return self._mapper

    @property
    def character_data(self):
        if '_character_data' not in self.__dict__:
            self._character_data = get_character_data()
        return self._character_data

    def migrate(self, mapper=None):
        if self.race == "Stout Halfing":
            self.race = "Stout Halfling"

        def fixComputed(old, new, pattern=None):
            re_mod = re.compile(pattern or re.escape(old))
            computed = self.config.get('computed', {})
            if old in computed:
                if new not in computed:
                    computed[new] = computed[old]
                del computed[old]
            for path, compute in computed.items():
                if 'formula' not in compute:
                    continue
                compute['formula'] = re_mod.sub(
                    new,
                    compute['formula']
                    )
            abilities = self.config.get('abilities', {})
            for ability in abilities.values():
                for key, val in ability.items():
                    if not key.endswith('_formula'):
                        continue
                    ability[key] = re_mod.sub(new, val)

        fixComputed('int(', 'floor(')

        if "base_stats" in self.config:
            fixComputed(
                "modifiers",
                "statistics.modifiers",
                r"(?<!statistics\.)modifiers"
                )

            self.statistics = {
                "bare": self.config['base_stats'],
                "bonus": self.config['stats_bonus'],
                "base": self.config['stats'],
                "modifiers": self.config['modifiers']
                }
            del self.config['base_stats']
            del self.config['stats_bonus']
            del self.config['stats']
            del self.config['modifiers']

        self.personality = self.config.get('personality', {})
        for key in ["traits", "ideals", "bonds", "flaws"]:
            if key in self.config:
                if not self.personality.get(key):
                    self.personality[key] = self.config[key]
                del self.config[key]

        migrate = {
            "spell_stat": "spell.stat",
            "cantrips_known": "spell.max_cantrips",
            "spells_known": "spell.max_known",
            "spell_attack_modifier": "spell.attack_modifier",
            "spell_safe_dc": "spell.safe_dc",
            }
        for old, new in migrate.items():
            fixComputed(old, new)
            if old in self.config:
                self[new] = self[old]
                del self.config[old]
        if "spell_slots" in self.config:
            slots = self.spell_slots
            self.spellSlots = {
                "level_1": slots.get("1st_level", 0),
                "level_2": slots.get("2nd_level", 0),
                "level_3": slots.get("3rd_level", 0),
                "level_4": slots.get("4th_level", 0),
                "level_5": slots.get("5th_level", 0),
                "level_6": slots.get("6th_level", 0),
                "level_7": slots.get("7th_level", 0),
                "level_8": slots.get("8th_level", 0),
                "level_9": slots.get("9th_level", 0),
                }
            del self.config["spell_slots"]
        if "spells" in self.config:
            level = self.spells
            del self.config["spells"]
            if not isinstance(level, dict):
                level = {}
            self.spellLevel = {
                "cantrip": level.get("cantrip", []),
                "level_1": level.get("1st_level", []),
                "level_2": level.get("2nd_level", []),
                "level_3": level.get("3rd_level", []),
                "level_4": level.get("4th_level", []),
                "level_5": level.get("5th_level", []),
                "level_6": level.get("6th_level", []),
                "level_7": level.get("7th_level", []),
                "level_8": level.get("8th_level", []),
                "level_9": level.get("9th_level", []),
                }
            if not self.spellList:
                self.spellList = []
                for spells in level.values():
                    self.spellList.extend(spells)
        if 'weapon' in self.config:
            del self.config['weapon']
        if 'misc' in self.config.get('items', {}):
            del self.items['misc']

        self.armor = []
        self.weapons = []
        self.items = {
            "artisan": [],
            "kit": [],
            "gaming": [],
            "musical": [],
            "trinket": []
            }

        super(CharacterObject, self).migrate()

    def compute(self):
        machine = self.mapper.machine
        itemMapper = self.mapper.items

        self.version = self._version

        self.level, self.xp_progress, self.xp_level = \
            machine.xpToLevel(self.xp)

        self.statisticsBase = {}
        self.statisticsModifiers = {}

        for stat in itemMapper.statistics:
            stat = stat["code"]
            self.statisticsBase[stat] = self.statisticsBare[stat] \
                + sum(self.statisticsBonus.get(stat, []))
            self.statisticsModifiers[stat] = floor(
                (self.statisticsBase[stat] - 10.0) / 2.0
                )

            self.saving_throws[stat] = self.statisticsModifiers[stat]
            if stat in self.proficienciesExpertise:
                self.saving_throws[stat] += self.proficiency * 2
            elif stat in self.proficienciesSaving_throws:
                self.saving_throws[stat] += self.proficiency
            elif stat in self.proficienciesTalent:
                self.saving_throws[stat] += ceil(self.proficiency / 2.0)

        self.initiative_bonus = self.statisticsModifiersDexterity
        self.passive_perception = 10 + self.statisticsModifiersWisdom

        for skill in itemMapper.skills:
            stat, skill = skill["stat"], skill["code"]
            self.skills[skill] = self.statisticsModifiers[stat]
            if skill in self.proficienciesExpertise:
                self.skills[skill] += self.proficiency * 2
            elif skill in self.proficienciesSkills:
                self.skills[skill] += self.proficiency
            elif skill in self.proficienciesTalent:
                self.skills[skill] += ceil(self.proficiency / 2.0)

        for path, compute in self.computed.items():
            value = 0
            if 'formula' in compute:
                value += machine.resolveMath(
                    self, compute["formula"]
                    )
            for bonus in compute.get("bonus", []):
                value += machine.resolveMath(self, bonus)
            self.setPath(path, value)

        cr = machine.challengeByLevel(self.level)
        for rating, value in cr.iteritems():
            self.challenge[rating] = value

        self.update(
            machine.identifyEquipment(self.equipment)
            )

        for weapon in self.weapons:
            weapon = machine.computeWeaponStats(weapon, self)

        self.armor_class = self.unarmored
        self.armor_class_bonus = 0
        for armor in self.armor:
            if "formula" in armor:
                armor["value"] = machine.resolveMath(
                    self, armor["formula"]
                    )
            if armor.get('value', 0) > self.armor_class:
                self.armor_class = armor.get('value', 0)
            self.armor_class_bonus += armor.get(bonus, 0)

        self.spellLevel = {}
        for spell in set(self.spellList).union(self.spellPrepared):
            objs = self.mapper.spell.getMultiple(
                'name COLLATE nocase = :name',
                {'name': spell}
                )
            if not len(objs):
                continue
            spell = objs[0]
            level = "cantrip" \
                if spell.level == "Cantrip" \
                else "level_" + spell.level
            self.spellLevel[level] = self.spellLevel.get(level, [])
            self.spellLevel[level].append(spell._config)

        self.abilities = self._expandFormulas(self.abilities)
        # No type-casting
        self.config['level_up'] = self.getLevelUp()

    def _meetsCondition(self, creation, phase):
        if creation in self.creation:
            return False
        if not len(phase.get('config', [])):
            return False
        conditions = phase.get('conditions', {})
        for check, condition in conditions.items():
            if check == 'level':
                if self.level < condition:
                    return False
                continue

            if check == 'creation':
                if condition not in self.creation:
                    return False
                continue

            attrib = self[check] or []
            if not all(c in attrib for c in condition):
                return False
        return True

    def _expandFormulas(self, obj):
        machine = self.mapper.machine
        if isinstance(obj, dict):
            computed = {}
            for key, val in obj.items():
                if key.endswith('_formula'):
                    _key = key.replace('_formula', '')
                    computed[_key] = machine.resolveMath(self, val)
                else:
                    obj[key] = self._expandFormulas(val)
            obj.update(computed)
        elif isinstance(obj, list):
            obj = [
                self._expandFormulas(child)
                for child in obj
                ]
        return obj


    def getLevelUp(self):
        levelUp = {
            "creation": set(),
            "config": []
            }

        for field in ['race', 'class', 'background']:
            data, sub = self._find_caracter_field(field, self[field])
            for creation, phase in data.get('phases', {}).items():
                if self._meetsCondition(creation, phase):
                    levelUp["creation"].add(creation)
                    levelUp["config"] += phase["config"]
            if sub is None:
                continue
            for creation, phase in sub.get('phases', {}).items():
                if self._meetsCondition(creation, phase):
                    levelUp["creation"].add(creation)
                    levelUp["config"] += phase["config"]

        levelUp['creation'] = list(levelUp['creation'])
        levelUp['config'] = self._expandFormulas(levelUp['config'])

        return levelUp

    def _find_caracter_field(self, field, value):
        if value is None:
            return {}, None
        for data in self.character_data[field]:
            if data.get('name', data.get('label')) in value:
                return data, None
        return {}, None

class CharacterMapper(JsonObjectDataMapper):
    obj = CharacterObject
    table = "character"
    fields = ["name", "user_id", "level"]
    order = 'name'

    def __init__(self, db, mapper, config={}):
        self.mapper = mapper
        super(CharacterMapper, self).__init__(db)

    def _read(self, dbrow):
        obj = super(CharacterMapper, self)._read(dbrow)
        obj.mapper = self.mapper
        return obj

    def create(self, config=None):
        obj = super(CharacterMapper, self).create(config)
        obj.mapper = self.mapper
        return obj

    def getList(self, search=None):
        """Returns a list of characters matching the search parameter"""
        return self.getMultiple(
            "`name` LIKE :search",
            {"search": "%%%s%%" % search}
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
            self._read(dict(character))
            for character in characters
            ]

    def getByUserId(self, user_id):
        """Returns all characters from a user by user_id"""
        return self.getMultiple(
            "`user_id` = :userId",
            {"userId": user_id}
            )
        
    def getExtendedIds(self, user_id):
        """Returns all character IDs from parties the user has
        characters in, or DMs for
        """
        cur = self.db.execute("""
            SELECT
                DISTINCT epc.character_id
            FROM
                `character` AS c
                LEFT JOIN `party_characters` AS pc
                    ON (pc.character_id = c.id)
                LEFT JOIN `party` AS p
                    ON (pc.party_id = p.id)
                LEFT JOIN `party_characters` AS epc
                    ON (epc.party_id = pc.party_id)
            WHERE
                c.`user_id` = ?
                OR p.`user_id` = ?
            """,
            [
                user_id,
                user_id
                ]
            )
        character_ids = cur.fetchall() or []
        return [
            character['character_id']
            for character in character_ids
            ]
