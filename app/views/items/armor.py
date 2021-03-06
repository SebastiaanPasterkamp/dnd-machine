# -*- coding: utf-8 -*-
from flask import (
    request, abort, redirect, url_for, render_template, session, jsonify
    )

from ..baseapi import BaseApiBlueprint, BaseApiCallback

class ArmorBlueprint(BaseApiBlueprint):
    @property
    def datamapper(self):
        return self.basemapper.armor

    @BaseApiCallback('new')
    @BaseApiCallback('edit')
    @BaseApiCallback('api_post')
    @BaseApiCallback('api_patch')
    @BaseApiCallback('api_delete')
    @BaseApiCallback('api_recompute')
    def adminOrDmOnly(self, *args, **kwargs):
        if not self.checkRole(['admin', 'dm']):
            abort(403)

def get_blueprint(basemapper, config):
    return '/items/armor', ArmorBlueprint(
        'armor',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
