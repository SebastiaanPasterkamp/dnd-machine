# -*- coding: utf-8 -*-
import os
import json

config = None

def get_config():
    global config
    if config is None:
        with open(os.path.join('dndmachine', 'config.json')) as cfg:
            config = json.load(cfg)
    return config

def get_character_data():
    with open(os.path.join('dndmachine', 'character-data.json')) as cfg:
        return json.load(cfg)

def get_item_data():
    with open(os.path.join('dndmachine', 'item-data.json')) as cfg:
        return json.load(cfg)
