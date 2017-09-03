from base import JsonObject, JsonObjectDataMapper

from ..config import get_config, get_item_data
from dndmachine import DndMachine

class CharacterObject(JsonObject):
    def __init__(self, config={}):
        super(CharacterObject, self).__init__(
            config,
            pathPrefix = "character",
            defaultConfig = {
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
                    "strength": 0,
                    "dexterity": 0,
                    "constitution": 0,
                    "intelligence": 0,
                    "wisdom": 0,
                    "charisma": 0
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
                "skills": {},
                "equipment": [],
                "proficiency": 2,
                "languages": ["common"],
                "proficiencies": {
                    "armor": [],
                    "weapons": [],
                    "tools": [],
                    "saving_throws": [],
                    "advantages": [],
                    "skills": []
                    },
                "computed": {},
                "wealth": {
                    "cp": 0,
                    "sp": 0,
                    "ep": 0,
                    "gp": 0,
                    "pp": 0
                    }
                },
            keepFields = [
                "user_id",
                "xp", "hit_dice", "speed",
                "race", "class", "background", "alignment",
                "base_stats", "stats_bonus",
                "equipment", "proficiencies", "languages",
                "computed", "wealth"
                ],
            fieldTypes = {
                "user_id": int,
                "xp": int,
                "level": int,
                "base_stats": {
                    "strength": int,
                    "dexterity": int,
                    "constitution": int,
                    "intelligence": int,
                    "wisdom": int,
                    "charisma": int
                    },
                "stats_bonus": {
                    "strength": int,
                    "dexterity": int,
                    "constitution": int,
                    "intelligence": int,
                    "wisdom": int,
                    "charisma": int
                    },
                "stats": {
                    "strength": int,
                    "dexterity": int,
                    "constitution": int,
                    "intelligence": int,
                    "wisdom": int,
                    "charisma": int
                    },
                "modifiers": {
                    "strength": int,
                    "dexterity": int,
                    "constitution": int,
                    "intelligence": int,
                    "wisdom": int,
                    "charisma": int
                    },
                "wealth": {
                    "cp": int,
                    "sp": int,
                    "ep": int,
                    "gp": int,
                    "pp": int
                    }
                }
            )

    def compute(self):
        config = get_config()
        machine = DndMachine(config["machine"])
        items = JsonObject(get_item_data())

        for stat in items.statistics:
            stat = stat["name"]
            self.stats[stat] = self.base_stats[stat] \
                + self.stats_bonus[stat]
            self.modifiers[stat] = int(
                (self.stats[stat] - 10) / 2
                )
            self.saving_throws[stat] = self.modifiers[stat]
            if stat in self.proficienciesSaving_throws:
                self.saving_throws[stat] += self.proficiency

        self.initiative_bonus = self.modifiersDexterity
        self.passive_perception = 10 + self.modifiersWisdom

        for skill in items.skills:
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
        for challenge, rating in cr.iteritems():
            self[challenge] = rating

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
                    desc = machine.findByName(item, items.getPath(path))
                    if desc:
                        desc["path"] = path
                        return dest, desc
            return None, None

        for item in self.equipment:
            dest, desc = findDesc(item)
            if desc:
                self[dest].append(desc)
            else:
                self.itemsMisc.append(item)

        for weapon in self.weapons:
            attack_modifier = "strength"
            if "finesse" in weapon.get("property", []):
                attack_modifier = "dexterity"
            if "ranged" in weapon["path"]:
                attack_modifier = "dexterity"

            dmg = machine.findByName(
                weapon["damage"]["type"], items.damage_types)
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
            if "formula" in armor["armor"]:
                armor["armor"]["value"] = machine.resolveMath(
                    self, armor["armor"]["formula"])
            if "value" in armor["armor"]:
                if armor["armor"]["value"] > self.armor_class:
                    self.armor_class = armor["armor"]["value"]
            elif "bonus" in armor["armor"]:
                if armor["armor"]["bonus"] > self.armor_class_bonus:
                    self.armor_class_bonus = armor["armor"]["bonus"]

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
