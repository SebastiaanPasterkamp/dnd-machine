from base import JsonObject, JsonObjectDataMapper

from ..config import get_config, get_item_data
from dndmachine import DndMachine

class CharacterObject(JsonObject):
    def __init__(self, config={}):

        if 'stats_bonus' in config:
            config['stats_bonus'] = dict([
                (stat, bonus) if isinstance(bonus, list) else (stat, [bonus])
                for stat, bonus in config['stats_bonus'].iteritems()
                ])

        super(CharacterObject, self).__init__(
            config,
            pathPrefix = "character",
            defaultConfig = {
                "name": u"",
                "creation": [],
                "race": u"",
                "class": u"",
                "background": u"",
                "alignment": u"true neutral",
                "level": 1,
                "xp": 0,
                "base_stats": {
                    "strength": 8,
                    "dexterity": 8,
                    "constitution": 8,
                    "intelligence": 8,
                    "wisdom": 8,
                    "charisma": 8
                    },
                "stats_bonus": {
                    "strength": [],
                    "dexterity": [],
                    "constitution": [],
                    "intelligence": [],
                    "wisdom": [],
                    "charisma": []
                    },
                "stats": {
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
                    "misc": []
                    },
                "proficiency": 2,
                "languages": ["common"],
                "proficiencies": {
                    "armor": [],
                    "weapons": [],
                    "tools": [],
                    "saving_throws": [],
                    "advantages": [],
                    "expertise": [],
                    "skills": []
                    },
                "computed": {
                    "unarmored": {
                        "formula": "10 + modifiers.dexterity + modifiers.constitution"
                    }
                },
                "wealth": {
                    "cp": 0,
                    "sp": 0,
                    "ep": 0,
                    "gp": 0,
                    "pp": 0
                    }
                },
            fieldTypes = {
                "user_id": int,
                "xp": int,
                "xp_level": int,
                "xp_next_level": int,
                "level": int,
                "proficiency": int,
                "initiative_bonus": int,
                "passive_perception": int,
                "spell_safe_dc": int,
                "spell_attack_modifier": int,
                "armor_class": int,
                "armor_class_bonus": int,
                "challenge": {
                    "*": int
                    },
                "base_stats": {
                    "*": int
                    },
                "stats_bonus": {
                    "*": int
                    },
                "stats": {
                    "*": int
                    },
                "modifiers": {
                    "*": int
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
                "items": {
                    "*": [],
                    "artisan": {
                        "*": unicode
                        },
                    "misc": unicode
                    },
                "computed": {
                    "*": {
                        "bonus": int
                        }
                    }
                }
            )

    def compute(self):
        config = get_config()
        machine = DndMachine(config["machine"], get_item_data())

        if isinstance(self.spell_attack_modifier, dict):
            self.computedSpell_attack_modifier = \
                self.spell_attack_modifier
        if isinstance(self.spell_safe_dc, dict):
            self.computedSpell_safe_dc = \
                self.spell_safe_dc
        if isinstance(self.hit_points, dict):
            self.computedHit_points = \
                self.hit_points

        for stat in machine.items.statistics:
            stat = stat["name"]
            self.stats[stat] = self.base_stats[stat] \
                + sum(self.stats_bonus[stat])
            self.modifiers[stat] = int(
                (self.stats[stat] - 10) / 2
                )
            self.saving_throws[stat] = self.modifiers[stat]
            if stat in self.proficienciesSaving_throws:
                self.saving_throws[stat] += self.proficiency

        self.initiative_bonus = self.modifiersDexterity
        self.passive_perception = 10 + self.modifiersWisdom

        for skill in machine.items.skills:
            stat, skill = skill["stat"], skill["name"]
            self.skills[skill] = self.modifiers[stat]
            if skill in self.proficienciesSkills:
                self.skills[skill] += self.proficiency

        for path, compute in self.computed.iteritems():
            value = machine.resolveMath(
                self, compute.get("formula", ""))
            for bonus in compute.get("bonus", []):
                value += machine.resolveMath(self, bonus)
            self.setPath(path, value)

        cr = machine.challengeByLevel(self.level)
        for rating, value in cr.iteritems():
            self.challenge[rating] = value

        self.xp_level = machine.xpAtLevel(self.level)
        self.xp_next_level = machine.xpAtLevel(self.level + 1)
        while self.xp_next_level and self.xp >= self.xp_next_level:
            self.level += 1
            self.xp_level = self.xp_next_level
            self.xp_next_level = machine.xpAtLevel(self.level + 1)

        self.armor = []
        self.weapons = []
        self.items = {
            "artisan": [],
            "kits": [],
            "gaming": [],
            "musical": [],
            "misc": []
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
            "itemsArtisan": ["items.artisan.items"],
            "itemsKits": ["items.kits.items"],
            "itemsGaming": ["items.gaming.items"],
            "itemsMusical": ["items.musical.items"]
            }
        def findDesc(item):
            for dest, paths in search.items():
                for path in paths:
                    desc = machine.itemByName(item, path)
                    if desc:
                        desc["path"] = path
                        return dest, desc
            return None, None

        for item in self.equipment:
            dest, desc = findDesc(item)
            dest = dest or 'misc'
            if desc:
                self[dest] = [desc]
            else:
                self.itemsMisc = [item]

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

            attack_modifier = self.modifiers[attack_modifier]

            weapon["damage"]["notation"] = machine.diceNotation(
                weapon["damage"]["dice_size"],
                weapon["damage"]["dice_count"],
                attack_modifier
                )
            weapon["bonus"] = attack_modifier + self.proficiency

            if "thrown" in weapon.get("property", []) \
                    and "ranged" not in weapon["path"]:
                attack_modifier = self.modifiers["dexterity"]

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

        self.armor_class = machine.resolveMath(self, "10 + modifiers.dexterity")
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
            self.setDefaults(self._read(dict(character)))
            for character in characters
            ]
