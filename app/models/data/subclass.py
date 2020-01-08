from ..base import JsonObject, JsonObjectDataMapper

class SubClassObject(JsonObject):
    _pathPrefix = "subclass"
    _defaultConfig = {
        "name": "",
        "description": "",
        "type": "config",
        "config": []
        }
    _fieldTypes = {
        "id": int,
        }

class SubClassMapper(JsonObjectDataMapper):
    obj = SubClassObject
    table = "subclass"
    fields = ["name"]
    order = 'name'
