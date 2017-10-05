from base import JsonObject, JsonObjectDataMapper

class EncounterObject(JsonObject):
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
                {"min": 15, "max": 20, "modifier": 4.0}
                ]
            }

        super(EncounterObject, self).__init__(
            config,
            pathPrefix = "encounter",
            defaultConfig = {
                'size': 0
                },
            fieldTypes = {
                'user_id': int,
                'size': int,
                'challenge_rating': float,
                'xp_modified': int,
                'modifier': {
                    '*': int
                    },
                'xp_rating': float,
                'xp': int
                }
            )
        self.compute()

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
        if not len(self._monsters):
            return

        self.size = len(self._monsters)
        self.modifierMonster = self.modifierByEncounterSize(self.size)
        self.modifierParty = self.modifierByPartySize(self._party.size) \
            if self._party else 0.0
        self.modifierTotal = 0
        self.modifierTotal = sum(self.modifier.values())

        self.challenge_rating = sum([
            m.challenge_rating
            for m in self._monsters
            ]) * self.modifierMonster
        self.challenge_modified = sum([
            m.challenge_rating
            for m in self._monsters
            ]) * self.modifierTotal
        self.xp = sum([
            m.xp
            for m in self._monsters
            ])
        self.xp_rating = sum([
            m.xp_rating
            for m in self._monsters
            ]) * self.modifierMonster
        self.xp_modified = sum([
            m.xp_rating
            for m in self._monsters
            ]) * self.modifierTotal


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
