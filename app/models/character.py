import re
from math import ceil, floor

from .base import JsonObject, JsonObjectDataMapper
from config import get_character_data

class CharacterObject(JsonObject):
    _version = '1.0'
    _pathPrefix = "character"
    _defaultConfig = {
        "name": "",
        "creation": [],
        "race": "",
        "class": "",
        "background": "",
        "alignment": "true neutral",
        "adventure_league": False,
        "treasure_checkpoints": {},
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
            "cantrips": [],
            "list": [],
            "expanded": [],
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
        "downtime": float,
        "renown": float,
        "adventure_league": bool,
        "adventure_items": int,
        "adventure_checkpoints": float,
        "treasure_checkpoints": {
            "*": float,
            },
        "acp_progress": float,
        "acp_level": int,
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

    def migrate(self, mapper):
        if self.race == "Stout Halfing":
            self.race = "Stout Halfling"

        def fixComputed(old, new, pattern=None):
            re_mod = re.compile(pattern or re.escape(old))
            computed = self.config.get('computed', {})
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
            abilities = self.config.get('abilities', {})
            for ability in list(abilities.values()):
                for key, val in list(ability.items()):
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
        for old, new in list(migrate.items()):
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
            levels = self.spells or {}
            del self.config["spells"]
            self.spellLevel = {
                "cantrip": levels.get("cantrip", []),
                "level_1": levels.get("1st_level", []),
                "level_2": levels.get("2nd_level", []),
                "level_3": levels.get("3rd_level", []),
                "level_4": levels.get("4th_level", []),
                "level_5": levels.get("5th_level", []),
                "level_6": levels.get("6th_level", []),
                "level_7": levels.get("7th_level", []),
                "level_8": levels.get("8th_level", []),
                "level_9": levels.get("9th_level", []),
                }
        if self.spellStat and not (self.spellList and self.spellCantrips):
            self.spellList = []
            self.spellCantrips = []
            for level, spells in list(self.spellLevel.items()):
                spells = [
                    spell['name'] if isinstance(spell, dict) else spell
                    for spell in spells
                    ]
                if level == "cantrip":
                    self.spellCantrips.extend(spells)
                else:
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

        if mapper.adventureleague.getByCharacterId(self.id):
            self.adventure_league = True

        super(CharacterObject, self).migrate()

    def compute(self):
        machine = self.mapper.machine
        itemMapper = self.mapper.items

        self.version = self._version

        if self.adventure_checkpoints:
            xp_to_acp = self.mapper.machine.xpToAcp(self.xp)
            self.level, self.acp_progress, self.acp_level = \
                machine.acpToLevel(
                    xp_to_acp + self.adventure_checkpoints
                    )
        else:
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

        for skill in itemMapper.skills:
            stat, skill = skill["stat"], skill["code"]
            self.skills[skill] = self.statisticsModifiers[stat]
            if skill in self.proficienciesExpertise:
                self.skills[skill] += self.proficiency * 2
            elif skill in self.proficienciesSkills:
                self.skills[skill] += self.proficiency
            elif skill in self.proficienciesTalent:
                self.skills[skill] += ceil(self.proficiency / 2.0)

        self.passive_perception = 10 + self.skillsPerception

        for path, compute in list(self.computed.items()):
            value = 0
            if 'formula' in compute:
                value += machine.resolveMath(
                    self, compute["formula"]
                    )
            for bonus in compute.get("bonus", []):
                value += machine.resolveMath(self, bonus)
            self.setPath(path, value)

        cr = machine.challengeByLevel(self.level)
        self.challenge.update(cr)

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
            self.armor_class_bonus += armor.get('bonus', 0)

        self.spellLevel = {}
        for spell in set(self.spellList).union(self.spellPrepared).union(self.spellCantrips):
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
        for check, condition in list(conditions.items()):
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
            for key, val in list(obj.items()):
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

    def unconsumeAdventureLeague(self, log):
        log.consumed = False
        if log.character_snapshot:
            del log.character_snapshot
        log.notes = re.sub(
            r"\n+Leveled up from `\d+` to `\d+` and gained `\d+GP`.$",
            "",
            log.notes
            )
        return log

    def consumeAdventureLeague(self, log):
        computed = {}
        multipliers = {}
        if log.slow_progress:
            multipliers = {
                'adventure_checkpoints': 0.5,
                'treasure_checkpoints': 0.5,
                }
        flatMapping = {
            'renown': 'renown',
            'downtime': 'downtime',
            }
        nestedMapping = {
            'gold': 'wealth',
            }

        if not log.adventure_checkpointsEarned:
            flatMapping.update({
                'xp': 'xp',
                })
        else:
            flatMapping.update({
                'adventure_checkpoints': 'adventure_checkpoints',
                })
            nestedMapping.update({
                'treasure_checkpoints': 'treasure_checkpoints',
                })

            acpEarned = log.getPath(
                ['adventure_checkpoints', 'earned'],
                0.0
                ) * multipliers.get('adventure_checkpoints', 1.0)
            computed = {
                'downtime': acpEarned * 2.5,
                'renown': acpEarned * 0.25,
                }

        def mapLog(starting, earned, total, src, dst):
            startVal = log.setPath(starting, self.getPath(dst, 0.0))
            earnVal = log.setPath(earned, log.getPath(earned, 0.0))
            totalVal = self.setPath(dst, startVal \
                + earnVal * multipliers.get(src, 1.0) \
                + computed.get(src, 0.0))
            log.setPath(total, totalVal)

        for src, dst in list(flatMapping.items()):
            mapLog(
                starting=[src, 'starting'],
                earned=[src, 'earned'],
                total=[src, 'total'],
                src=src,
                dst=[dst],
                )

        for src, dst in list(nestedMapping.items()):
            fields = set(log.getPath([src, 'earned'], {}).keys()) \
                | set(self.getPath([dst]).keys())
            for field in fields:
                mapLog(
                    starting=[src, 'starting', field],
                    earned=[src, 'earned', field],
                    total=[src, 'total', field],
                    src=src,
                    dst=[dst, field],
                    )

        log.equipmentStarting = len(self.equipment)
        self.equipment += log.equipmentEarned or []
        log.equipmentTotal = len(self.equipment)

        log.itemsStarting = self.adventure_items or 0
        self.equipment += log.itemsEarned or []
        self.adventure_items = log.itemsStarting \
            + len(log.itemsEarned or [])
        log.itemsTotal = self.adventure_items

        old_level = self.level
        self.compute()

        if self.adventure_checkpoints:
            levelGoldTiers = [
                (1, 75),
                (5, 150),
                (11, 550),
                (17, 5500),
                ]
            levelGold = 0
            for curLevel in range(old_level + 1, self.level + 1):
                _, gold = filter(
                    lambda minLevel__: minLevel__[0] <= curLevel,
                    levelGoldTiers
                    )[-1]
                levelGold += gold
                self.wealthGp += gold
            if levelGold:
                log.notes += "\n\nLeveled up from `%d` to `%d` and gained `%dGP`." % (
                    old_level,
                    self.level,
                    levelGold,
                    )

        self.adventure_league = True
        log.consumed = True
        log.character_snapshot = dict([
            (prop, self.getPath(prop))
            for prop in [
                'level',
                'xp', 'xp_progress', 'xp_level',
                'adventure_checkpoints', 'acp_progress', 'acp_level',
                ]
            ])

    def getLevelUp(self):
        levelUp = {
            "creation": set(),
            "config": []
            }

        for field in ['race', 'class', 'background']:
            data, sub = self._find_caracter_field(field, self[field])
            for creation, phase in list(data.get('phases', {}).items()):
                if self._meetsCondition(creation, phase):
                    levelUp["creation"].add(creation)
                    levelUp["config"] += phase["config"]
            if sub is None:
                continue
            for creation, phase in list(sub.get('phases', {}).items()):
                if self._meetsCondition(creation, phase):
                    levelUp["creation"].add(creation)
                    levelUp["config"] += phase["config"]

        levelUp['creation'] = list(levelUp['creation'])
        levelUp['config'] = levelUp['config']
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

    def getByIds(self, ids):
        """Returns all characters in a party by list of ids"""
        if not ids:
            return []
        return self.getMultiple(
            "`id` IN (%s)" % ",".join("?" * len(ids)),
            ids
            )

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
        with self._db.connect() as db:
            cur = db.execute("""
                SELECT
                    DISTINCT ec.id
                FROM
                    `character` as ec
                    LEFT JOIN `party_characters` AS pc
                        ON (pc.character_id = ec.id)
                    LEFT JOIN `party` AS p
                        ON (pc.party_id = p.id)
                    LEFT JOIN `party_characters` AS epc
                        ON (epc.party_id = p.id)
                    LEFT JOIN `character` AS c
                        ON (epc.character_id = c.id)
                WHERE
                    ec.`user_id` = ?
                    OR c.`user_id`= ?
                    OR p.`user_id` = ?
                """,
                [
                    user_id,
                    user_id,
                    user_id,
                    ]
                )
            character_ids = cur.fetchall() or []
            cur.close()

        return [
            character['id']
            for character in character_ids
            ]
