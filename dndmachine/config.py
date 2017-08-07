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
