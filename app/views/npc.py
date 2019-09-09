# -*- coding: utf-8 -*-
from flask import request, abort, jsonify

from views.baseapi import BaseApiBlueprint, BaseApiCallback
from config import get_npc_data
from filters import filter_bonus, filter_unique

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
    def campaignmapper(self):
        return self.basemapper.campaign

    def get_allowed_campaign_ids(self, user_id):
        return [None] + [
            c.id for c in self.campaignmapper.getByDmUserId(user_id)
            ]

    @property
    def npc_data(self):
        if '_npc_data' not in self.__dict__:
            self._npc_data = get_npc_data()
        return self._npc_data

    def get_races(self):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
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
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        return jsonify(self.npc_data['class'])

    @BaseApiCallback('index')
    @BaseApiCallback('overview')
    @BaseApiCallback('show')
    @BaseApiCallback('new')
    @BaseApiCallback('edit')
    @BaseApiCallback('api_list')
    @BaseApiCallback('api_get')
    @BaseApiCallback('api_copy')
    @BaseApiCallback('api_post')
    @BaseApiCallback('api_patch')
    @BaseApiCallback('api_delete')
    @BaseApiCallback('api_recompute')
    def adminOrDmOnly(self, *args, **kwargs):
        if not self.checkRole(['admin', 'dm']):
            abort(403)

    @BaseApiCallback('raw')
    def adminOnly(self, *args, **kwargs):
        if not self.checkRole(['admin']):
            abort(403)

    @BaseApiCallback('api_list.objects')
    def adminOrGenericMultiple(self, objs):
        if self.checkRole(['admin']):
            return
        campaign_ids = self.get_allowed_campaign_ids(
            request.user.id
            )
        objs[:] = [
            obj
            for obj in objs
            if obj.campaign_id in campaign_ids
            ]

    @BaseApiCallback('api_copy.object')
    @BaseApiCallback('api_get.object')
    def adminOrGenericSingle(self, obj):
        if self.checkRole(['admin']):
            return
        campaign_ids = self.get_allowed_campaign_ids(
            request.user.id
            )
        if obj.campaign_id not in campaign_ids:
            abort(403)

    @BaseApiCallback('api_patch.object')
    @BaseApiCallback('api_delete.object')
    def adminOrOwnedSingle(self, obj):
        if self.checkRole(['admin']):
            return
        if obj.user_id != request.user.id:
            abort(403)

    @BaseApiCallback('api_post.object')
    @BaseApiCallback('api_copy.object')
    def setOwner(self, obj):
        obj.user_id = request.user.id

    @BaseApiCallback('api_copy.object')
    def changeName(self, obj, *args, **kwargs):
        obj.name += " (Copy)"

def get_blueprint(basemapper, config):
    return '/npc', NpcBlueprint(
        'npc',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
