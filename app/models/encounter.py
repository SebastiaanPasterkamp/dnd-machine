from base import JsonObject, JsonObjectDataMapper

class EncounterObject(JsonObject):
    _version = '1.0'
    _pathPrefix = "encounter"
    _defaultConfig = {
        'size': 0,
        'loot': []
        }
    _fieldTypes = {
        'user_id': int,
        'size': int,
        'challenge_rating_sum': float,
        'challenge_rating': float,
        'challenge_modified': float,
        'modifier': {
            '*': float
            },
        'xp_rating_sum': int,
        'xp_rating': float,
        'xp_modified': int,
        'xp': int,
        'loot': {
            'count': int
            }
        }

    def __init__(self, config={}):
        self._party = None
        self._monsters = []
        self._encounter_modifiers = {
            "party": [
                {"min": 1, "max": 2, "modifier": 0.5},
                {"min": 3, "max": 5, "modifier": 0.0},
                {"min": 6, "max": 8, "modifier": -0.5}
                ],
            "encounter": [
                {"min": 1, "max": 1, "modifier": 1.0},
                {"min": 2, "max": 2, "modifier": 1.5},
                {"min": 3, "max": 6, "modifier": 2.0},
                {"min": 7, "max": 10, "modifier": 2.5},
                {"min": 11, "max": 14, "modifier": 3.0},
                {"min": 15, "max": 20, "modifier": 4.0},
                {"min": 21, "max": 30, "modifier": 5.0}
                ]
            }
        super(EncounterObject, self).__init__(config)

    @property
    def party(self):
        return self._party

    @party.setter
    def party(self, party):
        self._party = party
        self.compute()

    @property
    def monsters(self):
        return self._monsters

    @monsters.setter
    def monsters(self, monsters):
        self._monsters = monsters
        self.compute()

    def modifierByPartySize(self, size):
        for data in self._encounter_modifiers['party']:
            if data['min'] <= size <= data['max']:
                return data['modifier']
        return 0.0

    def modifierByEncounterSize(self, size):
        for data in self._encounter_modifiers['encounter']:
            if data['min'] <= size <= data['max']:
                return data['modifier']
        return 1.0

    def compute(self):
        self.config = self.castFieldType(self.config)
        self.version = self._version

        self.loot = [
            item
            for item in self.loot or []
            if item['name']
            ]

        if self._party is not None:
            self.modifierParty = self.modifierByPartySize(self._party.size)
        else:
            self.modifierParty = 0.0

        if len(self._monsters):
            self.size = len(self._monsters)
            self.modifierMonster = self.modifierByEncounterSize(self.size)

            self.xp = sum([
                m.xp
                for m in self._monsters
                ])
            self.challenge_rating_sum = sum([
                m.challenge_rating
                for m in self._monsters
                ])
            self.xp_rating_sum = sum([
                m.xp_rating
                for m in self._monsters
                ])

        challenge_rating_sum = self.challenge_rating_sum or 0.0
        xp_rating_sum = self.xp_rating_sum or 0
        modifierMonster = self.modifierMonster or 0
        modifierParty = self.modifierParty or 0

        self.challenge_rating = challenge_rating_sum * modifierMonster
        self.xp_rating = xp_rating_sum * modifierMonster

        self.modifierTotal = modifierMonster + modifierParty
        self.challenge_modified = challenge_rating_sum * self.modifierTotal
        self.xp_modified = xp_rating_sum * self.modifierTotal


class EncounterMapper(JsonObjectDataMapper):
    obj = EncounterObject
    table = "encounter"
    fields = [
        'name', 'user_id',
        'size', 'challenge_rating', 'xp_rating', 'xp']

    def getList(self, search=None):
        """Returns a list of encounters matching the search parameter"""
        return self.getMultiple(
            "`name` LIKE :search",
            {"search": '%%%s%%' % search}
            )

    def getByDmUserId(self, user_id):
        """Returns all encounterx created by DM by user_id"""
        cur = self.db.execute("""
            SELECT *
            FROM `%s`
            WHERE `user_id` = ?
            """ % self.table,
            [user_id]
            )
        encounters = cur.fetchall() or []
        return [
            self._read(dict(encounter))
            for encounter in encounters
            if encounter is not None
            ]

    def addMonster(self, encounter_id, monster_id):
        """Add monster to encounter"""
        cur = self.db.execute("""
            INSERT INTO `encounter_monsters` (`encounter_id`, `monster_id`)
            VALUES (?, ?)
            """,
            [encounter_id, monster_id]
            )
        self.db.commit()

    def delMonster(self, encounter_id, monster_id):
        """Remopves monster from encounter"""
        cur = self.db.execute("""
            DELETE FROM `encounter_monsters`
            WHERE
                `encounter_id` = ?
                AND `monster_id` = ?
                LIMIT 1
            """,
            [encounter_id, monster_id]
            )
        self.db.commit()
