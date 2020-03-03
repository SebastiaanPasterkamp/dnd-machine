from ..base import JsonObject, JsonObjectDataMapper

class TypesObject(JsonObject):
    _pathPrefix = "types"
    _defaultConfig = {
        "type": "",
        "name": "",
        }
    _fieldTypes = {
        'dice_size': int,
        'cost': {
            "*": int
            },
        'bonus': int,
        'damage': {
            'value': int,
            'dice_count': int,
            'dice_size': int
            },
        'versatile': {
            'value': int,
            'dice_count': int,
            'dice_size': int
            },
        'range': {
            '*': int
            },
        'weight': {
            '*': float
            },
        'worth': {
            '*': int
            },
        }


class TypesMapper(JsonObjectDataMapper):
    obj = TypesObject
    table = "types"
    auto_increment = False
    keys = ['id', 'type']
    fields = ["type", "name"]
    order = ['type', 'name']

    def __getattr__(self, type):
        if type.startswith('_') \
                or type in self.__dict__ \
                or type in self.__class__.__dict__:
            return object.__getattribute__(self, type)
        return self.getMultiple(
            "`type` = :type",
            {"type": type},
            )

    def listByNameOrId(self, search, type=None):
        if type is not None:
            return self.getMultiple(
                """(`id` = :search OR `name` = :search)
                AND `type` = :type""",
                {"search": search, "type": type},
                )

        return self.getMultiple(
            "`id` = :search OR `name` = :search",
            {"search": search},
            )

    def itemByNameOrId(self, search, type=None, default=None):
        matches = self.listByNameOrId(search, type)
        if len(matches):
            return matches[0]
        return default
