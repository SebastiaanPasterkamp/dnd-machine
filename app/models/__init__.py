from flask import g
import json
import os
import sys

from flask import g

from ..config import get_config

from campaign import CampaignMapper
from character import CharacterMapper
from dndmachine import DndMachine
from encounter import EncounterMapper
from monster import MonsterMapper
from log.adventureleague import AdventureLeagueLogMapper
from npc import NpcMapper
from party import PartyMapper
from user import UserMapper
from item.armor import ArmorMapper
from item.weapons import WeaponMapper
from item.spell import SpellMapper
from items import ItemsObject

class Datamapper(object):
    """Contains instances for each type.
    """
    def __init__(self, db):
        self.db = db
        self._creators = {
            'machine': lambda: DndMachine(get_config()['machine'], self),
            'adventureleague': lambda: AdventureLeagueLogMapper(db),
            'user': lambda: UserMapper(db),
            'party': lambda: PartyMapper(db),
            'character': lambda: CharacterMapper(db, self),
            'encounter': lambda: EncounterMapper(db),
            'monster': lambda: MonsterMapper(db, self),
            'npc': lambda: NpcMapper(db, self),
            'armor': lambda: ArmorMapper(db),
            'weapon': lambda: WeaponMapper(db),
            'spell': lambda: SpellMapper(db),
            'campaign': lambda: CampaignMapper(db),
            'items': lambda: ItemsObject(
                os.path.abspath(
                    os.path.join(
                        os.path.dirname(__file__),
                        '..',
                        'item-data.json'
                        )
                    )
                ),
            }

    def __contains__(self, mapper):
        return mapper in self._creators

    def __getitem__(self, mapper):
        if mapper not in self.__dict__:
            self.__dict__[mapper] = self._creators[mapper]()
        return self.__dict__[mapper]

    def __getattr__(self, mapper):
        if mapper not in self.__dict__:
            self.__dict__[mapper] = self._creators[mapper]()
        return self.__dict__[mapper]
