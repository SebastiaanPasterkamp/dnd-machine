from datetime import date

from ..base import JsonObject, JsonObjectDataMapper

class AdventureLeagueLogObject(JsonObject):
    _pathPrefix = "adventureleaguelog"
    _defaultConfig = {
        'consumed': False,
        'adventure': {
            'name': '',
            'id': '',
            'date': date.today(),
            'dm_name': '',
            'dm_dci': '',
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
        "slow_progress": False,
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
        'notes': '',
        }
    _fieldTypes = {
        'id': int,
        'user_id': int,
        'character_id': int,
        'consumed': bool,
        'adventure_checkpoints': {
            '*': float,
            },
        'xp': {
            '*': int,
            },
        'treasure_checkpoints': {
            '*': {
                '*': float,
                }
            },
        'gold': {
            '*': {
                '*': int,
                }
            },
        'downtime': {
            '*': float,
            },
        'renown': {
            '*': float,
            },
        'equipment': {
            '*': int,
            'earned': str,
            },
        'items': {
            '*': int,
            'earned': str,
            },
        'character_snapshot': {
            '*': int,
            'acp_progress': float,
            'adventure_checkpoints': float,
            },
        }

    def migrate(self, mapper):
        # Fix incorrect nesting of e.g. goldEarnedEarned
        if self.gold:
            for group, coins in list(self.gold.items()):
                self.setPath(
                    ['gold', group],
                    dict(
                        (coin, value)
                        for coin, value in list(coins.items())
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
            for tier, changes in list(self.treasure_checkpoints.items()):
                for change, value in list(changes.items()):
                    tp.setdefault(change, {})
                    tp[change][tier] = value
            self._config['treasure_checkpoints'] = tp

        # Remove renown/downtime ; computed from ACP
        if self.adventure_checkpointsEarned:
            self.downtimeEarned = min(self.downtimeEarned, 0)
            self.downtimeTotal = self.downtimeStarting \
                + self.downtimeEarned
            self.renownEarned = min(self.renownEarned, 0)
            self.renownTotal = self.renownStarting \
                + self.renownEarned


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
