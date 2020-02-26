from ..base import JsonObject, JsonObjectDataMapper

class TypesObject(JsonObject):
    _pathPrefix = "types"
    _defaultConfig = {
        "type": "",
        "name": "",
        }

class TypesMapper(JsonObjectDataMapper):
    obj = TypesObject
    table = "types"
    fields = ["type", "name"]
    order = 'name'
