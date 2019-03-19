from base import JsonObject, JsonObjectDataMapper

class PartyObject(JsonObject):
    _version = '1.0'
    _pathPrefix = "party"
    _defaultConfig = {
        'size': 0,
        'member_ids': [],
        }
    _fieldTypes = {
        'id': int,
        'user_id': int,
        'size': int,
        'challenge': {
            "*": int
            },
        'member_ids': int
        }
    _defaultConfig = {
        'challenge': {}
        }

    def __init__(self, config={}):
        self._members = []
        super(PartyObject, self).__init__(config)

    @property
    def members(self):
        return self._members

    @members.setter
    def members(self, members):
        self._members = members
        self.member_ids = [
            member.id
            for member in members
            ]
        self.compute()

    def migrate(self, mapper):
        self.members = mapper.character.getByIds(self.member_ids)
        for member in self.members:
            member.migrate(mapper)
        super(PartyObject, self).migrate()

    def compute(self):
        self.size = len(self.member_ids)
        self.challenge = {}
        for cr in ['easy', 'medium', 'hard', 'deadly']:
            self.challenge[cr] = sum([
                member.challenge[cr]
                for member in self.members
                ])


class PartyMapper(JsonObjectDataMapper):
    obj = PartyObject
    table = "party"
    fields = ['name', 'user_id']
    order = 'name'
    join_tables = {
        'party_characters': ('id', 'party_id'),
        }

    def _read(self, dbrow):
        obj = super(PartyMapper, self)._read(dbrow)
        if obj is None:
            return obj
        obj.member_ids = self.getMemberIds(obj.id)
        return obj

    def getList(self, search=None):
        """Returns a list of parties matching the search parameter"""
        return self.getMultiple(
            "`name` LIKE :search",
            {"search": '%%%s%%' % search}
            )

    def getByDmUserId(self, user_id):
        """Returns all parties run by the DM by user_id"""
        self.getMultiple(
            "`user_id` = ?",
            [user_id]
            )

    def getIdsByDmUserId(self, user_id):
        """Returns all party IDs run by the DM by user_id"""
        cur = self.db.execute("""
            SELECT id
            FROM `%s`
            WHERE `user_id` = ?
            """ % self.table,
            [user_id]
            )
        parties = cur.fetchall() or []
        return [
            party['id']
            for party in parties
            ]

    def getByUserId(self, user_id):
        """Returns all parties where a user by user_id
        has characters involved"""
        cur = self.db.execute("""
            SELECT p.*
            FROM `%s` AS p
            JOIN `party_characters` AS pc ON (p.id = pc.party_id)
            JOIN `character` AS c ON (c.id = pc.character_id)
            WHERE c.`user_id` = ?
            """ % self.table,
            [user_id]
            )
        parties = cur.fetchall() or []
        return [
            self._read(dict(party))
            for party in parties
            if party
            ]

    def getIdsByUserId(self, user_id):
        """Returns all party IDs where a user by user_id
        has characters involved"""
        cur = self.db.execute("""
            SELECT pc.party_id as id
            FROM `party_characters` AS pc
            JOIN `character` AS c ON (c.id = pc.character_id)
            WHERE c.`user_id` = ?
            """,
            [user_id]
            )
        parties = cur.fetchall() or []
        return [
            party['id']
            for party in parties
            ]

    def getMemberIds(self, party_id):
        """Returns all character IDs in a party by party_id"""
        cur = self.db.execute("""
            SELECT `character_id` AS `id`
            FROM `party_characters`
            WHERE `party_id` = ?
            ORDER BY `character_id` ASC
            """,
            [party_id]
            )
        characters = cur.fetchall() or []
        return [
            character['id']
            for character in characters
            ]

    def fillJoinTables(self, obj):
        """Populates entries in party_characters table"""
        if not len(obj.member_ids):
            return

        self.db.executemany("""
            INSERT INTO `party_characters`
                (`party_id`, `character_id`)
            VALUES (?, ?)
            """, [
                (obj.id, member)
                for member in obj.member_ids
                ])
        self.db.commit()
