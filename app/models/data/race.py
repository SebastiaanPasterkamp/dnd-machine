from .base import BaseDataObject
from ..base import JsonObjectDataMapper

class RaceObject(BaseDataObject):
    _pathPrefix = "race"
    _subtype = "subrace"
    _subkey = "race_id"


class RaceMapper(JsonObjectDataMapper):
    obj = RaceObject
    table = "race"
    fields = ["name"]
    order = ["name"]
