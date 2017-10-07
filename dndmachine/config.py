# -*- coding: utf-8 -*-
import os
import json
import codecs

config = None

def get_config():
    global config
    if config is None:
        with open(os.path.join('dndmachine', 'config.json')) as cfg:
            config = json.load(cfg)
    return config

def get_character_data():
    with open(os.path.join('dndmachine', 'character-data.json')) as cfg:
        character_data = json.load(cfg)
        for section in ['race', 'class', 'background']:
            for part in character_data[section]:
                mdfile = os.path.join(
                    'dndmachine', 'data', part['filename'])
                with codecs.open(mdfile, encoding='utf-8') as fh:
                    part['description'] = fh.read()
        return character_data

def get_npc_data():
    with open(os.path.join('dndmachine', 'npc-data.json')) as cfg:
        return json.load(cfg)

def get_item_data():
    with open(os.path.join('dndmachine', 'item-data.json')) as cfg:
        return json.load(cfg)
