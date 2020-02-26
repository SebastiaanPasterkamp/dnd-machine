import re

from ..base import JsonObject, JsonObjectDataMapper

class SpellObject(JsonObject):
    _pathPrefix = "spell"
    _defaultConfig = {
        "school": "Evocation",
        "classes": [],
        "components": [],
        "level": "Cantrip",
        "duration": "Instantaneous",
        "concentration": False,
        "casting_time": "1 action",
        "range": "Self"
        }
    _fieldTypes = {
        "id": int,
        "damage": {
            "bonus": int,
            "dice_count": int,
            "dice_size": int
            },
        "concentration": bool,
        }

    def migrate(self, mapper):
        types = mapper.types

        self.components = list(set([
            types.itemByNameOrId(
                component, "magic_components", {"id": component}
                )["id"]
            for component in self.components
            ]))
        self.school = types.itemByNameOrId(
            self.school, "magic_schools", {"id": self.school}
            )["id"]
        if self.concentration is None:
            self.concentration = "concentration" in self.duration.lower()

        if "damage" in self and not isinstance(self.damage, dict):
            re_dmg = re.compile(r"^(?P<dice_count>\d+)d(?P<dice_size>\d+)(?:\s*\+\s*(?P<bonus>\d+))?\s+(?P<type>.*)$")
            match = re_dmg.match(self.damage)
            self.damage = match.groupdict()
        if self.damageType:
            self.damageType = self.damageType.lower()

        super(SpellObject, self).migrate()


class SpellMapper(JsonObjectDataMapper):
    obj = SpellObject
    table = "spell"
    fields = ["name", "school", "level"]
    order = ["name"]
