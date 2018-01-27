# -*- coding: utf-8 -*-
from flask import (
    request, abort, redirect, url_for, render_template, session
    )

from .baseapi import BaseApiBlueprint
from .. import get_datamapper

class PartyBlueprint(BaseApiBlueprint):

    def __init__(self, name, *args, **kwargs):
        super(PartyBlueprint, self).__init__(name, *args, **kwargs)

        self.add_url_rule(
            '/hosting', 'hosting',
            self.get_hosting, methods=['GET'])
        self.add_url_rule(
            '/host/<int:obj_id>', 'host',
            self.set_hosting, methods=['POST'])
        self.add_url_rule(
            '/xp/<int:obj_id>/<int:xp>', 'xp',
            self.xp, methods=['GET', 'POST'])

    @property
    def datamapper(self):
        if not self._datamapper:
            datamapper = get_datamapper()
            self._datamapper = datamapper.party
        return self._datamapper

    @property
    def charactermapper(self):
        if '_charactermapper' not in self.__dict__:
            datamapper = get_datamapper()
            self._charactermapper = datamapper.character
        return self._charactermapper

    def _exposeAttributes(self, obj):
        fields = ['id', 'user_id', 'name']
        if self.checkRole(['admin', 'dm']) \
                and obj.user_id == request.user.id:
            fields = [
                'id', 'user_id', 'name', 'description', 'challenge',
                'member_ids'
                ]
        result = dict([
            (key, obj[key])
            for key in fields
            ])
        return result

    def show(self, obj_id):
        party = self.datamapper.getById(obj_id)
        party.members = self.charactermapper.getByPartyId(obj_id)

        datamapper = get_datamapper()
        user = datamapper.user.getById(party.user_id)

        return render_template(
            'party/show.html',
            party=party,
            user=user,
            characters=party.members
            )

    def _api_list_filter(self, objs):
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
        objs = [
            obj
            for obj in objs
            if obj.id in visible
            ]
        for obj in objs:
            obj.members = self.charactermapper.getByPartyId(obj.id)
        return objs

    def _api_get_filter(self, obj):
        obj.members = self.charactermapper.getByPartyId(obj.id)
        return obj

    def _api_post_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        obj.user_id = request.user.id
        obj.members = [
            self.charactermapper.getById(member_id)
            for member_id in obj.member_ids
            ]
        return obj

    def _api_patch_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        if obj.user_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403, "Not owned")
        obj.members = [
            self.charactermapper.getById(member_id)
            for member_id in obj.member_ids
            ]
        return obj

    def _api_recompute_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        if obj.user_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403, "Not owned")
        obj.members = [
            self.charactermapper.getById(member_id)
            for member_id in obj.member_ids
            ]
        obj.compute()
        return obj

    def _api_delete_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        if obj.user_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403, "Not owned")
        return obj

    def get_hosting(self):
        if session.get('party_id') is None:
            return jsonify(None)
        return redirect(url_for(
            '%s.api_get' % self.name,
            obj_id=session.get('party_id')
            ))

    def set_hosting(self, obj_id):
        if not self.checkRole(['dm']):
            abort(403)
        session['party_id'] = obj_id
        return redirect(url_for(
            '%s.api_get' % self.name,
            obj_id=obj_id
            ))

    def xp(self, obj_id, xp):
        if not self.checkRole(['admin', 'dm']):
            abort(403)

        obj = self.datamapper.getById(obj_id)
        if obj is None:
            return jsonify(None)

        obj.members = self.charactermapper.getByPartyId(obj.id)
        for member in party.members:
            member.xp += int(xp / obj.size)
            member.compute()
            self.charactermapper.update(member)
        obj.members = self.charactermapper.getByPartyId(obj.id)

        self.datamapper.update(party)

        return redirect(url_for(
            '%s.api_get' % self.name,
            obj_id=obj.id
            ))

blueprint = PartyBlueprint(
    'party', __name__, template_folder='templates')
