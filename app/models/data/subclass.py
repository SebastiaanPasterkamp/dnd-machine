from .base import BaseDataObject
from ..base import JsonObjectDataMapper

class SubClassObject(BaseDataObject):
    _pathPrefix = "subclass"


class SubClassMapper(JsonObjectDataMapper):
    obj = SubClassObject
    table = "subclass"
    fields = ["name", "class_id"]
    order = ["name"]
