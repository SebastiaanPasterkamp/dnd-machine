from ..base import JsonObject, JsonObjectDataMapper

class ArmorObject(JsonObject):
    _pathPrefix = "armor"
    _defaultConfig = {
        "type": u"light armor",
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
        "disadvantage": bool,
        "value": int,
        "bonus": int
        }

class ArmorMapper(JsonObjectDataMapper):
    obj = ArmorObject
    table = "item"
    fields = ["type", "name"]

    def getMultiple(self, where="1", values={}):
        where = "(%s) AND `type` LIKE :extra" % where
        values.update({"extra": "%armor"})
        return super(ArmorMapper, self).getMultiple(
            where=where, values=values
            )
