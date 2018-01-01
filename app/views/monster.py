# -*- coding: utf-8 -*-
from flask import request, abort, render_template, url_for

from .baseapi import BaseApiBlueprint
from .. import get_datamapper
from ..config import get_config

class MonsterBlueprint(BaseApiBlueprint):

    @property
    def datamapper(self):
        if not self._datamapper:
            datamapper = get_datamapper()
            self._datamapper = datamapper.monster
        return self._datamapper

    def _exposeAttributes(self, monster):
        fields = [
            'id', 'name', 'type', 'size', 'alignment', 'level',
            'statistics', 'armor_class', 'description',
            'proficiency', 'attack_modifier',
            'passive_perception', 'hit_points', 'dice_size',
            'attacks', 'multiattack', 'traits',
            'languages', 'motion',
            'challenge_rating', 'xp', 'xp_rating'
            ]

        result = dict([
            (key, monster[key])
            for key in fields
            ])

        return result

    def show(self, obj_id):
        monster = self.datamapper.getById(obj_id)

        return render_template(
            'monster/show.html',
            monster=monster
            )

    def new(self):
        monster = self.datamapper.create()

        if request.method == 'POST':
            if request.form["button"] == "cancel":
                return redirect(url_for(
                    'monster.overview'
                    ))

            monster.updateFromPost(request.form)

            if request.form.get("button", "save") == "save":
                monster = self.datamapper.insert(monster)
                return redirect(url_for(
                    'monster.show',
                    obj_id=monster.id
                    ))

        config = get_config()
        datamapper = get_datamapper()
        return render_template(
            'monster/edit.html',
            languages=datamapper.items.getList(
                'languages.common,languages.exotic'
                ),
            machine=config['machine'],
            monster=monster
            )

    def _api_post_filter(self, obj):
        if not self.checkRole(['dm']):
            abort(403)
        return obj

    def _api_patch_filter(self, obj):
        if not self.checkRole(['dm']):
            abort(403)
        return obj

    def _api_delete_filter(self, obj):
        if not self.checkRole(['dm']):
            abort(403)
        return obj

blueprint = MonsterBlueprint(
    'monster', __name__, template_folder='templates')
