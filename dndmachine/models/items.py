import json
import re

from base import JsonObject

class ItemsObject(JsonObject):
    def __init__(self, path):
        items = {}
        with open(path) as fh:
            items = json.load(fh)

        super(ItemsObject, self).__init__(
            items,
            pathPrefix = "items",
            fieldTypes = {
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
                    '*': {
                        'items': {
                            'weight': {
                                '*': float
                                },
                            'worth': {
                                '*': int
                                }
                            }
                        },
                    'trinket': unicode
                    }
                }
            )
        self.compute()

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


    def listByName(self, name, paths):
        def _tokens(name):
            return set(re.split(r'/\s*,\s*/', name.lower()))
        name = _tokens(name)
        matches = []
        for item in self.getList(paths):
            if isinstance(item, dict) \
                    and 'name' in data \
                    and _tokens(data['name']) == name:
                matches.append(data)
        return matches[0]

    def itemByName(self, name, paths, default=None):
        matches = self.listByName(name, paths, default)
        if matches:
            return matches[0]
        return default