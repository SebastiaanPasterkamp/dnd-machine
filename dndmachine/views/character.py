# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, \
    send_file, current_app, abort, render_template, jsonify
import os
import codecs
import re

from ..models.character import CharacterObject
from ..config import get_config, get_character_data, get_item_data
from ..utils import get_datamapper
from . import fill_pdf

character = Blueprint(
    'character', __name__, template_folder='templates')

@character.route('/')
@character.route('/list')
@character.route('/list/<int:party_id>')
def overview(party_id=None):
    character_mapper = get_datamapper('character')

    search = request.args.get('search', '')
    characters = character_mapper.getList(search)
    party = None
    members = []
    users = []

    if not any(role in request.user['role'] for role in ['admin', 'dm']):
        characters = [
            c
            for c in characters
            if c['user_id'] == request.user['id']
            ]
    else:
        user_mapper = get_datamapper('user')
        users = dict([
            (user_id, user_mapper.getById(user_id))
            for user_id in set([
                c.user_id
                for c in characters if c.user_id
                ])
            ])

    if party_id is not None:
        party_mapper = get_datamapper('party')
        party = party_mapper.getById(party_id)
        members = [c['id'] for c in character_mapper.getByPartyId(party_id)]

    return render_template(
        'character/overview.html',
        characters=characters,
        users=users,
        party=party,
        members=members,
        search=search
        )

@character.route('/show/<int:character_id>')
@character.route('/show/<int:party_id>/<int:character_id>')
def show(character_id, party_id=None):
    items = get_item_data()
    character_mapper = get_datamapper('character')
    user_mapper = get_datamapper('user')
    machine = get_datamapper('machine')

    party_members = []
    if party_id:
        party_members = [
            c.id
            for c in character_mapper.getByPartyId(party_id)
            ]

    c = character_mapper.getById(character_id)
    if c.user_id != request.user.id \
            and c.id not in party_members \
            and not any([role in request.user.role for role in ['admin', 'dm']]):
        abort(403)

    user = user_mapper.getById(c.user_id)

    return render_template(
        'character/show.html',
        character=c,
        items=items,
        user=user
        )

@character.route('/raw/<int:character_id>')
def raw(character_id):
    character_mapper = get_datamapper('character')

    c = character_mapper.getById(character_id)

    if c['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)
    return jsonify(c.config)

@character.route('/download/<int:character_id>')
def download(character_id):
    items = get_item_data()
    character_mapper = get_datamapper('character')
    user_mapper = get_datamapper('user')

    c = character_mapper.getById(character_id)
    if c['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)
    user = user_mapper.getById(c['user_id'])

    fdf_data = {
        "CharacterName": c['name'],
        "CharacterName 2": c['name'],
        "PlayerName": user["username"],
        "HPMax": c["hit_points"],
        "HD": "%dd%d" % (c["level"], c["hit_dice"]),
        "XP": c["xp"],
        "Race ": c["race"],
        "ClassLevel": "%s %d" % (c["class"], c["level"]),
        "Speed": c["speed"],
        "Background": c['background'],
        "Alignment": c['alignment'],
        "ProBonus": c['proficiency'],
        "SpellSaveDC  2": c["spell_safe_dc"],
        "SpellAtkBonus 2": c["spell_attack_modifier"],
        "Spellcasting Class 2": c["class"],
        "ProficienciesLang": str(c["languages"]),
        "Initiative": c["modifiers"]["dexterity"],
        "Passive": 10 + c["modifiers"]["wisdom"]
        }
    for stat, value in c["stats"].iteritems():
        stat_name = stat.capitalize()
        fdf_data[stat[:3].upper()] = value
        fdf_data[stat[:3].upper() + 'mod'] = c["modifiers"][stat]

        fdf_data[stat_name] = c['modifiers'][stat]
        if stat in c['skills']:
            fdf_data[stat_name] += c['proficiency']
            fdf_data['ST ' + stat_name] = True

    for skill in items['skills']:
        skill_name = skill['name'].capitalize()
        fdf_data[skill_name] = c['modifiers'][skill['stat']]
        if skill['name'] in c['skills']:
            fdf_data[skill_name] += c['proficiency']
            fdf_data['ChBx ' + skill_name] = True

    pdf_file = os.path.join('dndmachine', 'static', 'pdf', 'Current Standard v1.4.pdf')

    filename = re.sub(ur'[^\w\d]+', '_', c['name']) + '.pdf'
    return send_file(
        fill_pdf(pdf_file, fdf_data, '/tmp/%s.fdf' % c['name']),
        mimetype="application/pdf",
        as_attachment=True,
        attachment_filename=filename
        )

@character.route('/edit/<int:character_id>', methods=['GET', 'POST'])
def edit(character_id):
    config = get_config()
    character_mapper = get_datamapper('character')

    c = character_mapper.getById(character_id)
    if c['user_id'] != request.user['id'] \
            and not any([role in request.user.role for role in ['admin', 'dm']]):
        abort(403)

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'character.show',
                character_id=character_id
                ))

        c.updateFromPost(request.form)

        if request.form.get("button", "save") == "save":
            character_mapper.update(c)
            return redirect(url_for(
                'character.show',
                character_id=character_id
                ))

        if request.form.get("button", "save") == "update":
            character_mapper.update(c)
            return redirect(url_for(
                'character.edit',
                character_id=character_id
                ))

    return render_template(
        'character/edit.html',
        data=config['data'],
        character=c
        )

