from ..base import JsonObject, JsonObjectDataMapper

class BackgroundObject(JsonObject):
    _pathPrefix = "background"
    _defaultConfig = {
        "name": "",
        "description": "",
        "type": "config",
        "config": []
        }
    _fieldTypes = {
        "id": int,
        }

class BackgroundMapper(JsonObjectDataMapper):
    obj = BackgroundObject
    table = "background"
    fields = ["name"]
    order = 'name'
