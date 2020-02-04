# -*- coding: utf-8 -*-
from flask import abort

from ..baseapi import BaseApiBlueprint, BaseApiCallback

class SubRaceBlueprint(BaseApiBlueprint):
    @property
    def datamapper(self):
        return self.basemapper.subrace

    @BaseApiCallback('new')
    @BaseApiCallback('edit')
    @BaseApiCallback('api_post')
    @BaseApiCallback('api_patch')
    @BaseApiCallback('api_delete')
    @BaseApiCallback('api_recompute')
    def adminOrDmOnly(self, *args, **kwargs):
        if not self.checkRole(['admin']):
            abort(403)

def get_blueprint(basemapper, config):
    return '/data/subrace', SubRaceBlueprint(
        'subrace',
        __name__,
        basemapper,
        config,
        template_folder='templates',
        )