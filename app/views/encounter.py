# -*- coding: utf-8 -*-
from flask import request, abort

from views.baseapi import BaseApiBlueprint, BaseApiCallback

class EncounterBlueprint(BaseApiBlueprint):

    @property
    def datamapper(self):
        return self.basemapper.encounter

    @property
    def monstermapper(self):
        return self.basemapper.monster

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
    def adminOnly(self, *args, **kwargs):
        if not self.checkRole(['admin']):
            abort(403)

    @BaseApiCallback('api_list.objects')
    def adminOrOwnedMultiple(self, objs):
        if self.checkRole(['admin']):
            return
        objs[:] = [
            obj
            for obj in objs
            if obj.user_id == request.user.id
            ]

    @BaseApiCallback('api_list.objects')
    def setMonstersPartyMultiple(self, objs):
        for obj in objs:
            obj.monsters = [
                self.monstermapper.getById(monster['id'])
                for monster in obj.monster_ids
                ]
            if request.party:
                obj.party = request.party

    @BaseApiCallback('api_get.object')
    @BaseApiCallback('api_post.object')
    @BaseApiCallback('api_patch.object')
    def setMonstersPartySingle(self, obj):
        obj.monsters = [
            self.monstermapper.getById(monster['id'])
            for monster in obj.monster_ids
            ]
        if request.party:
            obj.party = request.party

    @BaseApiCallback('api_get.object')
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


def get_blueprint(basemapper, config):
    return '/encounter', EncounterBlueprint(
        'encounter',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
