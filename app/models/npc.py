import re

from base import JsonObject, JsonObjectDataMapper

from ..config import get_config, get_item_data
from dndmachine import DndMachine

class NpcObject(JsonObject):
    def __init__(self, config={}):
        super(NpcObject, self).__init__(
            config,
            pathPrefix = "npc",
            defaultConfig = {
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
                },
            fieldTypes = {
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
            )
        self.compute()

    def update(self, update):
        if "base_stats" in update:
            for path, compute in update['computed'].items():
                if 'formula' not in compute:
                    continue
                compute['formula'] = compute['formula'].replace(
                    ' modifiers', ' statistics.modifiers')
            update['statistics'] = {
                "bare": update['base_stats'],
                "bonus": update['stats_bonus'],
                "base": update['stats'],
                "modifiers": update['modifiers']
                }
            del update['base_stats']
            del update['stats_bonus']
            del update['stats']
            del update['modifiers']
        self._config = self._merge(self._config, update)
        self.compute()

    def compute(self):
        config = get_config()
        machine = DndMachine(config["machine"], get_item_data())

        for stat in machine.items.statistics:
            stat = stat["name"]
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
            self.size, machine.size_hit_dice)['dice_size']

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
        def findDesc(item):
            for dest, paths in search.items():
                for path in paths:
                    desc = machine.itemByName(item, path)
                    if desc:
                        desc["path"] = path
                        return dest, desc
            return None, None

        for items in self.equipment:
            count, item = 1, items
            matches = re.match(r'^(\d+)\sx\s(.*)$', items)
            if matches != None:
                count, items = int(matches.group(1)), \
                    matches.group(2)
            dest, desc = findDesc(item)
            dest = dest or 'misc'
            if desc:
                self[dest] = self[dest] + [desc] * count
            else:
                self.itemsMisc = self.itemsMisc + [items]

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

        self.armor_class = self.unarmored
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

    def getList(self, search=None):
        """Returns a list of npc matching the search parameter"""
        return self.getMultiple(
            """`name` LIKE :search
            OR `location` LIKE :search
            OR `organization` LIKE :search
            """,
            {"search": "%%%s%%" % search}
            )

