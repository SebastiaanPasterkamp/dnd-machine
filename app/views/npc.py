# -*- coding: utf-8 -*-
from flask import request, abort, render_template

from .baseapi import BaseApiBlueprint
from .. import get_datamapper
from ..config import get_config, get_npc_data, get_item_data
from ..filters import filter_bonus, filter_unique

class NpcBlueprint(BaseApiBlueprint):

    @property
    def datamapper(self):
        if not self._datamapper:
            datamapper = get_datamapper()
            self._datamapper = datamapper.npc
        return self._datamapper

    def _exposeAttributes(self, obj):
        fields = [
            'id', 'name', 'race', 'class', 'gender',
            'level', 'size', 'alignment', 'statistics',
            'location', 'organization', 'description'
            ]

        result = dict([
            (key, obj[key])
            for key in fields
            ])

        return result

    def find_npc_field(self, npc_data, field, value):
        for data in npc_data[field]:
            for sub in data.get('sub', []):
                if sub['name'] == value:
                    return data, sub
            if data['name'] == value:
                return data, None

    def show(self, obj_id):
        npc = self.datamapper.getById(obj_id)

        return render_template(
            'npc/show.html',
            npc=npc
        )

    def _raw_filter(self, obj):
        if 'admin' not in request.user.role:
            abort(403)
        return obj

    def _api_post_filter(self, obj):
        if 'dm' not in request.user['role']:
            abort(403)
        return obj

    def _api_patch_filter(self, obj):
        if 'dm' not in request.user['role']:
            abort(403)
        return obj

    def _api_delete_filter(self, obj):
        if 'dm' not in request.user['role']:
            abort(403)
        return obj

blueprint = NpcBlueprint(
    'npc', __name__, template_folder='templates')
