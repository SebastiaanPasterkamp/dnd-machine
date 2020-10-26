from .base import BaseDataObject
from .base import BaseDataMapper

class SubClassObject(BaseDataObject):
    _pathPrefix = "subclass"

    def getDefaultConfig(self, datamapper, char):
        klass = datamapper.klass.getById(self.class_id)
        assert klass is not None

        return [
            {
                "hidden": True,
                "path": "sub.%s" % self.normalizedName,
                "type": "dict",
                "uuid": "3508ad5f-e5be-48ae-8b3d-30caffbb8641",
                "dict": {
                    "type": "subclass",
                    "main": klass.name,
                    "name": self.name,
                    "level": klass.subclass_level,
                    },
                },
            {
                "hidden": True,
                "type": "leveling",
                "path": "sub.%s.leveling" % self.normalizedName,
                "uuid": "698a4ff5-55cc-474b-a471-641bea1ed31d",
                "given": [
                    {
                        "hidden": True,
                        "path": "sub.%s.level" % self.normalizedName,
                        "type": "value",
                        "uuid": "0b0c1422-622f-45a7-8a10-b881dbcaf277",
                        "value_formula": "sub.%s.level + 1" % self.normalizedName,
                        "value_default": klass.subclass_level,
                        },
                    ],
                },
            ]

class SubClassMapper(BaseDataMapper):
    uuid = "4091f745-7fc9-47c5-80cc-0881b77a5bc3"
    obj = SubClassObject
    table = "subclass"
    fields = ["name", "class_id"]
    order = ["name"]
