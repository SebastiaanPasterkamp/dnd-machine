import re
from math import ceil

from base import JsonObject, JsonObjectDataMapper

from ..config import get_config, get_item_data, get_character_data
from dndmachine import DndMachine

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
            "kits": [],
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
            "armor_class": {
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
        "unarmored": int,
        "armor_class": int,
        "armor_class_bonus": int,
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
        "spell": {
            "safe_dc": int,
            "attack_modifier": int,
            "max_cantrips": int,
            "max_known": int,
            "slots": {
                "*": int
                }
            },
        "items": {
            "*": [],
            "artisan": {
                "*": unicode
                },
            "trinket": unicode
            },
        "abilities": {
            "*": {
                "*": unicode,
                "uses": int,
                "bonus": int
                }
            }
        }

    def __init__(self, *args, **kwargs):
        super(CharacterObject, self).__init__(*args, **kwargs)

        self._character_data = None
        self._machine_mapper = None

    @property
    def character_data(self):
        if not self._character_data:
            self._character_data = get_character_data(True)
        return self._character_data

    @property
    def machine(self):
        if not self._machine_mapper:
            config = get_config()
            item_data = get_item_data()
            self._machine_mapper = DndMachine(
                config["machine"],
                item_data
                )
        return self._machine_mapper

    def migrate(self, mapper=None):
        if self.race == "Stout Halfing":
            self.race = "Stout Halfling"

        def fixComputed(old, new, pattern=None):
            re_mod = re.compile(pattern or re.escape(old))
            for path, compute in self._config['computed'].items():
                if 'formula' not in compute:
                    continue
                compute['formula'] = re_mod.sub(
                    new,
                    compute['formula']
                    )
            for ability in self.abilities.values():
                for key, val in ability.items():
                    if not key.endswith('_formula'):
                        continue
                    ability[key] = re_mod.sub(new, val)

        if "base_stats" in self._config:
            fixComputed(
                "modifiers",
                "statistics.modifiers",
                r"(?<!statistics\.)modifiers"
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

        migrate = {
            "spell_stat": "spell.stat",
            "cantrips_known": "spell.max_cantrips",
            "spells_known": "spell.max_known",
            }
        for old, new in migrate.items():
            fixComputed(old, new)
            if old in self._config:
                self[new] = self[old]
                del self._config[old]
        if "spell_slots" in self._config:
            slots = self.spell_slots
            self.spellSlots = {
                "cantrip": slots.get("cantrip", []),
                "level_1": slots.get("1st_level", []),
                "level_2": slots.get("2nd_level", []),
                "level_3": slots.get("3rd_level", []),
                "level_4": slots.get("4th_level", []),
                "level_5": slots.get("5th_level", []),
                "level_6": slots.get("6th_level", []),
                "level_7": slots.get("7th_level", []),
                "level_8": slots.get("8th_level", []),
                "level_9": slots.get("9th_level", []),
                }
            del self._config["spell_slots"]
        if "spells" in self._config:
            level = self.spells
            del self._config["spells"]
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

        super(CharacterObject, self).migrate()

    def compute(self):
        config = get_config()
        machine = self.machine

        self.version = self._version

        self.statisticsBase = {}
        self.statisticsModifiers = {}

        for stat in machine.items.statistics:
            stat = stat["code"]
            self.statisticsBase[stat] = self.statisticsBare[stat] \
                + sum(self.statisticsBonus.get(stat, []))
            self.statisticsModifiers[stat] = int(
                (self.statisticsBase[stat] - 10.0) / 2.0
                )
            self.saving_throws[stat] = self.statisticsModifiers[stat]
            if stat in self.proficienciesExpertise:
                self.saving_throws[stat] += self.proficiency * 2
            elif stat in self.proficienciesSkills:
                self.saving_throws[stat] += self.proficiency
            elif stat in self.proficienciesTalent:
                self.saving_throws[stat] += ceil(self.proficiency / 2.0)

        self.initiative_bonus = self.statisticsModifiersDexterity
        self.passive_perception = 10 + self.statisticsModifiersWisdom

        for skill in machine.items.skills:
            stat, skill = skill["stat"], skill["code"]
            self.skills[skill] = self.statisticsModifiers[stat]
            if skill in self.proficienciesExpertise:
                self.skills[skill] += self.proficiency * 2
            elif skill in self.proficienciesSkills:
                self.skills[skill] += self.proficiency
            elif skill in self.proficienciesTalent:
                self.skills[skill] += ceil(self.proficiency / 2.0)

        for path, compute in self.computed.items():
            value = machine.resolveMath(
                self, compute.get("formula", ""))
            for bonus in compute.get("bonus", []):
                value += machine.resolveMath(self, bonus)
            self.setPath(path, value)

        cr = machine.challengeByLevel(self.level)
        for rating, value in cr.iteritems():
            self.challenge[rating] = value

        self.level, self.xp_progress, self.xp_level = \
            machine.xpToLevel(self.xp)

        self.armor = []
        self.weapons = []
        self.items = {
            "artisan": [],
            "kits": [],
            "gaming": [],
            "musical": [],
            "trinket": []
            }
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
                ],
            "itemsArtisan": ["tools"],
            "itemsKits": ["tools"],
            "itemsGaming": ["tools"],
            "itemsMusical": ["tools"],
            }
        def findDesc(item):
            for dest, paths in search.items():
                for path in paths:
                    desc = machine.itemByName(item, path)
                    if desc:
                        desc["path"] = path
                        return dest, desc
            return None, None

        re_cnt_item = re.compile(ur"^(\d+)\sx\s(.*)$")
        for items in self.equipment:
            count, item = 1, items
            matches = re_cnt_item.match(items)
            if matches != None:
                count, items = int(matches.group(1)), \
                    matches.group(2)
            dest, desc = findDesc(item)
            dest = dest or 'trinket'
            if desc:
                self[dest] = self[dest] + [desc] * count
            else:
                self.itemsTrinket = self.itemsTrinket + [items]

        for weapon in self.weapons:
            attack_modifier = "strength"
            if "finesse" in weapon.get("property", []):
                attack_modifier = "dexterity"
            if "ranged" in weapon["path"]:
                attack_modifier = "dexterity"

            dmg = machine.itemByName(
                weapon["damage"]["type"], 'damage_types')
            weapon["damage"]["type_label"] = dmg["label"]
            weapon["damage"]["type_short"] = dmg["short"]

            attack_modifier = self.statisticsModifiers[attack_modifier]

            weapon["damage"]["notation"] = machine.diceNotation(
                weapon["damage"]["dice_size"],
                weapon["damage"]["dice_count"],
                attack_modifier
                )
            weapon["bonus"] = attack_modifier + self.proficiency

            if "thrown" in weapon.get("property", []) \
                    and "ranged" not in weapon["path"]:
                attack_modifier = self.statisticsModifiers["dexterity"]

                weapon["use_alt"] = "Thrown"
                weapon["damage"]["notation_alt"] = machine.diceNotation(
                    weapon["damage"]["dice_size"],
                    weapon["damage"]["dice_count"],
                    attack_modifier
                    )
                weapon["bonus_alt"] = attack_modifier + self.proficiency

            if "versatile" in weapon.get("property", []):
                weapon["use_alt"] = "Two-Handed"

                weapon["damage"]["notation_alt"] = machine.diceNotation(
                    weapon["versatile"]["dice_size"],
                    weapon["versatile"]["dice_count"],
                    attack_modifier
                    )
                weapon["bonus_alt"] = attack_modifier + self.proficiency

        self.armor_class_bonus = 0
        for armor in self.armor:
            if "formula" in armor:
                armor["value"] = machine.resolveMath(
                    self, armor["formula"])
            if "value" in armor:
                if armor["value"] > self.armor_class:
                    self.armor_class = armor["value"]
            elif "bonus" in armor:
                if armor["bonus"] > self.armor_class_bonus:
                    self.armor_class_bonus = armor["bonus"]

        self.abilities = self._expandFormulas(self.abilities)
        # No type-casting
        self._config['level_up'] = self.getLevelUp()

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
        if isinstance(obj, dict):
            for key, val in obj.items():
                if key.endswith('_formula'):
                    _key = key.replace('_formula', '')
                    obj[_key] = self.machine.resolveMath(self, val)
                else:
                    obj[key] = self._expandFormulas(val)
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
        for data in self.character_data[field]:
            for sub in data.get('sub', []):
                if sub['name'] == value:
                    return data, sub
            if data['name'] == value:
                return data, None
        return {}, None

