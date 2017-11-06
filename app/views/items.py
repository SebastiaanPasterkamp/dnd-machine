# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, \
    abort, render_template, flash, jsonify

from .. import get_datamapper
from ..filters import filter_markdown

items = Blueprint(
    'items', __name__, template_folder='templates')

@items.route('/statistics')
def statistics():
    datamapper = get_datamapper()
    return jsonify(datamapper.items.statistics)

@items.route('/spells')
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

@items.route('/languages')
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

@items.route('/weapons')
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
        reactjs=True        )

@items.route('/armor')
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
