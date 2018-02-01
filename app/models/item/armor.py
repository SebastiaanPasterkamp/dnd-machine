from ..base import JsonObject, JsonObjectDataMapper

class ArmorObject(JsonObject):
    _pathPrefix = "armor"
    _defaultConfig = {
        "type": u"light",
        "name": u"",
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
        "value": int,
        "bonus": int
        }

class ArmorMapper(JsonObjectDataMapper):
    obj = ArmorObject
    table = "item"
    fields = ["type", "name"]

    def getMultiple(self, where="1", values={}):
        where = "(%s) AND `type` IN ('light', 'medium', 'heavy', 'shield')" % where
        return super(ArmorMapper, self).getMultiple(
            where=where, values=values
            )
