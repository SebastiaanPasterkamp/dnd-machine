# -*- coding: utf-8 -*-
from flask import request, abort, render_template, jsonify

from .baseapi import BaseApiBlueprint
from ..config import get_config, get_npc_data
from ..filters import filter_bonus, filter_unique

class NpcBlueprint(BaseApiBlueprint):

    def __init__(self, name, *args, **kwargs):
        super(NpcBlueprint, self).__init__(name, *args, **kwargs)

        self.add_url_rule(
            '/races/api', 'get_races',
            self.get_races, methods=['GET'])
        self.add_url_rule(
            '/classes/api', 'get_classes',
            self.get_classes, methods=['GET'])

    @property
    def datamapper(self):
        return self.basemapper.npc

    @property
    def npc_data(self):
        if '_npc_data' not in self.__dict__:
            self._npc_data = get_npc_data()
        return self._npc_data

    def find_npc_field(self, field, value):
        for data in self.npc_data[field]:
            for sub in data.get('sub', []):
                if sub['name'] == value:
                    return data, sub
            if data['name'] == value:
                return data, None

    def get_races(self):
        def _race_attribs(race):
            return dict(
                (attrib, race.get(attrib))
                for attrib in [
                    'name', 'sub', 'config', 'description'
                    ]
                )
        races = [
            _race_attribs(race)
            for race in self.npc_data['race']
            ]
        return jsonify(races)

    def get_classes(self):
        return jsonify(self.npc_data['class'])

    def _exposeAttributes(self, obj):
        fields = [
            'id', 'name', 'race', 'class', 'gender',
            'level', 'size', 'alignment', 'statistics', 'languages',
            'location', 'organization', 'description', 'traits',
            'armor_class', 'spell'
            ]

        result = dict([
            (key, obj[key])
            for key in fields
            ])

        return result

    def find_npc_field(self, npc_data, field, value):
        for data in npc_data[field]:
            for sub in data.get('sub', []):
                if sub['name'] == value:
                    return data, sub
            if data['name'] == value:
                return data, None

    def _raw_filter(self, obj):
        if 'admin' not in request.user.role:
            abort(403)
        return obj

    def _api_post_filter(self, obj):
        if 'dm' not in request.user['role']:
            abort(403)
        return obj

    def _api_patch_filter(self, obj):
        if 'dm' not in request.user['role']:
            abort(403)
        return obj

    def _api_delete_filter(self, obj):
        if 'dm' not in request.user['role']:
            abort(403)
        return obj

def get_blueprint(basemapper):
    return NpcBlueprint(
        'npc',
        __name__,
        basemapper=basemapper,
        template_folder='templates'
        )
