from .base import BaseDataObject
from .base import BaseDataMapper

class BackgroundObject(BaseDataObject):
    _pathPrefix = "background"
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
                "uuid": "e8c2488c-3c2e-4cb8-951f-f9a2b1a2c9dd",
                "dict": {
                    "type": "background",
                    "name": self.name,
                    "level": 1,
                    },
                },
            {
                "hidden": True,
                "type": "leveling",
                "path": "sub.%s.leveling" % self.normalizedName,
                "uuid": "c19f2eaa-ecbb-423b-8482-c668fd79799b",
                "given": [
                    {
                        "hidden": True,
                        "path": "sub.%s.level" % self.normalizedName,
                        "type": "value",
                        "uuid": "33971d4a-5120-4583-a3df-add9474516d4",
                        "value_formula": "sub.%s.level + 1" % self.normalizedName,
                        "value_default": 1,
                        },
                    ],
                },
            ]

class BackgroundMapper(BaseDataMapper):
    uuid = "00bb6113-e274-42f5-88b4-df9632ed4347"
    obj = BackgroundObject
    table = "background"
    fields = ["name"]
    order = ["name"]
