# -*- coding: utf-8 -*-
import os
import json
import codecs

config = None
data = {}
def get_config():
    global config
    if config is None:
        path = os.path.join('app', 'config.json')
        with open(path) as cfg:
            config = json.load(cfg)
        path = os.path.join('app', 'config.local.json')
        if os.path.exists(path):
            with open(path) as cfg:
                config.update(json.load(cfg))
    return config

def get_character_data():
    global data
    if 'character_data' in data:
        return data['character-data']
    with open(os.path.join('app', 'character-data.json')) as cfg:
        data['character-data'] = json.load(cfg)

        def getSets(path):
            path = path.split('.')
            config = data['character-data']['sets']
            for step in path:
                config = config[step]
            return config

        def inlineIncludes(data):
            if isinstance(data, dict):
                if 'include' in data:
                    data.update(getSets(data['include']))
                    del data['include']
                for key, value in list(data.items()):
                    inlineIncludes(value)
            if isinstance(data, list):
                for value in data:
                    inlineIncludes(value)

        inlineIncludes(data['character-data'])

    return data['character-data']

def get_npc_data():
    global data
    if 'npc-data' in data:
        return data['npc-data']
    with open(os.path.join('app', 'npc-data.json')) as cfg:
        data['npc-data'] = json.load(cfg)
    return data['npc-data']

def get_item_data():
    global data
    if 'item-data' in data:
        return data['item-data']
    with open(os.path.join('app', 'item-data.json')) as cfg:
        data['item-data'] = json.load(cfg)
    return data['item-data']
