# -*- coding: utf-8 -*-
from flask import ( abort, request, redirect, url_for )

from ..baseapi import BaseApiBlueprint, BaseApiCallback

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
            self.newObj, methods=['GET'])
        self.add_url_rule(
            '/consume/<int:obj_id>', 'consume',
            self.consume)

    @property
    def datamapper(self):
        return self.basemapper.adventureleague

    @property
    def charactermapper(self):
        return self.basemapper.character

    @BaseApiCallback('index')
    @BaseApiCallback('overview')
    @BaseApiCallback('show')
    @BaseApiCallback('new')
    @BaseApiCallback('edit')
    @BaseApiCallback('consume')
    @BaseApiCallback('api_list')
    @BaseApiCallback('api_get')
    @BaseApiCallback('api_post')
    @BaseApiCallback('api_copy')
    @BaseApiCallback('api_patch')
    @BaseApiCallback('api_delete')
    @BaseApiCallback('api_recompute')
    def dciPlayerOnly(self, *args, **kwargs):
        if not self.checkRole(['player']):
            abort(403)
        if not request.user.dci:
            abort(403)

    @BaseApiCallback('api_post.object')
    @BaseApiCallback('api_copy.object')
    def setOwner(self, obj, *args, **kwargs):
        obj.user_id = request.user.id

    @BaseApiCallback('api_copy.object')
    def updateName(self, obj, *args, **kwargs):
        obj.adventureName += u" (Copy)"

    @BaseApiCallback('api_patch.object')
    @BaseApiCallback('api_delete.object')
    @BaseApiCallback('consume.original')
    def adminOrOwned(self, obj, *args, **kwargs):
        if self.checkRole(['admin']):
            return
        if obj.user_id != request.user.id:
            abort(403, "Not owned")

    @BaseApiCallback('api_list')
    @BaseApiCallback('api_post.object')
    @BaseApiCallback('api_patch.object')
    @BaseApiCallback('api_delete.object')
    @BaseApiCallback('consume.original')
    def adminOrCharacterOwned(
            self, obj=None, character_id=None, *args, **kwargs):
        character_id = character_id or (
            obj.character_id if obj else None
            )
        if not character_id:
            return
        if self.checkRole(['admin']):
            return
        character = self.charactermapper.getById(character_id)
        if character is None:
            abort(404)
        if character.user_id != request.user.id:
            abort(403, "character not owned")

    @BaseApiCallback('api_list.objects')
    def adminOrOwnedAndCharacterOwned(
            self, objs, character_id=None, *args, **kwargs):
        if character_id is not None:
            objs[:] = [
                obj
                for obj in objs
                if obj.character_id == character_id
                ]
        if self.checkRole(['admin']):
            return
        objs[:] = [
            obj
            for obj in objs
            if obj.user_id == request.user.id
            ]

    def consume(self, obj_id):
        self.doCallback('consume', obj_id)

        obj = self.datamapper.getById(obj_id)
        if obj is None:
            abort(404)
        self.doCallback('consume.original', obj)

        if obj.consumed:
            abort(410, "Adventure League Log already consumed")
        if not obj.character_id:
            abort(409, "The Adventure League Log is not yet claimed")

        character = self.charactermapper.getById(character_id)
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

        self.doCallback('consume.object', obj, character)

        obj = self.datamapper.update(obj)
        character = self.charactermapper.update(character)

        return redirect(url_for(
            'character.show',
            obj_id=character.id
            ))

def get_blueprint(basemapper, config):
    return '/log/adventureleague', AdventureLeagueBlueprint(
        'adventureleague',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
