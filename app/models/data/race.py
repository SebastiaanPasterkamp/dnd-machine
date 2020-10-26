from .base import BaseDataObject
from .base import BaseDataMapper

class RaceObject(BaseDataObject):
    _pathPrefix = "race"
    _subtype = "subrace"
    _subkey = "race_id"
    _defaultConfig = {
        "name": "",
        "description": "",
        "type": "config",
        "config": [],
        "conditions": [
            {
                "value": 1,
                "path": "character.level",
                "type": "lte",
                },
            ],
        }

    def getDefaultConfig(self, datamapper, char):
        return [
            {
                "hidden": True,
                "path": "sub.%s" % self.normalizedName,
                "type": "dict",
                "uuid": "aab74033-9ef2-425a-92b1-2f6f020c5254",
                "dict": {
                    "type": "race",
                    "name": self.name,
                    "level": 1,
                    },
                },
            {
                "hidden": True,
                "type": "leveling",
                "path": "sub.%s.leveling" % self.normalizedName,
                "uuid": "fcf7f863-a6cd-44db-9d34-799902fde363",
                "given": [
                    {
                        "hidden": True,
                        "path": "sub.%s.level" % self.normalizedName,
                        "type": "value",
                        "uuid": "9db62a94-3d4e-4e86-80d2-9c2aabdcdbae",
                        "value_formula": "sub.%s.level + 1" % self.normalizedName,
                        "value_default": 1,
                        },
                    ],
                },
            ]

class RaceMapper(BaseDataMapper):
    uuid = "ccea31d9-1a0a-424d-8b0a-0c597bf58016"
    obj = RaceObject
    table = "race"
    fields = ["name"]
    order = ["name"]
