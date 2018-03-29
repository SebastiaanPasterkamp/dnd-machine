# -*- coding: utf-8 -*-
from flask import Blueprint, abort, render_template, jsonify

from .. import get_datamapper

def register_paths(blueprint, basemapper, config):

    @blueprint.route('/<string:item>/list')
    def overview(self, item):
        return render_template(
            'reactjs-layout.html'
            )

    @blueprint.route('/<string:item>/api')
    def get_item(item):
        if item in basemapper.items:
            return jsonify(basemapper.items[item])
        abort(404)


def get_blueprint(basemapper, config):
    blueprint = Blueprint(
        'items', __name__, template_folder='templates')

    register_paths(blueprint, basemapper, config)

    return '/items', blueprint
