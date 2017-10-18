# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash

from .. import get_datamapper

items = Blueprint(
    'items', __name__, template_folder='templates')

@items.route('/')
@items.route('/spells')
def spells():
    datamapper = get_datamapper()
    spell_list = datamapper.items.spell_list

    name = request.args.get('name', '').lower()
    level = request.args.get('level', '')
    classes = request.args.get('classes', '')

    def matches(spell):
        if level and level != spell['level']:
            return False
        if classes and classes not in spell['classes']:
            return False
        if name and name not in spell['name'].lower():
            return False
        return True

    spell_list = [
        spell
        for spell in spell_list
        if matches(spell)
        ]

    return render_template(
        'items/spells.html',
        name=name,
        level=level,
        classes=classes,
        spell_list=spell_list
        )

@items.route('/languages')
def languages():
    datamapper = get_datamapper()
    languages = datamapper.items.getList(
        'languages.common,languages.exotic'
        )

    search = request.args.get('search', '').lower()
    if search:
        languages = [
            language
            for language in languages
            if search in language['name']
            ]

    return render_template(
        'items/languages.html',
        languages=languages
        )

@items.route('/weapons')
def weapons():
    datamapper = get_datamapper()
    weapons = datamapper.items.weapons

    return render_template(
        'items/weapons.html',
        weapons=weapons
        )

@items.route('/armor')
def armor():
    datamapper = get_datamapper()
    armors = datamapper.items.armor

    return render_template(
        'items/armor.html',
        armors=armors
        )
