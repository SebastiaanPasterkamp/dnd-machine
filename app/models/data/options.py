from ..base import JsonObject, JsonObjectDataMapper

class OptionsObject(JsonObject):
    _pathPrefix = "options"
    _defaultConfig = {
        "name": "",
        "description": "",
        "type": "multichoice",
        "options": []
        }
    _fieldTypes = {
        "id": int,
        }

class OptionsMapper(JsonObjectDataMapper):
    obj = OptionsObject
    table = "options"
    fields = ["name"]
    order = ["name"]
