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
                "weight": {},
                "damage": {
                    "dice_count": 1,
                    "dice_size": 4,
                    "type": u"slashing"
                    },
                "property": []
                },
            fieldTypes = {
                "cost": {
                    "*": int
                    },
                "weight": {
                    "*": float
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

class WeaponMapper(JsonObjectDataMapper):
    obj = WeaponObject
    table = "item"
    fields = ["type", "name"]

    def getMultiple(self, where="1", values={}):
        where = "(%s) AND `type` LIKE :extra" % where
        values.update({"extra": "%weapon"})
        return super(WeaponMapper, self).getMultiple(
            where=where, values=values
            )
