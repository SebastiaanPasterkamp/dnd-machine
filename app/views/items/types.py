# -*- coding: utf-8 -*-
from flask import (
    request, abort, redirect, url_for, render_template, session, jsonify
    )

from ..baseapi import BaseApiBlueprint, BaseApiCallback

class TypesBlueprint(BaseApiBlueprint):

    def __init__(self, name, *args, **kwargs):
        super(TypesBlueprint, self).__init__(name, *args, **kwargs)

        self.add_url_rule(
            '/<string:type>/list', 'overview',
            self.overview)
        self.add_url_rule(
            '/<string:type>/api', 'api_list',
            self.api_list, methods=['GET'])

    @property
    def datamapper(self):
        return self.basemapper.types

    def api_list(self, *args, **kwargs):
        self.doCallback('api_list', *args, **kwargs)

        type = kwargs.get('type')
        objs = []
        if type is None:
            objs = self.datamapper.getMultiple()
        else:
            objs = self.datamapper.getMultiple(
                where="`type` = :type",
                values={ "type": type },
            )
        self.doCallback('api_list.objects', objs, *args, **kwargs)

        response = jsonify([
            self._exposeAttributes(obj)
            for obj in objs
            ])
        response.add_etag()
        return response

    @BaseApiCallback('new')
    @BaseApiCallback('edit')
    @BaseApiCallback('api_post')
    @BaseApiCallback('api_patch')
    @BaseApiCallback('api_delete')
    @BaseApiCallback('api_recompute')
    def adminOrDmOnly(self, *args, **kwargs):
        if not self.checkRole(['admin', 'dm']):
            abort(403)

def get_blueprint(basemapper, config):
    return '/items', TypesBlueprint(
        'types',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