@character.route('/del/<int:character_id>')
def delete(character_id):
    character_mapper = get_datamapper('character')

    c = character_mapper.getById(character_id)
    if c['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)

    character_mapper.delete(c)

    return redirect(url_for(
        'character.overview'
        ))

@character.route('/new', methods=['GET', 'POST'])
def new():
    config = get_config()
    cdata = get_character_data()
    items = get_item_data()

    for section in ['race', 'class', 'background']:
        cdata[section] = [
            part for part in cdata[section]
            if part['name']
            ]
        for part in cdata[section]:
            mdfile = os.path.join('dndmachine', 'data', part['filename'])
            with codecs.open(mdfile, encoding='utf-8') as fh:
                part['description'] = fh.read()

    def expandOptions(options):
        if isinstance(options, dict):
            return dict([
                (key, expandOptions(val))
                for key, val in options.iteritems()
                ])
        elif isinstance(options, list):
            return [
                expandOptions(val)
                for val in options
                ]
        elif isinstance(options, basestring):
            expanded = [
                item['name'] if isinstance(item, dict) else item
                for path in options.split(',')
                for item in c.getPath(path, structure=items, default=[])
                ]
            if expanded:
                return expanded
        return options

    def setPerks(obj, perks, options=None):
        if options is None:
            options = {}

        for field in ['hit_points', 'spell_safe_dc', 'spell_attack_modifier']:
            if field in perks:
                perk = perks[field]
                obj.computed[field] = obj.computed.get(field, {})
                if "formula" in perk:
                    obj.computed[field]["formula"] = perk["formula"]
                if "bonus" in perk:
                    obj.computed[field]["bonus"] = \
                        obj.computed[field]["bonus"].get(field, [])
                    obj.computed[field]["bonus"].extend(
                        perk.get('bonus', []))

        options['proficiencies'] = options.get('proficiencies', {})
        for field, profs in perks.get('proficiencies', {}).iteritems():
            if 'options' in profs:
                options['proficiencies'][field] = options['proficiencies'].get(field, [])
                options['proficiencies'][field].append({
                    'options': expandOptions(profs['options'])
                    })
            if 'sets' in profs:
                options['proficiencies'][field] = options['proficiencies'].get(field, [])
                options['proficiencies'][field].append({
                    'sets': expandOptions(profs['sets'])
                    })
            obj.proficiencies[field] = list(
                set(obj.proficiencies[field]) \
                | set(profs.get('given', []))
                )

        for field in ['size', 'speed', 'hit_dice', 'spell_stat']:
            if field in perks:
                obj[field] = perks[field]

        for field in ['wealth', 'stats_bonus']:
            obj[field] = obj[field] or {}
            for key, val in perks.get(field, {}).iteritems():
                obj[field][key] = \
                    obj[field].get(key, 0) + val

        for field in ['senses', 'languages', 'skills', 'equipment', 'spells']:
            if field in perks:
                perk = perks[field]
                if 'options' in perk:
                    options[field] = options.get(field, [])
                    options[field].append({
                        'options': expandOptions(perk['options'])
                        })
                if 'sets' in perk:
                    options[field] = options.get(field, [])
                    options[field].append({
                        'sets': expandOptions(perk['sets'])
                        })
                obj[field] = list(
                    set(obj[field] or []) \
                    | set(perk.get('given', []))
                    )

        for field in ['info']:
            if field in perks:
                perk = perks[field]
                obj[field] = obj[field] or {}
                obj[field].update(perk)

        return obj


    character_mapper = get_datamapper('character')
    machine = get_datamapper('machine')
    c = CharacterObject({
        'user_id': request.user['id']
        })
    options = {}

    tabs = ['race', 'class', 'background', 'stats', 'customize']
    completed = False

    tab = request.form.get('current')
    completed_tabs = []
    if tab in tabs:
        completed_tabs = tabs[:tabs.index(tab)+1]
    tab = request.form.get('current', 'race')
    if request.form.get('button', 'next') == 'next':
        tabs_left = [
            left
            for left in tabs
            if left not in completed_tabs
            ]
        tab = tabs_left[0]
        if len(tabs_left) == 1:
            completed = True

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'character.overview'
                ))

        c.updateFromPost(request.form)
        for field in cdata:
            if c[field]:
                data = [
                    data for data in cdata[field]
                    if c[field] == data['name'] or any(
                        c[field] == sub['name']
                        for sub in data.get('sub', [])
                        )
                    ][0]
                setPerks(c, data, options)

                sub =[
                    sub for sub in data.get('sub', [])
                    if c[field] == sub['name']
                    ]
                if sub:
                    setPerks(c, sub[0], options)

        if request.form.get("button", "save") == "save":
            c = character_mapper.insert(c)
            return redirect(url_for(
                'character.show',
                character_id=c['id']
                ))

    current = {
        'tab': tab,
        'race': [
            data['name']
            for data in cdata['race']
            if any(sub['name'] == c['race'] for sub in data['sub'])
            ][0] if c['race'] else cdata['race'][0]['name'],
        'class': [
            data['name']
            for data in cdata['class']
            if data['name'] == c['class']
            ][0] if c['class'] else cdata['class'][0]['name'],
        'background': [
            data['name']
            for data in cdata['background']
            if data['name'] == c['background']
            ][0] if c['background'] else cdata['background'][0]['name']
        }

    return render_template(
        'character/create.html',
        data=config['data'],
        character=c,
        tabs=tabs,
        completed_tabs=completed_tabs,
        current=current,
        completed=completed,
        cdata=cdata,
        items=items,
        options=options
        )
