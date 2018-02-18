# -*- coding: utf-8 -*-
from flask import (
    request, abort, redirect, url_for, render_template, session, jsonify
    )

from ..baseapi import BaseApiBlueprint

class WeaponBlueprint(BaseApiBlueprint):
    @property
    def datamapper(self):
        return self.basemapper.weapon

    def _api_list_filter(self, objs):
        return objs

    def _api_post_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        return obj

    def _api_patch_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        return obj

    def _api_recompute_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        return obj

    def _api_delete_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        return obj

def get_blueprint(basemapper):
    return WeaponBlueprint(
    'weapon',
    __name__,
    basemapper,
    template_folder='templates'
    )
