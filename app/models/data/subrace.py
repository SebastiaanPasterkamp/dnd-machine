from ..base import JsonObject, JsonObjectDataMapper

class SubRaceObject(JsonObject):
    _pathPrefix = "subrace"
    _defaultConfig = {
        "name": "",
        "description": "",
        "type": "config",
        "config": []
        }
    _fieldTypes = {
        "id": int,
        }

class SubRaceMapper(JsonObjectDataMapper):
    obj = SubRaceObject
    table = "subrace"
    fields = ["name"]
    order = 'name'
