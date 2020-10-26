from ..base import JsonObject, JsonObjectDataMapper

class OptionsObject(JsonObject):
    _pathPrefix = "options"
    _defaultConfig = {
        "name": "",
        "description": "",
        "type": "multichoice",
        }
    _fieldTypes = {
        "id": int,
        }

class OptionsMapper(JsonObjectDataMapper):
    obj = OptionsObject
    table = "options"
    fields = ["name"]
    order = ["name"]

    def getAllOptions(self, datamapper, char=None, **kwargs):
        return self.getById(1).clone()
