from base import JsonObject, JsonObjectDataMapper

class PartyObject(JsonObject):
    def __init__(self, config={}):
        self._members = []
        super(PartyObject, self).__init__(
            config,
            pathPrefix = "party",
            fieldTypes = {
                'user_id': int,
                'challenge': {
                    "*": int
                    }
                },
            defaultConfig = {
                'challenge': {}
                }
            )
        self.compute()

    @property
    def members(self):
        return self._members

    @members.setter
    def members(self, members):
        self._members = members
        self.compute()

    def compute(self):
        if self._members:
            self.size = len(self._members)
            for cr in ['easy', 'medium', 'hard', 'deadly']:
                self.challenge[cr] = sum([c.challenge[cr] for c in self._members])


class PartyMapper(JsonObjectDataMapper):
    obj = PartyObject
    table = "party"
    fields = ['name', 'user_id']

    def getList(self, search=None):
        """Returns a list of parties matching the search parameter"""
        return self.getMultiple(
            "`name` LIKE :search",
            {"search": '%%%s%%' % search}
            )

    def getByDmUserId(self, user_id):
        """Returns all parties run by the DM by user_id"""
        cur = self.db.execute("""
            SELECT *
            FROM `%s`
            WHERE `user_id` = ?
            """ % self.table,
            [user_id]
            )
        parties = cur.fetchall() or []
        return [
            self._read(dict(party))
            for party in parties
            if party
            ]

    def getByUserId(self, user_id):
        """Returns all parties where a user by user_id
        has characters involved"""
        cur = self.db.execute("""
            SELECT p.*
            FROM `%s` AS p
            JOIN `party_characters` AS pc ON (p.id=pc.party_id)
            JOIN `user_characters` AS uc USING (character_id)
            WHERE uc.`user_id` = ?
            """ % self.table,
            [user_id]
            )
        parties = cur.fetchall() or []
        return [
            self._read(dict(party))
            for party in parties
            if party
            ]

    def addCharacter(self, party_id, character_id):
        """Add character to party"""
        cur = self.db.execute("""
            INSERT INTO `party_characters` (`party_id`, `character_id`)
            VALUES (?, ?)
            """,
            [party_id, character_id]
            )
        self.db.commit()

    def delCharacter(self, party_id, character_id):
        """Removes character from party"""
        cur = self.db.execute("""
            DELETE FROM `party_characters`
            WHERE
                `party_id` = ?
                AND `character_id` = ?
            """,
            [party_id, character_id]
            )
        self.db.commit()
