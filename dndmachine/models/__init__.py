from flask import g
import json

from flask import g

from ..config import get_config, get_item_data
from .. import get_db

from campaign import CampaignMapper
from character import CharacterMapper
from dndmachine import DndMachine
from encounter import EncounterMapper
from monster import MonsterMapper
from party import PartyMapper
from user import UserMapper

def datamapper_factory(datamapper):
    """Returns a datamapper for a type.
    """
    config = get_config()
    if datamapper == 'machine':
        return DndMachine(config['machine'], get_item_data())
    if datamapper == 'user':
        return UserMapper(get_db())
    if datamapper == 'party':
        return PartyMapper(get_db())
    if datamapper == 'character':
        return CharacterMapper(get_db())
    if datamapper == 'encounter':
        return EncounterMapper(get_db())
    if datamapper == 'monster':
        return MonsterMapper(get_db())
    if datamapper == 'campaign':
        return CampaignMapper(get_db())
    raise ValueError("No datamapper for %s" % datamapper)

def mergeDict(a, b, path=None):
    "merges b into a"
    if path is None: path = []

    if not isinstance(a, dict) or not isinstance(b, dict):
        raise Exception("Conflict: a (%s) or b (%s) is not a dict" % (
            type(a), type(b)
            ))

    for key in b:
        if key in a:
            if isinstance(a[key], dict) and isinstance(b[key], dict):
                mergeDict(a[key], b[key], path + [str(key)])
            elif type(a[key]) != type(b[key]):
                raise Exception('Conflict at %s: %s vs %s' % (
                    '.'.join(path + [key]),
                    type(a[key]), type(b[key])
                    ))
        else:
            a[key] = b[key]
    return a
