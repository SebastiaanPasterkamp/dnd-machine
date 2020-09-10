import re

from ..base import JsonObject

from models.character import CharacterObject

class BaseDataObject(JsonObject):
    _subtype = None
    _subkey = None
    _defaultConfig = {
        "name": "",
        "description": "",
        "type": "config",
        "config": [],
        "phases": [],
        }
    _fieldTypes = {
        "id": int,
        }
    _check = {
        'and': lambda self, char, conditions: all(
            self._meetsCondition(char, **condition)
            for condition in conditions
            ),
        'between': lambda self, char, path, min, max: min <= (char[path] or 0) <= max,
        'contains': lambda self, char, path, needle: needle in (char[path] or []),
        'gte': lambda self, char, path, value: (char[path] or 0) >= value,
        'lte': lambda self, char, path, value: (char[path] or 0) <= value,
        'notcontains': lambda self, char, path, needle: not needle in (char[path] or []),
        'prof': lambda self, char, path, id, type: any(
            prof.get('type') == type and prof.get('id') == id
            for prof in (char[path] or [])
            ),
        'or': lambda self, char, conditions: any(
            self._meetsCondition(char, **condition)
            for condition in conditions
            ),
        }

    @property
    def normalizedName(self):
        name = self.name.lower()
        return re.sub(r"[^a-z0-9]+", "", name)

    def _getChar(self, char):
        # default = level 1 , no creation history
        if char is not None:
            return char
        return CharacterObject()

    def collectChanges(self, datamapper, char):
        config = self.compileConfig(datamapper, char)
        return self._collectChanges(config["config"], char.choices)

    def _collectChanges(self, config, choices):
        changes = []
        for option in config:
            type, uuid, path = option["type"], option["uuid"], option["path"]
            assert type is not None
            assert uuid is not None
            choice = choices.get(uuid)

            if type in ["value", "dict", "list", "objectlist", "select",
                    "manual", "ability_score", "statistics"]:
                changes.append((option, choice))

            elif type in ["choice", "multichoice"]:
                selection = choice.get("added", []) if type == "choice" \
                    else [ choice.get("selected") ]

                for selected in selection:
                    cfg = next((opt
                        for opt in options.get("options", [])
                        if opt["uuid"] == selected
                        ), None)
                    assert cfg is not None, \
                        "Can't find %r option in '%s %s'" % (selected, type, uuid)

                    c = self._collectChanges([ cfg ], choices)
                    changes.extend(c)

            elif type in ["config", "permanent"]:
                c = self._collectChanges(option.get("config", []), choices)
                if type == "permanent":
                    changes.append((option, choice))
                changes.extend(c)

            else:
                raise ValueError(
                    "Unknown option type '%s %s' for %r" % (type, uuid, path))
        return changes


    def compileConfig(self, datamapper, char=None):
        char = self._getChar(char)

        clone = self.clone()

        for phase in clone.get("phases", []):
            if not len(phase.get("config", [])):
                continue

            config = phase.get("config", [])
            self._inlineIncludes(datamapper, config)
            phase["config"] = config + self.collectLeveling(datamapper, char)

            if not self._meetsConditions(char, phase):
                continue

            return {
                "uuid": phase["uuid"],
                "type": "config",
                "name": phase.get("name"),
                "description": phase.get("description"),
                "config": phase["config"],
                }

        if not self._meetsConditions(char, clone):
            return {
                "config": [],
                }
        config = clone.get("config", [])
        self._inlineIncludes(datamapper, config)

        config.insert(0, {
            "uuid": "pick-%s" % self.uuid,
            "path": self._pathPrefix,
            "type": "value",
            "value": self.name,
            })
        return {
            "uuid": self.uuid,
            "type": "config",
            "name": self.name,
            "description": self.description,
            "config": config,
            }

    def _meetsConditions(self, char, phase):
        # Already completed
        if phase.get("uuid") in char.choices:
            return False

        # Nothing to do
        if not len(phase.get('config', [])):
            return False

        # Check conditions
        conditions = phase.get('conditions', {})
        for condition in conditions:
            if not self._meetsCondition(char, **condition):
                return False
        return True

    def _meetsCondition(self, char, type, **args):
        if type not in self._check:
            raise ValueError("Unknown condition type: '%s' checking %r" % (
                type, args))
        return self._check[type](self, char, **args)

    def _inlineIncludes(self, datamapper, data):
        if isinstance(data, dict):
            if 'include' in data:
                include = datamapper.options.getById(data['include'])
                if include is not None:
                    include = include.clone()
                    include.update(data)
                    data.update(include)
                del data['include']

            if data.get('subtype', False):
                data['options'] = []
                if self._subtype and self._subkey:
                    subs = datamapper[self._subtype].getMultiple(
                        where="%s = :id" % self._subkey,
                        values={ "id": self.id },
                        )
                    for obj in subs:
                        sub = obj.compileConfig(datamapper)
                        if len(sub["config"]):
                            data['options'].append(sub)
                if len(data['options']) == 0:
                    data['hidden'] = True
                del data['subtype']

            for key, value in list(data.items()):
                self._inlineIncludes(datamapper, value)

        if isinstance(data, list):
            for value in data:
                self._inlineIncludes(datamapper, value)

    def collectLeveling(self, datamapper, char):
        config = char.getPath(['sub', self.normalizedName, 'leveling'], [])
        self._prefixUUIDs(self.uuid, config)
        self._inlineIncludes(datamapper, config)
        return config

    def _prefixUUIDs(self, uuid, data):
        if isinstance(data, dict):
            if "uuid" in data:
                data["uuid"] = "%s.%s" % (uuid, data["uuid"])
            for key, value in list(data.items()):
                self._prefixUUIDs(uuid, value)

        if isinstance(data, list):
            for value in data:
                self._prefixUUIDs(uuid, value)
