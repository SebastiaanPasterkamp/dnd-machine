import re

from ..base import JsonObject
from ..base import JsonObjectDataMapper

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

    def __str__(self):
        return "%s{id=%d, uuid=%r, name=%r}" % (self._pathPrefix, self.id, self.uuid, self.name)

    @property
    def normalizedName(self):
        name = self.name.lower()
        return re.sub(r"[^a-z0-9]+", "", name)

    def _getChar(self, char):
        # default = level 1 , no creation history
        if char is not None:
            return char
        return CharacterObject()

    def compileConfig(self, datamapper, char=None):
        char = self._getChar(char)

        clone = self.clone()

        if self._meetsConditions(datamapper, char, clone):
            config = clone.get("config", [])
            self._inlineIncludes(datamapper, char, config)
            defaultConfig = self.getDefaultConfig(datamapper, char)
            return {
                "uuid": self.uuid,
                "type": "config",
                "name": self.name,
                "description": self.description,
                "config": defaultConfig + config,
                }

        for level, phase in enumerate(clone.get("phases", [])):
            if not len(phase.get("config", [])):
                continue

            config = phase.get("config", [])
            self._inlineIncludes(datamapper, char, config)
            phase["config"] = config + self.collectLeveling(datamapper, char)

            if not self._meetsConditions(datamapper, char, phase):
                continue

            return {
                "uuid": phase["uuid"],
                "type": "config",
                "name": phase.get("name", "%s %s" % (self.name, level)),
                "description": phase.get("description"),
                "config": phase["config"],
                }

        return {
            "config": [],
            }

    def getDefaultConfig(self, datamapper, char):
        return []

    def _meetsConditions(self, datamapper, char, phase):
        # Already completed
        if phase.get("uuid") in char.choices:
            return False

        # Nothing to do
        if not len(phase.get('config', [])):
            return False

        # Check conditions
        return datamapper.machine.MatchesFilters(
            char, phase.get('conditions', {}))

    def _inlineIncludes(self, datamapper, char, data):
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
                    subs = datamapper[self._subtype].getAllOptions(
                        datamapper, char,
                        where="%s = :id" % self._subkey,
                        values={ "id": self.id },
                        )
                    data['options'] = subs.get('options', [])
                if len(data['options']) == 0:
                    data['hidden'] = True
                del data['subtype']

            for key, value in list(data.items()):
                self._inlineIncludes(datamapper, char, value)

        if isinstance(data, list):
            for value in data:
                self._inlineIncludes(datamapper, char, value)

    def collectLeveling(self, datamapper, char):
        config = char.getPath(['sub', self.normalizedName, 'leveling'], [])
        self._prefixUUIDs(self.uuid, config)
        self._inlineIncludes(datamapper, char, config)
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


class BaseDataMapper(JsonObjectDataMapper):

    def getAllOptions(self, datamapper, char=None, **kwargs):
        if self.uuid is None:
            raise NotImplementedError("Please provide a UUID")

        options = []
        if char is None or self.uuid not in char.choices:
            for obj in self.getMultiple(**kwargs):
                option = obj.compileConfig(datamapper, char)
                if len(option["config"]):
                    options.append(option)

        if len(options):
            return {
                'uuid': self.uuid,
                'type': 'choice',
                'options': options,
                }
        return {}
