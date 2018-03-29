# -*- coding: utf-8 -*-
from flask import request, abort, render_template, url_for

from .baseapi import BaseApiBlueprint, BaseApiCallback

class MonsterBlueprint(BaseApiBlueprint):
    @property
    def datamapper(self):
        return self.basemapper.monster

    def _exposeAttributes(self, obj):
        fields = [
            'id', 'name', 'type', 'size', 'alignment', 'level',
            'statistics', 'armor_class', 'description',
            'proficiency', 'attack_modifier', 'spell_save_dc',
            'passive_perception', 'hit_points', 'dice_size',
            'attacks', 'multiattack', 'traits', 'attack_bonus',
            'languages', 'motion', 'average_damage',
            'challenge_rating', 'xp', 'xp_rating'
            ]

        result = dict([
            (key, obj[key])
            for key in fields
            ])

        return result

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

def get_blueprint(basemapper, config):
    return '/monster', MonsterBlueprint(
        'monster',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
