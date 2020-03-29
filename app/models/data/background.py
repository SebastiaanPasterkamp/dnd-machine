from .base import BaseDataObject
from ..base import JsonObjectDataMapper

class BackgroundObject(BaseDataObject):
    _pathPrefix = "background"
    _defaultConfig = {
        "name": "",
        "description": "",
        "type": "config",
        "config": [],
        }


class BackgroundMapper(JsonObjectDataMapper):
    obj = BackgroundObject
    table = "background"
    fields = ["name"]
    order = ["name"]
