from ..base import JsonObject, JsonObjectDataMapper

class RaceObject(JsonObject):
    _pathPrefix = "race"
    _defaultConfig = {
        "name": "",
        "description": "",
        "type": "config",
        "config": []
        }
    _fieldTypes = {
        "id": int,
        }

class RaceMapper(JsonObjectDataMapper):
    obj = RaceObject
    table = "race"
    fields = ["name"]
    order = ["name"]
