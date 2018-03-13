# -*- coding: utf-8 -*-
from flask import ( abort )

from ..baseapi import BaseApiBlueprint

class AdventureLeagueLogBlueprint(BaseApiBlueprint):

    def __init__(self, name, *args, **kwargs):
        super(AdventureLeagueLogBlueprint, self).__init__(
            name, *args, **kwargs
            )
        self.add_url_rule(
            '/list/<int:obj_id>/<int:char_id>', 'show',
            self.show)
        self.add_url_rule(
            '/api/character/<int:char_id>', 'api_list',
            self.api_list, methods=['GET'])

    @property
    def datamapper(self):
        return self.basemapper.adventureleaguelog

    def _api_list_filter(self, objs, char_id=None):
        if char_id is not None:
            objs = [
                obj
                for obj in objs
                if obj.character_id == char_id
                ]
        if self.checkRole(['admin']):
            return objs
        objs = [
            obj
            for obj in objs
            if obj.user_id == request.user.id
            ]
        return objs

    def _api_post_filter(self, obj):
        if not self.checkRole(['player']):
            abort(403)
        obj.user_id = request.user.id
        return obj

    def _api_patch_filter(self, obj):
        if self.checkRole(['admin']):
            return obj
        if obj.user_id != request.user.id:
            abort(403, "Not owned")
        return obj

    def _api_delete_filter(self, obj):
        if self.checkRole(['admin']):
            return obj
        if obj.user_id != request.user.id:
            abort(403, "Not owned")
        return obj

def get_blueprint(basemapper):
    return AdventureLeagueLogBlueprint(
    'adventureleague',
    __name__,
    basemapper,
    template_folder='templates'
    )
