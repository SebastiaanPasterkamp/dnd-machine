from base import JsonObject, JsonObjectDataMapper

class CharacterObject(JsonObject):
    def __init__(self, config={}):
        super(CharacterObject, self).__init__(
            config,
            pathPrefix = "character",
            defaultConfig = {
                "race": u"",
                "class": u"",
                "background": u"",
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
                'race', 'class', 'background',
                'base_stats', 'stats_bonus',
                'equipment'
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
