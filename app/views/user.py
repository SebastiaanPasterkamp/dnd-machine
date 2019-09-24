# -*- coding: utf-8 -*-
from flask import request, abort

from views.baseapi import BaseApiBlueprint, BaseApiCallback

class UserBlueprint(BaseApiBlueprint):
    @property
    def datamapper(self):
        return self.basemapper.user

    def _exposeAttributes(self, obj):
        exposed = set(['id', 'name', 'dci'])
        if obj.id == request.user.id \
                or self.checkRole(['admin']):
            exposed |= set(['username', 'email', 'role'])
        retval = dict([
            (key, value)
            for key, value in list(obj.config.items())
            if key in exposed
            ])
        return retval

    def _mutableAttributes(self, config, obj=None):
        mutable = set()
        if self.checkRole(['admin']):
            mutable |= set([
                'username', 'password', 'role', 'email',
                'name', 'dci',
                ])
        if obj is not None and obj.id == request.user.id:
            mutable |= set([
                'password', 'email', 'name', 'dci',
                ])
        return dict([
            (key, value)
            for key, value in list(config.items())
            if key in mutable
            ])

    @BaseApiCallback('index')
    @BaseApiCallback('overview')
    @BaseApiCallback('new')
    @BaseApiCallback('raw')
    @BaseApiCallback('api_list')
    @BaseApiCallback('api_post')
    @BaseApiCallback('api_copy')
    @BaseApiCallback('api_delete')
    def adminOnly(self, *args, **kwargs):
        if not self.checkRole(['admin']):
            abort(403)

    @BaseApiCallback('api_copy.object')
    def updateName(self, obj, *args, **kwargs):
        obj.name += ' (copy)'

    @BaseApiCallback('show')
    @BaseApiCallback('edit')
    def adminOrOwnedID(self, obj_id, *args, **kwargs):
        if obj_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403)

    @BaseApiCallback('api_patch.object')
    @BaseApiCallback('api_recompute.object')
    def adminOrOwned(self, obj, *args, **kwargs):
        if obj.id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403)

    @BaseApiCallback('api_post.object')
    def hashPassword(self, obj, *args, **kwargs):
        obj.setPassword(obj.password)

    @BaseApiCallback('api_patch.object')
    def hashOrPreservePassword(self, obj, *args, **kwargs):
        old = self.datamapper.getById(obj.id)
        if not len(obj.password):
            obj.password = old.password
        elif obj.password != old.password:
            obj.setPassword(obj.password)

def get_blueprint(basemapper, config):
    return '/user', UserBlueprint(
        'user',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
