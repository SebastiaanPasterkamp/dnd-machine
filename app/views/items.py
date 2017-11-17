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
    if request.is_xhr:
        datamapper = get_datamapper()
        spell_list = datamapper.items.spell_list
        for spell in spell_list:
            spell['description'] = filter_markdown(spell['description'])
        return jsonify(spell_list)

    return render_template(
        'items/spells.html',
        search='',
        reactjs=True
        )

@blueprint.route('/languages')
def languages():
    if request.is_xhr:
        datamapper = get_datamapper()
        languages = datamapper.items.getList(
            'languages.common,languages.exotic'
            )
        return jsonify(languages)

    return render_template(
        'items/languages.html',
        search='',
        reactjs=True
        )

@blueprint.route('/weapons')
def weapons():
    if request.is_xhr:
        datamapper = get_datamapper()
        weaponsets = [
            datamapper.items.weaponsSimpleMelee,
            datamapper.items.weaponsSimpleRanged,
            datamapper.items.weaponsMartialMelee,
            datamapper.items.weaponsMartialRanged
            ]
        return jsonify(weaponsets)

    return render_template(
        'items/weapons.html',
        search='',
        reactjs=True
        )

@blueprint.route('/weapons/new')
def weapon_new():
    return render_template(
        'items/weapons.html',
        reactjs=True
        )

@blueprint.route('/weapons/<int:item_id>')
def weapon_edit(item_id):
    return render_template(
        'items/weapons.html',
        reactjs=True
        )

@blueprint.route('/armor')
def armor():
    datamapper = get_datamapper()
    armor = datamapper.items.armor
    armorsets = [
        datamapper.items.armorLight,
        datamapper.items.armorMedium,
        datamapper.items.armorHeavy,
        datamapper.items.armorShield
        ]
    if request.is_xhr:
        return jsonify(armorsets)

    return render_template(
        'items/armor.html',
        search='',
        armors=armor,
        reactjs=True
        )

@blueprint.route('/api/<int:item_id>', methods=['GET'])
def api_get(item_id):
    datamapper = get_datamapper()

    item = datamapper.weapon.getById(item_id)

    return jsonify(item.config)

@blueprint.route('/api', methods=['POST'])
def api_post():
    if 'dm' not in request.user['role']:
        abort(403)

    datamapper = get_datamapper()

    item = datamapper.weapon.create(request.get_json())
    if 'id' in item and item.id:
        abort(409, "Cannot create with existing ID")
    item = datamapper.weapon.insert(item)

    return jsonify(item.config)

@blueprint.route('/api/<int:item_id>', methods=['PATCH'])
def api_patch(item_id):
    if 'dm' not in request.user['role']:
        abort(403)

    datamapper = get_datamapper()

    item = datamapper.weapon.getById(item_id)
    item.config = request.get_json()
    if item.id != item_id:
        abort(409, "Cannot change ID")
    item = datamapper.weapon.update(item)

    return jsonify(item.config)
