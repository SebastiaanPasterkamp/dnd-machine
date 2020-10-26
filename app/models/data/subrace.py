from .base import BaseDataObject
from .base import BaseDataMapper

class SubRaceObject(BaseDataObject):
    _pathPrefix = "subrace"

    def getDefaultConfig(self, datamapper, char):
        race = datamapper.race.getById(self.race_id)
        assert race is not None

        return [
            {
                "hidden": True,
                "path": "sub.%s" % self.normalizedName,
                "type": "dict",
                "uuid": "657e04e6-3dcb-4225-bc83-896a0ef4490c",
                "dict": {
                    "type": "subrace",
                    "main": race.name,
                    "name": self.name,
                    "level": 1,
                    },
                },
            {
                "hidden": True,
                "type": "leveling",
                "path": "sub.%s.leveling" % self.normalizedName,
                "uuid": "b3cf5a95-1792-4236-8913-e297e57296d4",
                "given": [
                    {
                        "hidden": True,
                        "path": "sub.%s.level" % self.normalizedName,
                        "type": "value",
                        "uuid": "5e5c90be-a58f-45b7-91f3-141bf59d50fb",
                        "value_formula": "sub.%s.level + 1" % self.normalizedName,
                        "value_default": 1,
                        },
                    ],
                },
            ]

class SubRaceMapper(BaseDataMapper):
    uuid = "065f7ceb-fda6-4d13-94d5-16742439e0e5"
    obj = SubRaceObject
    table = "subrace"
    fields = ["name", "race_id"]
    order = ["name"]
