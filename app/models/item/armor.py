from ..base import JsonObject, JsonObjectDataMapper

class ArmorObject(JsonObject):
    _pathPrefix = "armor"
    _defaultConfig = {
        "type": "light",
        "name": "",
        "cost": {},
        "disadvantage": False,
        "requirements": {}
        }
    _fieldTypes = {
        "id": int,
        "cost": {
            "*": int
            },
        "weight": {
            "*": float
            },
        "disadvantage": bool,
        "requirements": {
            '*': int
            },
        "value": int,
        "bonus": int
        }

class ArmorMapper(JsonObjectDataMapper):
    obj = ArmorObject
    table = "item"
    fields = ["type", "name"]
    order = 'name'

    def getMultiple(self, where="1", values={}):
        where = "(%s) AND `type` IN ('light', 'medium', 'heavy', 'shield')" % where
        return super(ArmorMapper, self).getMultiple(
            where=where, values=values
            )
