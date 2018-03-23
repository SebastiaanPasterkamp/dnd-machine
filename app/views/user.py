# -*- coding: utf-8 -*-
from flask import request, abort, render_template, url_for

from .baseapi import BaseApiBlueprint

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
            for key, value in obj.config.items()
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
            for key, value in config.items()
            if key in mutable
            ])

    def overview(self, *args, **kwargs):
        if not self.checkRole(['admin']):
            abort(403)
        return super(UserBlueprint, self).overview(*args, **kwargs)

    def newObj(self, *args, **kwargs):
        if not self.checkRole(['admin']):
            abort(403)
        return super(UserBlueprint, self).newObj(
            *args, **kwargs)

    def show(self, obj_id):
        if obj_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403)
        return super(UserBlueprint, self).show(
            *args, **kwargs)

    def edit(self, obj_id):
        if obj_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403)
        return super(UserBlueprint, self).edit(
            *args, **kwargs)

    def _raw_filter(self, obj):
        if not self.checkRole(['admin']):
            abort(403)
        return obj

    def _api_list_filter(self, objs):
        if not self.checkRole(['admin']):
            abort(403)
        return objs

    def _api_post_filter(self, obj):
        if not self.checkRole(['admin']):
            abort(403)
        obj.setPassword(obj.password)
        return obj

    def _api_patch_filter(self, obj):
        if obj.id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403)

        old = self.datamapper.getById(obj.id)
        if not len(obj.password):
            obj.password = old.password
        elif obj.password != old.password:
            obj.setPassword(obj.password)

        return obj

    def _api_delete_filter(self, obj):
        if not self.checkRole(['admin']):
            abort(403)
        return obj

def get_blueprint(basemapper, config):
    return '/user', UserBlueprint(
        'user',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
