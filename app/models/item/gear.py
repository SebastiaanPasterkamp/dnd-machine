from ..base import JsonObject, JsonObjectDataMapper

class GearObject(JsonObject):
    _pathPrefix = "equipment"
    _defaultConfig = {
        "type": "trinket",
        "name": "",
        "cost": {},
        "weight": {},
        }
    _fieldTypes = {
        "id": int,
        "cost": {
            "*": int
            },
        "weight": {
            "*": float
            },
        }

class GearMapper(JsonObjectDataMapper):
    obj = GearObject
    table = "item"
    fields = ["type", "name"]
    order = 'name'

    def getMultiple(self, where="1", values={}):
        where = "(%s) AND `type` IN ('artisan', 'kit', 'gaming', 'musical', 'trinket')" % where
        return super(GearMapper, self).getMultiple(
            where=where, values=values
            )
