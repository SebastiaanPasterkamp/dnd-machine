import json
import re

from base import JsonObject

class ItemsObject(JsonObject):
    _pathPrefix = "items"
    _fieldTypes = {
        'id': int,
        'size_hit_dice': {
            'dice_size': int
            },
        'armor': {
            '*': {
                'items': {
                    'cost': {
                        "*": int
                        }
                    }
                },
            'shield': {
                'items': {
                    'bonus': int,
                    'cost': {
                        "*": int
                        }
                    }
                }
            },
        'weapons': {
            'name': unicode,
            '*': {
                'name': unicode,
                '*': {
                    'items': {
                        'cost': {
                            "*": int
                            },
                        'damage': {
                            'value': int,
                            'dice_count': int,
                            'dice_size': int
                            },
                        'versatile': {
                            'value': int,
                            'dice_count': int,
                            'dice_size': int
                            },
                        'range': {
                            '*': int
                            }
                        }
                    }
                }
            },
        'tools': {
            'weight': {
                '*': float
                },
            'worth': {
                '*': int
                }
            }
        }

    def __init__(self, path):
        items = {}
        with open(path) as fh:
            items = json.load(fh)
        super(ItemsObject, self).__init__(items)

    def getList(self, paths):
        paths = paths.split(',')
        matches = []
        for path in paths:
            path = self.splitPath(path)
            data = self.getPath(path)
            if data is None:
                continue
            if not isinstance(data, list):
                data = [data]
            matches.extend(data)
        return matches

    def listByNameOrCode(self, name, paths):
        def _tokens(name):
            return set(re.split(r'/\s*,\s*/', name.lower()))
        name = _tokens(name)
        matches = []
        for item in self.getList(paths):
            if not isinstance(item, dict):
                continue
            options = [
                _tokens(item.get('code', '')),
                _tokens(item.get('name', '')),
                _tokens(item.get('label', '')),
                ]
            if name in options:
                matches.append(item)
        return matches

    def itemByNameOrCode(self, name, paths, default=None):
        matches = self.listByNameOrCode(name, paths)
        if matches:
            return matches[0]
        return default
