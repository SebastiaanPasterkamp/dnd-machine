# -*- coding: utf-8 -*-
from flask import request, abort, render_template, url_for, redirect

from .baseapi import BaseApiBlueprint

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

    def _api_list_filter(self, objs):
        if not self.checkRole(['admin', 'dm']):
            abort(403)

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

    def _raw_filter(self, obj):
        obj.monsters = [
            self.monstermapper.getById(monster['id'])
            for monster in obj.monster_ids
            ]
        if request.party:
            obj.party = request.party
        return obj

    def _api_get_filter(self, obj):
        obj.monsters = [
            self.monstermapper.getById(monster['id'])
            for monster in obj.monster_ids
            ]
        if request.party:
            obj.party = request.party
        return obj

    def _api_post_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        obj.user_id = request.user.id
        obj.monsters = [
            self.monstermapper.getById(monster['id'])
            for monster in obj.monster_ids
            ]
        return obj

    def _api_patch_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        if obj.user_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403, "Not owned")
        obj.monsters = [
            self.monstermapper.getById(monster['id'])
            for monster in obj.monster_ids
            ]
        return obj

    def _api_recompute_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        obj.monsters = [
            self.monstermapper.getById(monster['id'])
            for monster in obj.monster_ids
            ]
        if request.party:
            obj.party = request.party
        return obj

    def _api_delete_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        if obj.user_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403, "Not owned")
        return obj

def get_blueprint(basemapper):
    return EncounterBlueprint(
        'encounter',
        __name__,
        basemapper=basemapper,
        template_folder='templates'
        )
