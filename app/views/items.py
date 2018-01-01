# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, \
    abort, render_template, flash, jsonify

from .. import get_datamapper
from ..filters import filter_markdown

blueprint = Blueprint(
    'items', __name__, template_folder='templates')


@blueprint.route('/statistics')
def statistics():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.statistics)

@blueprint.route('/alignments')
def alignments():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.alignments)

@blueprint.route('/size_hit_dice')
def size_hit_dice():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.size_hit_dice)

@blueprint.route('/monster_types')
def monster_types():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.monster_types)

@blueprint.route('/target_methods')
def target_methods():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.target_methods)

@blueprint.route('/damage_types')
def damage_types():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.damage_types)


@blueprint.route('/<string:objects>/list')
def get_list(objects):
    return render_template(
        'reactjs-layout.html'
        )

@blueprint.route('/spells', methods=['GET'])
def api_list_spells():
    datamapper = get_datamapper()
    spells = datamapper.items.spell_list
    for spell in spells:
        spell['description'] = filter_markdown(spell['description'])
    return jsonify(spells)


@blueprint.route('/languages', methods=['GET'])
def api_list_languages():
    datamapper = get_datamapper()
    languages = datamapper.items.getList(
        'languages.common,languages.exotic'
        )
    return jsonify(languages)

@blueprint.route('/<string:item_type>/api', methods=['GET'])
def api_list(item_type):
    datamapper = get_datamapper()
    items = datamapper[item_type].getMultiple()
    return jsonify([
        item.config
        for item in items
        ])

@blueprint.route('/<string:item_type>/new')
@blueprint.route('/<string:item_type>/edit/<int:item_id>')
def weapon_edit(item_type, item_id=None):
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
