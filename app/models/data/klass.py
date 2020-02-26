from ..base import JsonObject, JsonObjectDataMapper

class ClassObject(JsonObject):
    _pathPrefix = "class"
    _defaultConfig = {
        "name": "",
        "description": "",
        "type": "config",
        "config": []
        }
    _fieldTypes = {
        "id": int,
        }

class ClassMapper(JsonObjectDataMapper):
    obj = ClassObject
    table = "class"
    fields = ["name"]
    order = ["name"]
