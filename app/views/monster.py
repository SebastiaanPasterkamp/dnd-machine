# -*- coding: utf-8 -*-
from flask import request, abort

from views.baseapi import BaseApiBlueprint, BaseApiCallback

class MonsterBlueprint(BaseApiBlueprint):
    @property
    def datamapper(self):
        return self.basemapper.monster

    @property
    def campaignmapper(self):
        return self.basemapper.campaign

    def get_allowed_campaign_ids(self, user_id):
        return [None] + [
            c.id for c in self.campaignmapper.getByDmUserId(user_id)
            ]

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
            if obj.user_id == request.user.id \
                or obj.campaign_id in campaign_ids
            ]

    @BaseApiCallback('api_copy.object')
    @BaseApiCallback('api_get.object')
    def adminOrGenericSingle(self, obj):
        if self.checkRole(['admin']):
            return
        campaign_ids = self.get_allowed_campaign_ids(
            request.user.id
            )
        if obj.user_id != request.user.id \
                and obj.campaign_id not in campaign_ids:
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
    return '/monster', MonsterBlueprint(
        'monster',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
