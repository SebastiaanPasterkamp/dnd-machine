from ..base import JsonObject, JsonObjectDataMapper
from datetime import date

class AdventureLeagueLogObject(JsonObject):
    _pathPrefix = "adventureleaguelog"
    _defaultConfig = {
        'consumed': False,
        'adventure': {
            'name': u'',
            'id': u'',
            'date': date.today(),
            'dm_name': u'',
            'dm_dci': u'',
            },
        'adventure_checkpoints': {
            'starting': 0,
            'earned': 0,
            'total': 0,
            },
        'xp': {
            'starting': 0,
            'earned': 0,
            'total': 0,
            },
        'treasure_checkpoints': {},
        'gold': {
            'starting': {},
            'earned': {},
            'total': {},
            },
        'downtime': {
            'starting': 0,
            'earned': 5,
            'total': 0,
            },
        'renown': {
            'starting': 0,
            'earned': 1,
            'total': 0,
            },
        'equipment': {
            'starting': 0,
            'earned': [],
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
        'consumed': bool,
        'adventure_checkpoints': {
            '*': int,
            },
        'xp': {
            '*': int,
            },
        'treasure_checkpoints': {
            '*': {
                '*': int,
                }
            },
        'gold': {
            '*': {
                '*': int,
                }
            },
        'downtime': {
            '*': int,
            },
        'renown': {
            '*': int,
            },
        'equipment': {
            '*': int,
            'earned': unicode,
            },
        'items': {
            '*': int,
            'earned': unicode,
            },
        'character_snapshot': {
            '*': int,
            },
        }

    def migrate(self, mapper):
        # Fix incorrect nesting of e.g. goldEarnedEarned
        if self.gold:
            for group, coins in self.gold.items():
                self.setPath(
                    ['gold', group],
                    dict(
                        (coin, value)
                        for coin, value in coins.items()
                        if value \
                            and coin not in [
                                'starting',
                                'earned',
                                'total'
                                ]
                        )
                    )
            if not self.goldEarned:
                del self.gold

        # Fix swapped key nesting
        if self.treasure_checkpoints \
                and not 'earned' in self.treasure_checkpoints:
            tp = {}
            for tier, changes in self.treasure_checkpoints.items():
                for change, value in changes.items():
                    tp.setdefault(change, {})
                    tp[change][tier] = value
            self._config['treasure_checkpoints'] = tp

class AdventureLeagueLogMapper(JsonObjectDataMapper):
    obj = AdventureLeagueLogObject
    table = "adventureleaguelog"
    fields = ['user_id', 'character_id', 'consumed']

    def getByUserId(self, user_id):
        """Returns all adventure league logs created by user_id"""
        return self.getMultiple(
            "`user_id` = ?",
            [user_id]
            )

    def getByCharacterId(self, character_id):
        """Returns all adventure league logs created by
        character_id
        """
        return self.getMultiple(
            "`character_id` = ?",
            [character_id]
            )
