from ..base import JsonObject, JsonObjectDataMapper

class WeaponObject(JsonObject):
    def __init__(self, config={}):
        super(WeaponObject, self).__init__(
            config,
            pathPrefix = "weapon",
            defaultConfig = {
                "type": u"Melee Weapon",
                "name": u"",
                "cost": {},
                "damage": {
                    "dice_count": 1,
                    "dice_size": 4,
                    "type": u"slashing"
                    },
                "property": [],
                "range": {
                    "min": 5,
                    "max": 5
                    }
                },
            fieldTypes = {
                "cost": {
                    "*": int
                    },
                "damage": {
                    "dice_count": int,
                    "dice_size": int
                    },
                "range": {
                    "min": int,
                    "max": int
                    },
                "versatile": {
                    "dice_count": int,
                    "dice_size": int
                    }
                }
            )
        self.compute()

class WeaponMapper(JsonObjectDataMapper):
    obj = WeaponObject
    table = "item"
    fields = ["type", "name"]

    def getMultiple(self, where="1", values={}):
        return super(WeaponMapper, self).getMultiple(
            where="(%s) AND type like :type" % where,
            values=values.update({":type": "%weapon"})
            )
