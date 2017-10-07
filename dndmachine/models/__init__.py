from flask import g
import json

from flask import g

from ..config import get_config, get_item_data

from campaign import CampaignMapper
from character import CharacterMapper
from dndmachine import DndMachine
from encounter import EncounterMapper
from monster import MonsterMapper
from party import PartyMapper
from user import UserMapper

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
        self.campaign = CampaignMapper(db)
