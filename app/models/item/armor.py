from ..base import JsonObject, JsonObjectDataMapper

class ArmorObject(JsonObject):
    def __init__(self, config={}):
        super(ArmorObject, self).__init__(
            config,
            pathPrefix = "armor",
            defaultConfig = {
                "type": u"light armor",
                "name": u"",
                "cost": {},
                "disadvantage": False,
                "requirements": {}
                },
            fieldTypes = {
                "cost": {
                    "*": int
                    },
                "disadvantage": bool,
                "value": int,
                "bonus": int
                }
            )
        self.compute()

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
