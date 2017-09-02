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
                    "skills": []
                    },
                "computed": {}
                },
            keepFields = [
                'user_id',
                'xp',
                'race', 'class', 'background', 'alignment',
                'base_stats', 'stats_bonus',
                'equipment', 'proficiencies', 'languages',
                'computed'
                ],
            fieldTypes = {
                'user_id': int,
                "xp": int,
                'level': int,
                'base_stats': {
                    'strength': int,
                    'dexterity': int,
                    'constitution': int,
                    'intelligence': int,
                    'wisdom': int,
                    'charisma': int
                    },
                'stats_bonus': {
                    'strength': int,
                    'dexterity': int,
                    'constitution': int,
                    'intelligence': int,
                    'wisdom': int,
                    'charisma': int
                    },
                'stats': {
                    'strength': int,
                    'dexterity': int,
                    'constitution': int,
                    'intelligence': int,
                    'wisdom': int,
                    'charisma': int
                    },
                'modifiers': {
                    'strength': int,
                    'dexterity': int,
                    'constitution': int,
                    'intelligence': int,
                    'wisdom': int,
                    'charisma': int
                    }
                }
            )

    def compute(self):
        config = get_config()
        machine = DndMachine(config['machine'])
        items = get_item_data()

        for stat in items["statistics"]:
            stat = stat["name"]
            self.stats[stat] = self.base_stats[stat] \
                + self.stats_bonus[stat]
            self.modifiers[stat] = int(
                (self.stats[stat] - 10) / 2
                )
            self.saving_throws[stat] = self.modifiers[stat]
            if stat in self.proficienciesSaving_throws:
                self.saving_throws[stat] += self.proficiency

        for skill in items["skills"]:
            stat, skill = skill["stat"], skill["name"]
            self.skills[skill] = self.modifiers[stat]
            if skill in self.proficienciesSkills:
                self.skills[skill] += self.proficiency

        for path, compute in self.computed.iteritems():
            value = machine.resolveMath(
                self, compute.get("formula", ""))
            for bonus in compute.get('bonus', []):
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

class CharacterMapper(JsonObjectDataMapper):
    obj = CharacterObject
    table = "character"
    fields = ['name', 'level']

    def getList(self, search=None):
        """Returns a list of characters matching the search parameter"""
        return self.getMultiple(
            "`name` LIKE :search",
            {"search": '%%%s%%' % search}
            )

    def insert(self, obj):
        """Adds the link between user and character after inserting"""
        new_obj = super(CharacterMapper, self).update(obj)
        self.db.execute("""
            INSERT INTO `user_characters` (`user_id`, `character_id`)
            VALUES (:user_id, :character_id)""",
            new_obj)
        self.db.commit()
        return new_obj

    def delete(self, obj):
        """Removes the link between user and character before deleting"""
        cur = self.db.execute("""
            DELETE FROM `user_characters`
            WHERE `user_id` = :user_id AND `character_id` = :id
            """ % self.table,
            [obj]
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
