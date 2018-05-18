# -*- coding: utf-8 -*-
from flask import request, abort, render_template, url_for

from .baseapi import BaseApiBlueprint, BaseApiCallback

class MonsterBlueprint(BaseApiBlueprint):
    @property
    def datamapper(self):
        return self.basemapper.monster

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

    @BaseApiCallback('api_post.object')
    @BaseApiCallback('api_copy.object')
    def setOwner(self, obj):
        obj.user_id = request.user.id

    @BaseApiCallback('api_copy.object')
    def changeName(self, obj, *args, **kwargs):
        obj.name += u" (Copy)"

def get_blueprint(basemapper, config):
    return '/monster', MonsterBlueprint(
        'monster',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
