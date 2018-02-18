# -*- coding: utf-8 -*-
from flask import request, abort, render_template, url_for

from .baseapi import BaseApiBlueprint

class UserBlueprint(BaseApiBlueprint):
    @property
    def datamapper(self):
        return self.basemapper.user

    def _exposeAttributes(self, obj):
        fields = ['id', 'name', 'role']

        if obj.id == request.user.id \
                or self.checkRole(['admin']):
            fields = ['id', 'username', 'name', 'email', 'role']

        result = dict([
            (key, obj[key])
            for key in fields
            ])

        return result

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

    def show(self, obj_id):
        if obj_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403)
        return render_template(
            'reactjs-layout.html'
            )

    def edit(self, obj_id):
        if obj_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403)
        return render_template(
            'reactjs-layout.html'
            )

    def new(self):
        if obj_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403)
        return render_template(
            'reactjs-layout.html'
            )

def get_blueprint(basemapper):
    return UserBlueprint(
        'user',
        __name__,
        basemapper=basemapper,
        template_folder='templates'
        )
