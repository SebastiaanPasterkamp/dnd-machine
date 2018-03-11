from base import JsonObject, JsonObjectDataMapper

class EncounterObject(JsonObject):
    _version = '1.0'
    _pathPrefix = "encounter"
    _defaultConfig = {
        'size': 0,
        'monster_ids': [],
        'loot': [],
        }
    _fieldTypes = {
        'id': int,
        'user_id': int,
        'size': int,
        'monster_ids': {
            '*': int,
            },
        'challenge_rating': float,
        'challenge_rating_sum': float,
        'challenge_rating_precise': float,
        'challenge_rating_precise_sum': float,
        'challenge_modified': float,
        'modifier': {
            '*': float
            },
        'xp': int,
        'xp_modified': int,
        'xp_rating_sum': int,
        'xp_rating': float,
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

    def migrate(self, mapper):
        if not len(self.monster_ids or []):
            monster_ids = [
                monster.id
                for monster in mapper.monster.getByEncounterId(self.id)
                ]
            monster_ids = dict(
                (monster_id, monster_ids.count(monster_id))
                for monster_id in monster_ids
                )
            self.monster_ids = [
                {'id': monster_id, 'count': count}
                for monster_id, count in monster_ids.items()
                ]

        monsters = []
        for m in self.monster_ids:
            monster = mapper.monster.getById(m['id'])
            monster.migrate()
            monsters.append(monster)
        self.monsters = monsters

        super(EncounterObject, self).migrate()

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
        self.version = self._version

        self.modifierParty = 0.0
        if self.party is not None:
            self.modifierParty = self.modifierByPartySize(self._party.size)

        self.size = sum([
            monster['count']
            for monster in self.monster_ids
            ])
        self.modifierMonster = self.modifierByEncounterSize(self.size)

        self.challenge_rating_sum = 0.0
        self.challenge_rating_precise_sum = 0.0
        self.xp = 0
        self.xp_rating_sum = 0
        for m in self.monster_ids:
            monster = next((
                monster for monster in self.monsters
                if monster.id == m['id']
                ), None)
            self.xp += \
                monster.xp * m['count']
            self.challenge_rating_sum += \
                monster.challenge_rating * m['count']
            self.challenge_rating_precise_sum += \
                monster.challenge_rating_precise * m['count']
            self.xp_rating_sum += \
                monster.xp_rating * m['count']

        modifierMonster = self.modifierMonster

        self.challenge_rating = \
            self.challenge_rating_sum * modifierMonster

        self.modifierTotal = \
            modifierMonster + self.modifierParty
        self.challenge_modified = \
            self.challenge_rating_sum * self.modifierTotal
        self.xp_modified = \
            self.xp * self.modifierTotal
        self.challenge_rating_precise = \
            self.challenge_rating_precise_sum * self.modifierTotal
        self.xp_rating = \
            self.xp_rating_sum * modifierMonster


class EncounterMapper(JsonObjectDataMapper):
    obj = EncounterObject
    table = "encounter"
    fields = [
        'name', 'user_id',
        'size', 'challenge_rating', 'xp_rating', 'xp']

    def _readx(self, dbrow):
        obj = super(EncounterMapper, self)._read(dbrow)
        if obj is None:
            return obj
        cur = self.db.execute("""
            SELECT `monster_id` AS `id`, `count`
            FROM `encounter_monsters`
            WHERE `encounter_id` = ?
            """,
            [obj.id]
            )
        obj.monster_ids = [
            dict(row)
            for row in cur.fetchall() or []
            ]
        return obj

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

    def insert(self, obj):
        """Insert a new encounter; updates encounter_monsters table"""
        result = super(EncounterMapper, self).insert(obj)

        if not len(obj.monster_ids):
            return result

        self.db.executemany("""
            INSERT INTO `encounter_monsters`
                (`encounter_id`, `monster_id`, `count`)
            VALUES (?, ?, ?)
            """, [
                (result.id, monster['id'], monster['count'])
                for monster in obj.monster_ids
                if monster['count'] > 0
                ])
        self.db.commit()
        return result

    def update(self, obj):
        """Insert a new encounter; updates encounter_monsters table"""
        result = super(EncounterMapper, self).update(obj)

        self.db.execute("""
            DELETE FROM `encounter_monsters`
            WHERE `encounter_id` = ?
            """,
            [result.id]
            )

        if not len(obj.monster_ids):
            return result

        self.db.executemany("""
            INSERT INTO `encounter_monsters`
                (`encounter_id`, `monster_id`, `count`)
            VALUES (?, ?, ?)
            """, [
                (result.id, monster['id'], monster['count'])
                for monster in obj.monster_ids
                if monster['count'] > 0
                ])
        self.db.commit()
        return result
