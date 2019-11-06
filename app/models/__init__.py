import os
import sys
import json

from .campaign import CampaignMapper
from .character import CharacterMapper
from .dndmachine import DndMachine
from .encounter import EncounterMapper
from .monster import MonsterMapper
from .log.adventureleague import AdventureLeagueLogMapper
from .npc import NpcMapper
from .party import PartyMapper
from .user import UserMapper
from .item.armor import ArmorMapper
from .item.weapons import WeaponMapper
from .item.spell import SpellMapper
from .items import ItemsObject

class Datamapper(object):
    """Contains instances for each type.
    """
    _CREATORS = {
        'machine': lambda self: DndMachine(self.app.config['machine'], self),
        'adventureleague': lambda self: AdventureLeagueLogMapper(self.app.db),
        'user': lambda self: UserMapper(self.app.db),
        'party': lambda self: PartyMapper(self.app.db),
        'character': lambda self: CharacterMapper(self.app.db, self),
        'encounter': lambda self: EncounterMapper(self.app.db),
        'monster': lambda self: MonsterMapper(self.app.db, self),
        'npc': lambda self: NpcMapper(self.app.db, self),
        'armor': lambda self: ArmorMapper(self.app.db),
        'weapon': lambda self: WeaponMapper(self.app.db),
        'spell': lambda self: SpellMapper(self.app.db),
        'campaign': lambda self: CampaignMapper(self.app.db),
        'items': lambda self: ItemsObject(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__),
                    '..',
                    'item-data.json'
                    )
                )
            ),
        }

    def init_app(self, app):
        self.app = app
        app.datamapper = self

    def __contains__(self, mapper):
        return mapper in self._CREATORS

    def __getitem__(self, mapper):
        if mapper not in self.__dict__:
            self.__dict__[mapper] = self._CREATORS[mapper](self)
        return self.__dict__[mapper]

    def __getattr__(self, mapper):
        if mapper not in self.__dict__:
            self.__dict__[mapper] = self._CREATORS[mapper](self)
        return self.__dict__[mapper]
