# -*- coding: utf-8 -*-
from flask import (
    request, abort, redirect, url_for, render_template, session, jsonify
    )

from .baseapi import BaseApiBlueprint, BaseApiCallback

class PartyBlueprint(BaseApiBlueprint):

    def __init__(self, name, *args, **kwargs):
        super(PartyBlueprint, self).__init__(name, *args, **kwargs)

        self.add_url_rule(
            '/hosting', 'hosting',
            self.get_hosting, methods=['GET'])
        self.add_url_rule(
            '/host', 'host',
            self.set_hosting, methods=['POST'])
        self.add_url_rule(
            '/host/<int:obj_id>', 'host',
            self.set_hosting, methods=['POST'])
        self.add_url_rule(
            '/xp/<int:obj_id>/<int:xp>', 'xp',
            self.xp, methods=['GET', 'POST'])

    @property
    def datamapper(self):
        return self.basemapper.party

    @property
    def charactermapper(self):
        return self.basemapper.character

    @property
    def usermapper(self):
        return self.basemapper.user

    def _exposeAttributes(self, obj):
        fields = set([
            'id', 'user_id', 'name', 'size', 'description',
            'member_ids'
            ])
        if self.checkRole(['admin', 'dm']) \
                and obj.user_id == request.user.id:
            fields |= set([
                'challenge'
                ])
        result = dict([
            (key, obj[key])
            for key in fields
            ])
        return result

    def _getVisibleParties(self):
        visible = set()
        if self.checkRole(['admin']):
            visible = set([obj.id for obj in objs])
        if self.checkRole(['player']):
            visible |= set(
                self.datamapper.getIdsByUserId(request.user.id)
                )
        if self.checkRole(['dm']):
            visible |= set(
                self.datamapper.getIdsByDmUserId(request.user.id)
                )
        return visible

    @BaseApiCallback('api_list.objects')
    def filterVisibleMultiple(self, objs, *args, **kwargs):
        visible = self._getVisibleParties()
        objs[:] = [
            obj
            for obj in objs
            if obj.id in visible
            ]
        for obj in objs:
            obj.members = self.charactermapper.getByPartyId(obj.id)
        return objs

    @BaseApiCallback('api_get')
    def filterVisibleSingle(self, obj_id, *args, **kwargs):
        visible = self._getVisibleParties()
        if obj.id not in visible:
            abort(403)

    @BaseApiCallback('api_get.object')
    @BaseApiCallback('api_patch.object')
    @BaseApiCallback('api_copy.object')
    @BaseApiCallback('xp.original')
    @BaseApiCallback('xp.object')
    def setMembers(self, obj, *args, **kwargs):
        obj.members = self.charactermapper.getByPartyId(obj.id)

    @BaseApiCallback('show')
    @BaseApiCallback('new')
    @BaseApiCallback('edit')
    @BaseApiCallback('xp')
    @BaseApiCallback('api_post')
    @BaseApiCallback('api_copy')
    @BaseApiCallback('api_patch')
    @BaseApiCallback('recompute')
    @BaseApiCallback('get_hosting')
    @BaseApiCallback('set_hosting')
    def adminOrDmOnly(self, *args, **kwargs):
        if not self.checkRole(['admin', 'dm']):
            abort(403)

    @BaseApiCallback('raw')
    def adminOnly(self, *args, **kwargs):
        if not self.checkRole(['admin']):
            abort(403)

    @BaseApiCallback('api_delete.object')
    @BaseApiCallback('api_patch.object')
    def adminDmOrOwned(self, obj):
        if obj.user_id != request.user.id \
                and not self.checkRole(['admin', 'dm']):
            abort(403)

    @BaseApiCallback('api_post.objects')
    @BaseApiCallback('api_copy.objects')
    def setOwner(self, obj):
        obj.user_id = request.user.id

    def get_hosting(self):
        self.doCallback('get_hosting')
        if session.get('party_id') is None:
            return jsonify(None)
        return redirect(url_for(
            '%s.api_get' % self.name,
            obj_id=session.get('party_id')
            ))

    def set_hosting(self, obj_id=None):
        self.doCallback('set_hosting', obj_id)
        session['party_id'] = obj_id
        if not obj_id:
            return jsonify(None)
        return redirect(url_for(
            '%s.api_get' % self.name,
            obj_id=obj_id
            ))

    def xp(self, obj_id, xp):
        self.doCallback('xp', obj_id, xp)

        obj = self.datamapper.getById(obj_id)
        if obj is None:
            return jsonify(None)
        self.doCallback(
            'xp.original',
            obj,
            xp,
            )

        for member in obj.members:
            member.xp += int(xp / obj.size)
            member.compute()
            self.charactermapper.update(member)

        self.doCallback(
            'xp.object',
            obj,
            xp,
            )
        obj = self.datamapper.update(obj)

        return redirect(url_for(
            '%s.api_get' % self.name,
            obj_id=obj.id
            ))

def get_blueprint(basemapper, config):
    return '/party', PartyBlueprint(
        'party',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
