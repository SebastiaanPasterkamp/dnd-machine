from flask import g
import json
import os
import sys

from flask import g

from ..config import get_config, get_item_data

from campaign import CampaignMapper
from character import CharacterMapper
from dndmachine import DndMachine
from encounter import EncounterMapper
from monster import MonsterMapper
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
            'machine': lambda: DndMachine(
                get_config()['machine'], get_item_data()),
            'user': lambda: UserMapper(self.db),
            'party': lambda: PartyMapper(db),
            'character': lambda: CharacterMapper(db),
            'encounter': lambda: EncounterMapper(db),
            'monster': lambda: MonsterMapper(db),
            'npc': lambda: NpcMapper(db),
            'armor': lambda: ArmorMapper(db),
            'weapons': lambda: WeaponMapper(db),
            'spells': lambda: SpellMapper(db),
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
