import re
from math import ceil, floor

from .base import JsonObject, JsonObjectDataMapper
from config import get_character_data

class CharacterObject(JsonObject):
    _version = '1.0'
    _pathPrefix = "character"
    _defaultConfig = {
        "name": "",
        "choices": {},
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
                "charisma": 8,
                },
            "bonus": {
                "strength": [],
                "dexterity": [],
                "constitution": [],
                "intelligence": [],
                "wisdom": [],
                "charisma": [],
                },
            "base": {
                "strength": 8,
                "dexterity": 8,
                "constitution": 8,
                "intelligence": 8,
                "wisdom": 8,
                "charisma": 8,
                },
            "modifiers": {
                "strength": 0,
                "dexterity": 0,
                "constitution": 0,
                "intelligence": 0,
                "wisdom": 0,
                "charisma": 0,
                },
            },
        "saving_throws": {
            "strength": 0,
            "dexterity": 0,
            "constitution": 0,
            "intelligence": 0,
            "wisdom": 0,
            "charisma": 0,
            },
        "challenge": {},
        "skills": {},
        "equipment": [],
        "armor": [],
        "items": {
            "artisan": [],
            "kit": [],
            "gaming": [],
            "musical": [],
            "trinket": [],
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
            "talent": [],
            },
        "sub": {},
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
            "level": {},
            },
        "personality": {
            "traits": "",
            "ideals": "",
            "bonds": "",
            "flaws": "",
            },
        "appearance": "",
        "computed": {
            "unarmored": {
                "formulas": [
                    "10 + statistics.modifiers.dexterity",
                    ],
                },
            "passive_perception": {
                "formulas": [
                    "10 + skills.perception",
                    ],
                },
            },
        "wealth": {
            "cp": 0,
            "sp": 0,
            "ep": 0,
            "gp": 0,
            "pp": 0,
            },
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
            "*": int,
            },
        "statistics": {
            "*": {
                "*": int,
                }
            },
        "saving_throws": {
            "*": int,
            },
        "skills": {
            "*": int,
            },
        "wealth": {
            "*": int,
            },
        "armor": {
            "id": int,
            "value": int,
            "bonus": int,
            "disadvantage": bool,
            "strength": int,
            "cost": {
                "*": int,
                },
            "weight": {
                "*": float,
                },
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
                "max": int,
                },
            "versatile": {
                "dice_count": int,
                "dice_size": int,
                "bonus": int,
                },
            "bonus": int,
            "cost": {
                "*": int,
                },
            "weight": {
                "*": float,
                },
            },
        "spell": {
            "*": "auto",
            "safe_dc": int,
            "attack_modifier": int,
            "max_cantrips": int,
            "max_known": int,
            "max_prepared": int,
            "slots": {
                "*": int,
                }
            },
        "sub": {
            "spell": {
                "*": "auto",
                "safe_dc": int,
                "attack_modifier": int,
                "max_cantrips": int,
                "max_known": int,
                "max_prepared": int,
                "slots": {
                    "*": int,
                    }
                },
            },
        "items": {
            "*": {
                '*': 'auto',
                'worth': {
                    '*': int,
                    },
                'weight': {
                    '*': float,
                    },
                },
            },
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

    def migrate(self, datamapper):
        self.update(
            self.mapper.machine.identifyEquipment(self.equipment)
            )
        super(CharacterObject, self).migrate(datamapper)

    def recompute(self, datamapper):
        # TODO: Figure out what to keep, or how to incorporate session logs here
        char = CharacterObject({
            'id': self.id,
            'user_id': self.user_id,
            'xp': self.xp,
            'adventure_checkpoints': self.adventure_checkpoints,
            'choices': self.choices,
            })

        changes = char._getChanges()
        while changes.size:
            combined = char._combineChanges(changes, datamapper.machine)
            for path, update in combined:
                char._setPath(path, update)
            char.compute()
            changes = char._getChanges()

        self._config = char._config

    def _combineChanges(self, changes, machine):
        combined = {}
        for option, choice in changes:
            type, uuid, path = option['type'], option['uuid'], option['path']
            assert type is not None
            assert uuid is not None

            if not machine.MatchesFilters(self, option.get("conditions", [])):
                return combined

            if type == 'permanent':
                combined.setdefault("permanent", [])
                combined["permanent"].append(option["config"])

            elif type == 'dict':
                combined.setdefault("path", dict(self._getPath(path, {})))
                combined[path].update(option["dict"])

            elif type == 'list':
                combined.setdefault("path", list(self._getPath(path, [])))
                added, removed = choice.get("added", []), choice.get("removed", [])
                given, multiple = option.get("given", []), option.get("multiple", False)

                update = [i for i in combined[path]
                    if not i in removed
                    or removed.remove(i)]
                update.extend(given).extend(added)
                if not multiple:
                    update = list(set(update))
                combined[path] = updated

            elif type == 'objectlist':
                combined.setdefault("path", list(self._getPath(path, [])))
                added, removed = choice.get("added", []), choice.get("removed", [])
                given, multiple = option.get("given", []), option.get("multiple", False)

                for item in removed:
                    itype, id, count = item.get("type"), item.get("id"), item.get("count", 1)
                    idx = next((index
                        for (index, d) in enumerate(combined[path])
                        if d["type"] == itemtype and d["id"] == id
                        ), None)
                    assert idx is not None, \
                        "Cannot remove '%s %s' from %r" % (remtype, id, path)

                    if not multiple:
                        combined[path].pop(idx)
                    elif count >= combined[path][idx].get("count", 1):
                        assert count <= combined[path][idx].get("count", 1), \
                            "Reduced item '%s %s' from %r below 0" % (remtype, id, path)
                        combined[path].pop(idx)
                    else:
                        combined[path][idx]["count"] -= count

                for item in added + given:
                    itype, id, count = item.get("type"), item.get("id"), item.get("count", 1)
                    idx = next((index
                        for (index, d) in enumerate(combined[path])
                        if d["type"] == itemtype and d["id"] == id
                        ), None)

                    if idx is None:
                        # New item in list
                        combined[path].append(item)
                    elif not multiple:
                        # Not adding duplicates
                        pass
                    else:
                        combined[path][idx]["count"] += count
                    computed[option.path]

            elif type in ['manual', 'select']:
                computed[path] = choice.get("current")


            elif type == 'ability_score':
                improvement = choice.get("improvement", [])
                bonus = dict([
                    (stat, improvement.count(stat))
                    for stat in improvement
                    ])

                for stat, count in bonus:
                    path = "statistics.bonus.%s" % stat
                    combined.setdefault(path, [])
                    computed[path].append(count)

            elif option.type == 'statistics':
                path = 'statistics.bare'
                combined.setdefault(path, {})
                bare = choice.get('bare', {})
                computed[path].update({ 'bare': bare })

            elif type == 'value':
                computed[path] = option.get("value")

            else:
                raise ValueError(
                    "Unknown option type '%s %s' for %r" % (type, uuid, path))

        return combined

    def _getChanges(self):
        changes = {}
        for src in [
                datamapper.race,
                datamapper.subrace,
                datamapper.klass,
                datamapper.subclass,
                datamapper.background,
                ]:
            c = src.collectChanges(datamapper, self)
            changes.extend(r)
        return changes

    def _meetsCondition(self, conditions):
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

    def compute(self):
        machine = self.mapper.machine
        typesMapper = self.mapper.types

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

        for stat in typesMapper.statistics:
            stat = stat.id
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

        for skill in typesMapper.skills:
            stat, skill = skill.stat, skill.id
            self.skills[skill] = self.statisticsModifiers[stat]
            if skill in self.proficienciesExpertise:
                self.skills[skill] += self.proficiency * 2
            elif skill in self.proficienciesSkills:
                self.skills[skill] += self.proficiency
            elif skill in self.proficienciesTalent:
                self.skills[skill] += ceil(self.proficiency / 2.0)

        for path, compute in list(self.computed.items()):
            value = max([
                machine.resolveMath(self, formula)
                for formula in compute.get('formulas', [])
                ] + [0])
            value += sum([
                machine.resolveMath(self, bonus)
                for bonus in compute.get("bonus", [])
                ])
            self.setPath(path, value)

        cr = machine.challengeByLevel(self.level)
        self.challenge.update(cr)

        self.update(
            machine.identifyEquipment(self.equipment)
            )
        self.update(
            machine.identifyProficiencies(self.proficiencies)
            )

        self.weapons = [
            machine.computeWeaponStats(weapon, self)
            for weapon in self.weapons
            ]

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

        known, prepared, cantrips, perLevel = [], [], [], {}
        for sub, data in self.sub.items():
            spellData = data.get("spell", {})
            preparedSpells = spellData.get("prepared", [])
            cantrips = spellData.get("cantrips", [])
            spells = spellData.get("list", []) + preparedSpells + cantrips

            for spell in spells:
                if isinstance(spell, dict):
                    spell = self.mapper.spell.getById(spell.get("id"))
                elif isinstance(spell, str):
                    objs = self.mapper.spell.getMultiple(
                        'name COLLATE nocase = :name',
                        {'name': spell}
                        )
                    spell = next(objs, None)
                if not isinstance(spell, dict):
                    continue
                level = "cantrip" \
                    if spell.level == "Cantrip" \
                    else "level_" + spell.level
                spell.stat = data["stat"]
                spell.save_dc = data["save_dc"]
                spell.attack_modifier = data["attack_modifier"]

                if level == "cantrip":
                    cantrips.append(spell._config)
                elif spellId in preparedSpells:
                    prepared.append(spell._config)
                else:
                    known.append(spell._config)
                perLevel[level] = perLevel.get(level, [])
                perLevel[level].append(spell._config)
        self.spellLevel = perLevel
        self.spellCantrips = list(cantrips)
        self.spellPrepared = list(prepared)
        self.spellList = known

        self.abilities = self._expandFormulas(self.abilities)

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
                _, gold = list(filter(
                    lambda minLevel__: minLevel__[0] <= curLevel,
                    levelGoldTiers
                    ))[-1]
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

class CharacterMapper(JsonObjectDataMapper):
    obj = CharacterObject
    table = "character"
    fields = ["name", "user_id", "level"]
    order = ["name"]

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
