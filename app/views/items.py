# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, \
    abort, render_template, flash, jsonify

from .. import get_datamapper
from ..filters import filter_markdown

blueprint = Blueprint(
    'items', __name__, template_folder='templates')


@blueprint.route('/statistics/api')
def statistics():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.statistics)

@blueprint.route('/skills/api')
def skills():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.skills)

@blueprint.route('/alignments/api')
def alignments():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.alignments)

@blueprint.route('/size_hit_dice/api')
def size_hit_dice():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.size_hit_dice)

@blueprint.route('/monster_types/api')
def monster_types():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.monster_types)

@blueprint.route('/target_methods/api')
def target_methods():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.target_methods)

@blueprint.route('/damage_types/api')
def damage_types():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.damage_types)

@blueprint.route('/tools/api')
def tools():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.tools)

@blueprint.route('/genders/api')
def genders():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.genders)

@blueprint.route('/<string:objects>/list')
def get_list(objects):
    return render_template(
        'reactjs-layout.html'
        )

@blueprint.route('/languages/api', methods=['GET'])
def api_list_languages():
    datamapper = get_datamapper()
    languages = datamapper.items.getList(
        'languages'
        )
    return jsonify(languages)

@blueprint.route('/<string:item_type>/api', methods=['GET'])
def api_list(item_type):
    datamapper = get_datamapper()

    if item_type not in datamapper:
        return jsonify(datamapper.items[item_type])

    items = datamapper[item_type].getMultiple()
    return jsonify([
        item.config
        for item in items
        ])

@blueprint.route('/<string:item_type>/new')
@blueprint.route('/<string:item_type>/edit/<int:item_id>')
def item_edit(item_type, item_id=None):
    return render_template(
        'reactjs-layout.html'
        )

@blueprint.route('/<string:item_type>/api/<int:item_id>', methods=['GET'])
def api_get(item_type, item_id):
    datamapper = get_datamapper()

    item = datamapper[item_type].getById(item_id)

    return jsonify(item.config)


@blueprint.route('/<string:item_type>/api', methods=['POST'])
def api_post(item_type):
    if 'dm' not in request.user['role']:
        abort(403)

    datamapper = get_datamapper()

    item = datamapper[item_type].create(request.get_json())
    if 'id' in item and item.id:
        abort(409, "Cannot create with existing ID")
    item = datamapper[item_type].insert(item)

    return jsonify(item.config)


@blueprint.route('/<string:item_type>/api/<int:item_id>', methods=['PATCH'])
def api_patch(item_type, item_id):
    if 'dm' not in request.user['role']:
        abort(403)

    datamapper = get_datamapper()
    item = datamapper[item_type].getById(item_id)
    item.update(request.get_json())

    if 'id' not in item or item.id != item_id:
        abort(409, "Cannot change ID")

    item = datamapper[item_type].update(item)

    return jsonify(item.config)
