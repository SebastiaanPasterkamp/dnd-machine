from base import JsonObject, JsonObjectDataMapper

class MonsterObject(JsonObject):
    def __init__(self, config={}):
        super(MonsterObject, self).__init__(
            config,
            pathPrefix = "monster",
            defaultConfig = {
                "name": u"",
                "size": u"small",
                "type": u"beast",
                "level": 1,
                "motion": {
                    "walk": 20
                    },
                "alignment": u"Neutral Evil",
                "hit_points": 2,
                "hit_points_notation": u"1d4",
                "armor_class": 10,
                "proficiency": 2,
                "traits": [],
                "features": [],
                "languages": [],
                "multiattack": [],
                "attacks": [
                    {"damage": []}
                    ],
                "stats": {
                    "strength": 10,
                    "dexterity": 10,
                    "constitution": 10,
                    "intelligence": 10,
                    "wisdom": 10,
                    "charisma": 10
                    },
                "modifiers": {
                    "strength": 0,
                    "dexterity": 0,
                    "constitution": 0,
                    "intelligence": 0,
                    "wisdom": 0,
                    "charisma": 0
                    },
                "challenge": 0.0,
                "xp": 10
                },
            defaultFieldType = int,
            fieldTypes = {
                'name': unicode,
                'challenge_rating': float,
                'xp_rating': float,
                'xp': int,
                'size': unicode,
                'type': unicode,
                'alignment': unicode,
                'languages': unicode,
                'attacks': {
                    'name': unicode,
                    'description': unicode,
                    'damage': {
                        'type': unicode
                    },
                    'mode': unicode,
                    'target': unicode,
                    'on_hit': unicode,
                    'on_mis': unicode
                    },
                'multiattack': {
                    'name': unicode,
                    'description': unicode,
                    'condition': unicode,
                    'sequence': unicode
                    }
                }
            )

class MonsterMapper(JsonObjectDataMapper):
    obj = MonsterObject
    table = "monster"
    fields = ['name', 'challenge_rating', 'xp_rating', 'xp']

    def getList(self, search=None):
        """Returns a list of parties matching the search parameter"""
        return self.getMultiple(
            "`name` LIKE :search",
            {"search": '%%%s%%' % search}
            )

    def getByEncounterId(self, encounter_id):
        """Returns all monsters in an encounter by encounter_id"""
        cur = self.db.execute("""
            SELECT m.*
            FROM `encounter_monsters` AS em
            JOIN `monster` AS m ON (em.monster_id=m.id)
            WHERE `encounter_id` = ?
            """,
            [encounter_id]
            )
        monsters = cur.fetchall() or []
        return [
            self._read(dict(monster))
            for monster in monsters
            if monster
            ]
