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
from item.weapons import WeaponMapper
from items import ItemsObject

class Datamapper(object):
    """Contains instances for each type.
    """
    def __init__(self, db):
        config = get_config()
        self.machine = DndMachine(config['machine'], get_item_data())
        self.user = UserMapper(db)
        self.party = PartyMapper(db)
        self.character = CharacterMapper(db)
        self.encounter = EncounterMapper(db)
        self.monster = MonsterMapper(db)
        self.npc = NpcMapper(db)
        self.weapon = WeaponMapper(db)
        self.campaign = CampaignMapper(db)
        self.items = ItemsObject(
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__),
                    '..',
                    'item-data.json'
                    )
                )
            )

    def __getitem__(self, mapper):
        return self.__dict__[mapper]