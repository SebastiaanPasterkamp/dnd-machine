from .base import BaseDataObject
from ..base import JsonObjectDataMapper

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
            "proficiency": [ 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6 ],
            "max_cantrips_formula": str,
            "max_known_formula": str,
            "max_prepared_formula": str,
            "max_cantrips": int,
            "max_known": int,
            "slots": int,
            },
        "phases": {
            "level": str,
            "conditions": {
                "level": int,
                },
            },
        }

    def compileConfig(self, datamapper, char=None):
        char = self._getChar(char)
        config = super(ClassObject, self).compileConfig(datamapper, char)

        if char.level - 1 < len(self.featuresProficiency or []):
            config['config'].append({
                "uuid": "eb89c73e-ce07-4e03-9d2c-6bc0a8b94f6f",
                "path": "proficiency",
                "type": "value",
                "value": self.featuresProficiency[char.level-1],
                "hidden": True,
                })

        # TODO: Move spell casting to base as it applies to sub classes too

        if self.featuresMax_cantrips_formula:
            config['config'].append({
                "uuid": "8e57dc60-1546-4493-876d-85f612219fc3",
                "path": "computed.spellMax_cantrips.formula",
                "type": "value",
                "value": self.featuresMax_cantrips_formula,
                "hidden": True,
                })
        if self.featuresMax_known_formula:
            config['config'].append({
                "uuid": "4f4318ee-37fc-4e3f-80d2-46ab66eec1f8",
                "path": "computed.spellMax_known.formula",
                "type": "value",
                "value": self.featuresMax_known_formula,
                "hidden": True,
                })
        if self.featuresMax_prepared_formula:
            config['config'].append({
                "uuid": "d843be48-4f51-4794-95e0-5918bb083221",
                "path": "computed.spellMax_prepared.formula",
                "type": "value",
                "value": self.featuresMax_prepared_formula,
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


class ClassMapper(JsonObjectDataMapper):
    obj = ClassObject
    table = "class"
    fields = ["name"]
    order = ["name"]
