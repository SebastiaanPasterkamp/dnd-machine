from .base import BaseDataObject
from .base import BaseDataMapper

class ClassObject(BaseDataObject):
    _pathPrefix = "class"
    _subtype = "subclass"
    _subkey = "class_id"
    _defaultConfig = {
        "name": "",
        "description": "",
        "subclass_level": 1,
        "type": "config",
        "config": [],
        "features": {},
        "phases": [],
        }
    _fieldTypes = {
        "id": int,
        "subclass_level": int,
        "features": {
            "proficiency": int,
            "max_cantrips_formula": str,
            "max_known_formula": str,
            "max_prepared_formula": str,
            "max_cantrips": int,
            "max_known": int,
            "slots": int,
            },
        "phases": {
            "level": str,
            }
        }

    def getDefaultConfig(self, datamapper, char):
        return [
            {
                "hidden": True,
                "path": "sub.%s" % self.normalizedName,
                "type": "dict",
                "uuid": "25e351ef-395d-4e3e-86e7-5f80dd28f706",
                "dict": {
                    "type": "class",
                    "name": self.name,
                    "level": 1,
                    },
                },
            {
                "hidden": True,
                "type": "leveling",
                "path": "sub.%s.leveling" % self.normalizedName,
                "uuid": "876d6ef8-1780-4e2a-a222-e7f2c6c319ce",
                "given": [
                    {
                        "hidden": True,
                        "path": "sub.%s.level" % self.normalizedName,
                        "type": "value",
                        "uuid": "0777a4ed-3758-4285-8e35-44cd7a455742",
                        "value_formula": "sub.%s.level + 1" % self.normalizedName,
                        "value_default": 1,
                        },
                    ],
                },
            ]

    def compileConfig(self, datamapper, char=None):
        char = self._getChar(char)
        config = super(ClassObject, self).compileConfig(datamapper, char)

        # TODO: Move spell casting to base as it applies to sub classes too

        if self.featuresMax_cantrips_formula:
            config['config'].append({
                "uuid": "8e57dc60-1546-4493-876d-85f612219fc3",
                "path": "computed.spellMax_cantrips.formulas",
                "type": "list",
                "given": [ self.featuresMax_cantrips_formula ],
                "hidden": True,
                })
        if self.featuresMax_known_formula:
            config['config'].append({
                "uuid": "4f4318ee-37fc-4e3f-80d2-46ab66eec1f8",
                "path": "computed.spellMax_known.formulas",
                "type": "list",
                "given": [ self.featuresMax_known_formula ],
                "hidden": True,
                })
        if self.featuresMax_prepared_formula:
            config['config'].append({
                "uuid": "d843be48-4f51-4794-95e0-5918bb083221",
                "path": "computed.spellMax_prepared.formulas",
                "type": "list",
                "given": [ self.featuresMax_prepared_formula ],
                "hidden": True,
                })
        if char.level - 1 < len(self.featuresMax_cantrips or []):
            config['config'].append({
                "uuid": "cd303285-3a6c-4b19-956d-b7cb33cca7a0",
                "path": "spell.max_cantrips",
                "type": "value",
                "value": self.featuresMax_cantrips[char.level-1],
                "hidden": True,
                })
        if char.level - 1 < len(self.featuresSlots or []):
            config['config'].append({
                "uuid": "a9929780-beb2-4fcd-b077-390a8faeccc8",
                "path": "spell.slots",
                "type": "dict",
                "dict": dict([
                    ("level_%d" % (level + 1), slots)
                    for level, slots in enumerate(self.featuresSlots[char.level-1])
                    if slots is not None
                    ]),
                "hidden": True,
                })

        return config


class ClassMapper(BaseDataMapper):
    uuid = "5d9df8c2-b1f0-4a50-8772-3a9b838d0005"
    obj = ClassObject
    table = "class"
    fields = ["name"]
    order = ["name"]

    def getAllOptions(self, datamapper, char=None):
        level = 1 if char is None else char.level
        uuid = "%s-%d" % (self.uuid, level)

        config = {}
        if char is None or uuid not in char.choices:
            config = super(ClassMapper, self).getAllOptions(datamapper, char)

        if config:
            config['uuid'] = uuid
            return config
        return {}
