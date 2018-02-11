from ..base import JsonObject, JsonObjectDataMapper

import re

class SpellObject(JsonObject):
    _pathPrefix = "spell"
    _defaultConfig = {
        "school": "Evocation",
        "classes": [],
        "components": [],
        "level": "Cantrip",
        "duration": "Instantaneous",
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
        }

    def migrate(self, mapper):
        items = mapper.items

        self.components = [
            items.itemByNameOrCode(
                component, 'magic_components'
                )['code']
            for component in self.components
            if items.itemByNameOrCode(
                component, 'magic_components'
                )
            ]
        self.school = items.itemByNameOrCode(
            self.school, 'magic_schools', {'code': self.school}
            )['code']

        if 'damage' in self and not isinstance(self.damage, dict):
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
