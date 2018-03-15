# -*- coding: utf-8 -*-
from flask import ( abort, request, redirect, url_for )

from ..baseapi import BaseApiBlueprint

class AdventureLeagueBlueprint(BaseApiBlueprint):

    def __init__(self, name, *args, **kwargs):
        super(AdventureLeagueBlueprint, self).__init__(
            name, *args, **kwargs
            )
        self.add_url_rule(
            '/list/<int:obj_id>/<int:character_id>', 'show',
            self.show)
        self.add_url_rule(
            '/api/character/<int:character_id>', 'api_list',
            self.api_list, methods=['GET'])
        self.add_url_rule(
            '/new/<int:character_id>', 'new',
            self.new, methods=['GET'])
        self.add_url_rule(
            '/copy/<int:obj_id>', 'copy',
            self.copy, methods=['GET', 'POST'])
        self.add_url_rule(
            '/consume/<int:obj_id>', 'consume',
            self.consume)

    @property
    def datamapper(self):
        return self.basemapper.adventureleague

    @property
    def charactermapper(self):
        return self.basemapper.character

    def copy(self, obj_id):
        obj = self.datamapper.getById(obj_id)
        obj.id = None
        obj.user_id = request.user.id
        obj.adventureName += u" (Copy)"

        obj = self.datamapper.insert(obj)

        return redirect(url_for(
            'adventureleague.edit',
            obj_id=obj.id
            ))

    def new(self, character_id=None, *args, **kwargs):
        if character_id is None:
            return super(AdventureLeagueBlueprint, self).new(
                *args, **kwargs)
        character = self.charactermapper.getById(character_id)
        if character is None:
            abort(404)
        if character.user_id != request.user.id:
            abort(403, "Not owned")
        return super(AdventureLeagueBlueprint, self).new(
            *args, **kwargs)

    def _api_list_filter(self, objs, character_id=None):
        if character_id is not None:
            objs = [
                obj
                for obj in objs
                if obj.character_id == character_id
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

    def consume(self, obj_id):
        obj = self.datamapper.getById(obj_id)
        if obj is None:
            abort(404)
        if obj.consumed:
            abort(410, "Adventure League Log already consumed")
        if not obj.character_id:
            abort(409, "The Adventure League Log is not yet claimed")

        character = self.charactermapper.getById(obj.character_id)
        if character is None:
            abort(404)
        if character.user_id != request.user.id:
            abort(403, "Not owned")

        mapping = {
            'xp': 'xp',
            'downtime': 'downtime',
            'renown': 'renown'
            }
        for src, dst in mapping.items():
            obj[src] = obj[src] or {}
            obj[src]['starting'] = character[dst] or 0
            character[dst] = (character[dst] or 0) \
                + (obj[src]['earned'] or 0)
            obj[src]['total'] = character[dst]

        obj.goldStarting = dict([
            (key, value)
            for key, value in character.wealth.items()
            ])
        for coin, value in obj.goldEarned.items():
            character.wealth[coin] = value \
                + character.wealth.get(coin, 0)
        obj.goldTotal = dict([
            (key, value)
            for key, value in character.wealth.items()
            ])

        obj.itemsStarting = character.adventure_items
        character.equipment += obj.itemsEarned or []
        obj.itemsTotal = character.adventure_items

        obj.consumed = True
        character.compute()

        obj = self.datamapper.update(obj)
        character = self.charactermapper.update(character)

        return redirect(url_for(
            'character.show',
            obj_id=character.id
            ))


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
    return AdventureLeagueBlueprint(
    'adventureleague',
    __name__,
    basemapper,
    template_folder='templates'
    )
