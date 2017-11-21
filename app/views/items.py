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


@blueprint.route('/spells')
def spells():
    if not request.is_xhr:
        return render_template(
            'reactjs-layout.html'
            )

    datamapper = get_datamapper()
    spells = datamapper.items.spell_list
    for spell in spells:
        spell['description'] = filter_markdown(spell['description'])
    return jsonify(spells)


@blueprint.route('/languages')
def languages():
    if not request.is_xhr:
        return render_template(
            'reactjs-layout.html'
            )

    datamapper = get_datamapper()
    languages = datamapper.items.getList(
        'languages.common,languages.exotic'
        )
    return jsonify(languages)


@blueprint.route('/weapons')
def weapons():
    if not request.is_xhr:
        return render_template(
            'reactjs-layout.html'
            )

    datamapper = get_datamapper()
    weaponsets = [
        {
            "name": u"Simple Melee Weapons",
            "items": [
                item.config
                for item in datamapper.weapons.getMultiple(
                    "`type` = :weapon",
                    {"weapon": "simple melee weapon"}
                    )
                ]
            },
        {
            "name": u"Simple Ranged Weapons",
            "items": [
                item.config
                for item in datamapper.weapons.getMultiple(
                    "`type` = :weapon",
                    {"weapon": "simple ranged weapon"}
                    )
                ]
            },
        {
            "name": u"Martial Melee Weapons",
            "items": [
                item.config
                for item in datamapper.weapons.getMultiple(
                    "`type` = :weapon",
                    {"weapon": "martial melee weapon"}
                    )
                ]
            },
        {
            "name": u"Martial Ranged Weapons",
            "items": [
                item.config
                for item in datamapper.weapons.getMultiple(
                    "`type` = :weapon",
                    {"weapon": "martial ranged weapon"}
                    )
                ]
            }
        ]

    return jsonify(weaponsets)


@blueprint.route('/<string:item_type>/new')
@blueprint.route('/<string:item_type>/edit/<int:item_id>')
def weapon_edit(item_type, item_id=None):
    return render_template(
        'reactjs-layout.html'
        )


@blueprint.route('/armor')
def armor():
    if not request.is_xhr:
        return render_template(
            'reactjs-layout.html'
            )

    datamapper = get_datamapper()
    armor = datamapper.items.armor
    armorsets = [
        {
            "name": u"Light Armor",
            "items": [
                item.config
                for item in datamapper.armor.getMultiple(
                    "`type` = :armor",
                    {"armor": "light armor"}
                    )
                ]
            },
        {
            "name": u"Medium Armor",
            "items": [
                item.config
                for item in datamapper.armor.getMultiple(
                    "`type` = :armor",
                    {"armor": "medium armor"}
                    )
                ]
            },
        {
            "name": u"Heavy Armor",
            "items": [
                item.config
                for item in datamapper.armor.getMultiple(
                    "`type` = :armor",
                    {"armor": "heavy armor"}
                    )
                ]
            },
        {
            "name": u"Shields",
            "items": [
                item.config
                for item in datamapper.armor.getMultiple(
                    "`type` = :armor",
                    {"armor": "shield armor"}
                    )
                ]
            },
        ]
    return jsonify(armorsets)


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

    item = datamapper[item_type].create(request.get_json())
    if 'id' not in item or item.id != item_id:
        abort(409, "Cannot change ID")
    item = datamapper[item_type].update(item)

    return jsonify(item.config)