class CharacterMapper(JsonObjectDataMapper):
    obj = CharacterObject
    table = "character"
    fields = ["name", "level"]

    def getList(self, search=None):
        """Returns a list of characters matching the search parameter"""
        return self.getMultiple(
            "`name` LIKE :search",
            {"search": "%%%s%%" % search}
            )

    def insert(self, obj):
        """Adds the link between user and character after inserting"""
        new_obj = super(CharacterMapper, self).insert(obj)
        self.db.execute("""
            INSERT INTO `user_characters` (`user_id`, `character_id`)
            VALUES (:user_id, :character_id)""", {
                'user_id': new_obj.user_id,
                'character_id': new_obj.id
                }
            )
        self.db.commit()
        return new_obj

    def delete(self, obj):
        """Removes the link between user and character before deleting"""
        cur = self.db.execute("""
            DELETE FROM `user_characters`
            WHERE `user_id` = :user_id AND `character_id` = :character_id
            """, {
                'user_id': obj.user_id,
                'character_id': obj.id
                }
            )
        return super(CharacterMapper, self).delete(obj)

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
            self._read(dict(character))
            for character in characters
            ]

    def getExtendedIds(self, user_id):
        """Returns all character IDs from parties the user has
        characters in
        """
        cur = self.db.execute("""
            SELECT
                DISTINCT epc.character_id
            FROM
                `user_characters` AS uc
                LEFT JOIN `party_characters` AS pc
                    ON (pc.character_id = uc.character_id)
                LEFT JOIN `party_characters` AS epc
                    ON (epc.party_id = pc.party_id)
            WHERE
                uc.`user_id` = ?
            """,
            [user_id]
            )
        character_ids = cur.fetchall() or []
        return [
            character['character_id']
            for character in character_ids
            ]
