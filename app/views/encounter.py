# -*- coding: utf-8 -*-
from flask import request, abort, render_template, url_for, redirect

from .baseapi import BaseApiBlueprint, BaseApiCallback

class EncounterBlueprint(BaseApiBlueprint):

    @property
    def datamapper(self):
        return self.basemapper.encounter

    @property
    def usermapper(self):
        return self.basemapper.user

    @property
    def charactermapper(self):
        return self.basemapper.character

    @property
    def monstermapper(self):
        return self.basemapper.monster

    @property
    def partymapper(self):
        return self.basemapper.party

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
    def adminOrOwnedMultiple(self, objs):
        if not self.checkRole(['admin']):
            objs = [
                obj
                for obj in objs
                if obj.user_id == request.user.id
                ]
        for obj in objs:
            obj.monsters = [
                self.monstermapper.getById(monster['id'])
                for monster in obj.monster_ids
                ]
            if request.party:
                obj.party = request.party
        return objs

    @BaseApiCallback('show.object')
    @BaseApiCallback('edit.object')
    @BaseApiCallback('api_get.object')
    @BaseApiCallback('api_patch.object')
    @BaseApiCallback('api_delete.object')
    def adminOrOwnedSingle(self, obj):
        if obj.id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403)
        obj.monsters = [
            self.monstermapper.getById(monster['id'])
            for monster in obj.monster_ids
            ]
        if request.party:
            obj.party = request.party
        return obj

    @BaseApiCallback('api_post.object')
    def setOwner(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        obj.id = request.user.id
        obj.monsters = [
            self.monstermapper.getById(monster['id'])
            for monster in obj.monster_ids
            ]
        return obj


def get_blueprint(basemapper, config):
    return '/encounter', EncounterBlueprint(
        'encounter',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
