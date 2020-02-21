import os
import sys
import json

from .campaign import CampaignMapper
from .character import CharacterMapper
from .data.race import RaceMapper
from .data.subrace import SubRaceMapper
from .data.klass import ClassMapper
from .data.subclass import SubClassMapper
from .data.background import BackgroundMapper
from .data.options import OptionsMapper
from .dndmachine import DndMachine
from .encounter import EncounterMapper
from .monster import MonsterMapper
from .log.adventureleague import AdventureLeagueLogMapper
from .npc import NpcMapper
from .party import PartyMapper
from .user import UserMapper
from .item.armor import ArmorMapper
from .item.gear import GearMapper
from .item.weapons import WeaponMapper
from .item.spell import SpellMapper
from .items import ItemsObject

class Datamapper(object):
    """Contains instances for each type.
    """
    _CREATORS = {
        'machine': lambda self: DndMachine(self.app.config['machine'], self),
        # base
        'campaign': lambda self: CampaignMapper(self.app.db),
        'character': lambda self: CharacterMapper(self.app.db, self),
        'encounter': lambda self: EncounterMapper(self.app.db),
        'monster': lambda self: MonsterMapper(self.app.db, self),
        'npc': lambda self: NpcMapper(self.app.db, self),
        'party': lambda self: PartyMapper(self.app.db),
        'user': lambda self: UserMapper(self.app.db),
        # data
        'background': lambda self: BackgroundMapper(self.app.db),
        'class': lambda self: ClassMapper(self.app.db),
        'subclass': lambda self: SubClassMapper(self.app.db),
        'options': lambda self: OptionsMapper(self.app.db),
        'race': lambda self: RaceMapper(self.app.db),
        'subrace': lambda self: SubRaceMapper(self.app.db),
        # item
        'armor': lambda self: ArmorMapper(self.app.db),
        'gear': lambda self: GearMapper(self.app.db),
        'weapon': lambda self: WeaponMapper(self.app.db),
        'spell': lambda self: SpellMapper(self.app.db),
        # log
        'adventureleague': lambda self: AdventureLeagueLogMapper(self.app.db),
        # static
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
