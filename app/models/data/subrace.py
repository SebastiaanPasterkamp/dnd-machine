from .base import BaseDataObject
from ..base import JsonObjectDataMapper

class SubRaceObject(BaseDataObject):
    _pathPrefix = "subrace"


class SubRaceMapper(JsonObjectDataMapper):
    obj = SubRaceObject
    table = "subrace"
    fields = ["name", "race_id"]
    order = ["name"]
