from base import JsonObject, JsonObjectDataMapper

class EncounterObject(JsonObject):
    def __init__(self, config={}):
        super(EncounterObject, self).__init__(
            config,
            pathPrefix = "encounter",
            fieldTypes = {
                'user_id': int,
                'size': int,
                'challenge_rating': float,
                'xp_rating': float,
                'xp': int
                },
            keepFields = [
                'user_id',
                'size', 'challenge_rating', 'xp_rating', 'xp'
                ]
            )

class EncounterMapper(JsonObjectDataMapper):
    obj = EncounterObject
    table = "encounter"
    fields = [
        'name', 'user_id',
        'size', 'challenge_rating', 'xp_rating', 'xp']

    def __init__(self, db, config):
        super(EncounterMapper, self).__init__(db)
        self.encounter_modifiers = config["encounter_modifiers"]

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

    def modifierByPartySize(self, size):
        for data in self.encounter_modifiers['party']:
            if data['min'] <= size <= data['max']:
                return data['modifier']
        return 0.0

    def modifierByEncounterSize(self, size):
        for data in self.encounter_modifiers['encounter']:
            if data['min'] <= size <= data['max']:
                return data['modifier']
        return 1.0

    def computeChallenge(self, encounter, monsters=[], party=None):
        encounter.size = len(monsters)
        encounter.modifier = {
            'party': self.modifierByPartySize(party['size']) if party else 0.0,
            'monster': self.modifierByEncounterSize(encounter['size'])
            }
        encounter.modifierTotal = sum(encounter['modifier'].values())

        encounter['challenge_rating'] = sum([
            m['challenge_rating']
            for m in monsters
            ]) * encounter['modifier']['monster']
        encounter['challenge_modified'] = sum([
            m['challenge_rating']
            for m in monsters
            ]) * encounter['modifier']['total']
        encounter['xp'] = sum([
            m['xp']
            for m in monsters
            ])
        encounter['xp_rating'] = sum([
            m['xp_rating']
            for m in monsters
            ]) * encounter['modifier']['monster']
        encounter['xp_modified'] = sum([
            m['xp_rating']
            for m in monsters
            ]) * encounter['modifier']['total']
        return encounter
