from base import JsonObject, JsonObjectDataMapper
from datetime import date

class AdventureLeagueLogObject(JsonObject):
    _pathPrefix = "adventureleaguelog"
    _defaultConfig = {
        'adventure': {
            'name': u'',
            'id': u'',
            'date': date.today(),
            'dm': {
                'name': u'',
                'dci': u'',
                },
            },
        'xp': {
            'starting': 0,
            'earned': 0,
            'total': 0,
            },
        'gold': {
            'starting': 0,
            'earned': 0,
            'total': 0,
            },
        'downtime': {
            'starting': 0,
            'earned': 0,
            'total': 0,
            },
        'renown': {
            'starting': 0,
            'earned': 0,
            'total': 0,
            },
        'items': {
            'starting': 0,
            'earned': [],
            'total': 0,
            },
        'notes': u'',
        }
    _fieldTypes = {
        'id': int,
        'user_id': int,
        'character_id': int,
        'adventure': {
            'date': date,
            'dm': {
                '*': unicode,
                },
            },
        'xp': {
            '*': int,
            },
        'gold': {
            '*': int,
            },
        'downtime': {
            '*': int,
            },
        'renown': {
            '*': int,
            },
        'items': {
            '*': int,
            'earned': unicode,
            },
        }

class AdventureLeagueLogMapper(JsonObjectDataMapper):
    obj = AdventureLeagueLogObject
    table = "adventureleaguelog"
    fields = ['user_id', 'character_id']

    def getByUserId(self, user_id):
        """Returns all adventure league logs created by user_id"""
        cur = self.db.execute("""
            SELECT *
            FROM `%s`
            WHERE `user_id` = ?
            """ % self.table,
            [user_id]
            )
        objs = cur.fetchall() or []
        return [
            self._read(dict(objs))
            for obj in objs
            if obj
            ]

    def getByCharacterId(self, character_id):
        """Returns all adventure league logs created by
        character_id
        """
        cur = self.db.execute("""
            SELECT *
            FROM `%s`
            WHERE `character_id` = ?
            """ % self.table,
            [character_id]
            )
        objs = cur.fetchall() or []
        return [
            self._read(dict(objs))
            for obj in objs
            if obj
            ]
