# -*- coding: utf-8 -*-
from flask import request, abort, render_template, jsonify

from .baseapi import BaseApiBlueprint, BaseApiCallback
from ..config import get_npc_data
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
            'armor_class', 'spell', 'hit_points', 'size',
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

    @BaseApiCallback('index')
    @BaseApiCallback('overview')
    @BaseApiCallback('show')
    @BaseApiCallback('new')
    @BaseApiCallback('edit')
    @BaseApiCallback('api_list')
    @BaseApiCallback('api_get')
    @BaseApiCallback('api_post')
    @BaseApiCallback('api_patch')
    @BaseApiCallback('api_delete')
    @BaseApiCallback('api_recompute')
    def adminOrDmOnly(self, *args, **kwargs):
        if not self.checkRole(['admin', 'dm']):
            abort(403)

    @BaseApiCallback('raw')
    def adminOnly(self):
        if not self.checkRole(['admin']):
            abort(403)

    @BaseApiCallback('api_list.objects')
    def adminOrDmMultiple(self, objs):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        return objs

    @BaseApiCallback('show.object')
    @BaseApiCallback('edit.object')
    @BaseApiCallback('api_get.object')
    @BaseApiCallback('api_post.object')
    @BaseApiCallback('api_patch.original')
    @BaseApiCallback('api_delete.object')
    def adminOrDmSingle(self, objs):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        return objs

def get_blueprint(basemapper, config):
    return '/npc', NpcBlueprint(
        'npc',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
