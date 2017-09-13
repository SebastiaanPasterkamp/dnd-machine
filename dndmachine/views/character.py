# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, \
    send_file, current_app, abort, render_template, jsonify
import os
import re

from ..models.base import JsonObject
from ..models.character import CharacterObject
from ..config import get_config, get_character_data, get_item_data
from ..utils import get_datamapper
from . import fill_pdf

character = Blueprint(
    'character', __name__, template_folder='templates')

def find_caracter_field(character_data, field, value):
    for data in character_data[field]:
        for sub in data.get('sub', []):
            if sub['name'] == value:
                return data, sub
        if data['name'] == value:
            return data, None

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
    machine = get_datamapper('machine')

    def filter_bonus(number):
        if number > 0:
            return "+%d" % number
        return "%d" % number

    c = character_mapper.getById(character_id)
    if c['user_id'] != request.user['id'] \
            and not any([role in request.user.role for role in ['admin', 'dm']]):
        abort(403)
    user = user_mapper.getById(c['user_id'])

    fdf_data = {
        "CharacterName": c.name,
        "CharacterName 2": c.name,
        "PlayerName": user.username,
        "HPMax": c.hit_points,
        "AC": "%s%s" % (
            c.armor_class,
            " / +%d" % c.armor_class_bonus if c.armor_class_bonus else ""
            ),
        "HD": "%dd%d" % (c.level, c.hit_dice),
        "XP": c.xp,
        "Race ": c.race,
        "ClassLevel": "%s %d" % (c.Class, c.level),
        "Speed": c.speed,
        "Background": c.background,
        "Alignment": c.alignment,
        "ProBonus": filter_bonus(c.proficiency),
        "SpellSaveDC  2": c.spell_safe_dc,
        "SpellAtkBonus 2": filter_bonus(c.spell_attack_modifier),
        "Spellcasting Class 2": c.Class,
        "Initiative": filter_bonus(c.initiative_bonus),
        "Passive": filter_bonus(c.passive_perception)
        }

    for stat in items['statistics']:
        stat_prefix = stat['name'][:3].upper()
        fdf_data[stat_prefix] = c.stats[stat['name']]
        fdf_data[stat_prefix + 'mod'] = filter_bonus(c.modifiers[stat['name']])
        fdf_data['SavingThrow ' + stat['label']] = filter_bonus(c.saving_throws[stat['name']])
        if stat['name'] in c.proficienciesAdvantages:
            fdf_data['SavingThrow ' + stat['label']] += 'A'
        if stat['name'] in c.proficienciesSaving_throws:
            fdf_data['ST ' + stat['label']] = True

    for skill in items['skills']:
        fdf_data[skill['label']] = filter_bonus(c.skills[skill['name']])
        if skill['name'] in c.proficienciesSkills:
            fdf_data['ChBx ' + skill['label']] = True

    for i, weapon in enumerate(c.weapons):
        fdf_data['Wpn Name %d' % (i+1)] = weapon['name']
        fdf_data['Wpn%d Damage' % (i+1)] = "%s %s" % (
            weapon['damage'].get('notation', ''),
            weapon['damage'].get('type_short', '')
            )
        fdf_data['Wpn%d AtkBonus' % (i+1)] = filter_bonus(weapon.get('bonus', 0))

    for coin in ['cp', 'sp', 'ep', 'gp', 'pp']:
        fdf_data[coin.upper()] = c.wealth[coin]

    proficiencies = {}
    if c.languages:
        proficiencies["Languages"] = []
        languages = items['languages']
        for lang in languages['common'] + languages['exotic']:
            if lang['name'] in c.languages:
                proficiencies["Languages"].append(lang['label'])

    if c.proficienciesArmor:
        proficiencies["Armor"] = []
        for prof in c.proficienciesArmor:
            if prof is None:
                continue
            proficiencies["Armor"].append(prof)

    if c.proficienciesWeapons:
        proficiencies["Weapons"] = []
        for prof in c.proficienciesWeapons:
            if prof is None:
                continue
            proficiencies["Weapons"].append(prof)

    if c.proficienciesTools:
        proficiencies["Tools"] = []
        for prof in c.proficienciesTools:
            if prof is None:
                continue
            proficiencies["Tools"].append(prof)
    fdf_data["ProficienciesLang"] = "\n\n".join([
        "%s:\n    %s" % (
            key, ", ".join(lines)
            )
        for key, lines in proficiencies.iteritems()
        ])

    fdf_data["Features and Traits"] = "\n\n".join([
        "%s:\n    %s" % (
            key, desc
            )
        for key, desc in c.info.iteritems()
        ])
    equipment = []
    if c.weapons:
        equipment.append(["Weapons:"])
        for weapon in c.weapons:
            desc = [
                "-",
                weapon['name'],
                weapon['damage']['notation'],
                weapon['damage']['type_label'],
                "Hit: %s" % filter_bonus(weapon['bonus'])
                ]
            equipment[-1].append(" ".join(desc))

            desc = []
            props = {
                'two-handed': '2H',
                'versatile': 'Vers.',
                'light': 'Light',
                'finesse': 'Fin.',
                'ammunition': 'Ammo',
                'loading': 'Load',
                'thrown': 'Throw'
                }
            for prop, label in props.iteritems():
                if prop in weapon.get("property", []):
                    desc.append(label)
            if "range" in weapon:
                desc.append(
                    "Range: %d/%d" % (
                        weapon["range"]["min"],
                        weapon["range"]["max"]
                        )
                    )
            if desc:
                equipment[-1].append("  " + ", ".join(desc))

            if "notation_alt" in weapon["damage"]:
                desc = [
                    " ",
                    weapon["use_alt"],
                    ":",
                    weapon["damage"]["notation_alt"],
                    weapon["damage"]["type_label"],
                    "Hit: %s" % filter_bonus(weapon["bonus_alt"])
                    ]
                equipment[-1].append(" ".join(desc))

    if c.armor:
        equipment.append(["Armor:"])
        for armor in c.armor:
            if "value" in armor["armor"]:
                desc = [
                    "-",
                    armor['name'],
                    "AC: %d" % armor["armor"]["value"]
                    ]
            if "bonus" in armor["armor"]:
                desc = [
                    "-",
                    armor['name'],
                    "AC: %s" % filter_bonus(armor["armor"]["bonus"])
                    ]
            if "Strength" in armor:
                desc.extend([
                    "(Str: %d)" % armor["Strength"]
                    ])
            equipment[-1].append(" ".join(desc))

    if c.itemsArtisan:
        equipment.append(["Artisan:"])
        for item in c.itemsArtisan:
            desc = [
                "-",
                item["name"]
                ]
            equipment[-1].append(" ".join(desc))

    if c.itemsKits:
        equipment.append(["Kits:"])
        for item in c.itemsKits:
            desc = [
                "-",
                item["name"]
                ]
            equipment[-1].append(" ".join(desc))

    if c.itemsGaming:
        equipment.append(["Gaming:"])
        for item in c.itemsGaming:
            desc = [
                "-",
                item["name"]
                ]
            equipment[-1].append(" ".join(desc))

    if c.itemsMusical:
        equipment.append(["Musical:"])
        for item in c.itemsMusical:
            desc = [
                "-",
                item["name"]
                ]
            equipment[-1].append(" ".join(desc))

    if c.itemsMisc:
        equipment.append(["Misc:"])
        for item in c.itemsMisc:
            desc = [
                "-",
                item
                ]
            equipment[-1].append(" ".join(desc))

    equipment = sorted(
        equipment,
        key=lambda lines: len(lines),
        reverse=True
        )
    key = ["Equipment", "Equipment2"]
    fdf_data["Equipment"] = "\n".join([
        "\n".join(equipment[i])
        for i in range(0, len(equipment), 2)
        ])
    fdf_data["Equipment2"] = "\n".join([
        "\n".join(equipment[i])
        for i in range(1, len(equipment), 2)
        ])

    fdf_translation = {
        'Wpn Name 1': 'Wpn Name',
        'Wpn2 Damage': 'Wpn2 Damage ',
        'Wpn3 Damage': 'Wpn3 Damage ',
        'Wpn2 AtkBonus': 'Wpn2 AtkBonus ',
        'Wpn3 AtkBonus': 'Wpn3 AtkBonus  ',
        'Sleight of Hand': 'SleightofHand',
        'ChBx Sleight of Hand': 'ChBx Sleight',
        'SavingThrow Strength': 'SavingThrows',
        'SavingThrow Dexterity': 'SavingThrows2',
        'SavingThrow Constitution': 'SavingThrows3',
        'SavingThrow Intelligence': 'SavingThrows4',
        'SavingThrow Wisdom': 'SavingThrows5',
        'SavingThrow Charisma': 'SavingThrows6',
        }
    for old, new in fdf_translation.iteritems():
        if old in fdf_data:
            fdf_data[new] = fdf_data[old]

    pdf_file = os.path.join('dndmachine', 'static', 'pdf', 'Current Standard v1.4.pdf')

    filename = re.sub(ur'[^\w\d]+', '_', c['name']) + '.pdf'
    return send_file(
        fill_pdf(pdf_file, fdf_data, '/tmp/%s.fdf' % c['name']),
        mimetype="application/pdf",
        as_attachment=True,
        attachment_filename=filename
        )

@character.route('/edit/<int:character_id>')
@character.route('/edit/<string:current_phase>/<int:character_id>', methods=['GET', 'POST'])
def edit(character_id, current_phase=None):
    character_data = get_character_data()
    character_mapper = get_datamapper('character')
    machine = get_datamapper('machine')

    c = character_mapper.getById(character_id)
    if c['user_id'] != request.user['id'] \
            and not any([role in request.user.role for role in ['admin', 'dm']]):
        abort(403)
    c.xp = 300
    c.compute()

    phases = JsonObject({
        'init': {
            'steps': [u"core", u"stats", u"equip"],
            'template': 'character/edit/init.html'
            },
        'base': {
            'conditions': {},
            'template': 'character/edit/base.html'
            }
        },
        fieldTypes = {
            '*': { 'conditions': { 'level': int } }
        })

    for field in ['race', 'class', 'background']:
        data, sub = find_caracter_field(
            character_data, field, c[field]
            )
        if 'phases' in data:
            phases.update(data['phases'])
        if sub and 'phases' in sub:
            phases.update(sub['phases'])
    phases = phases.config

    if not current_phase or current_phase not in phases:
        phase_names = []
        for p, phase in phases.iteritems():
            cond = phase['conditions']
            if 'level' in cond \
                    and not cond['level'][0] <= c.level <= cond['level'][1]:
                continue

            if 'steps' in phase and all(s in c.creation for s in phase['steps']):
                continue
            if 'steps' in phase:
                print p, phase['steps'], c.creation

            if 'path' in cond and not all(p in c.path for p in cond['path']):
                continue

            phase_names.append(p)

        phase_names = sorted(
            phase_names,
            key=lambda p: phases[p].get('level', [99, 99])
            )

        return redirect(url_for(
            'character.edit',
            character_id=character_id,
            current_phase=phase_names[0]
            ))
    phase = phases[current_phase]

    def assigning(key, val):
        if isinstance(val, unicode) and '.' in val:
            if val.startswith('character'):
                return (
                    key,
                    c.getPath(val) or val
                    )
            if val.endswith('_formula'):
                return (
                    key.replace('_formula', ''),
                    machine.resolveMath(c, val)
                    )
            return (
                key,
                [item
                 for v in val.split(',')
                 for item in machine.items.getPath(v) or val
                 ]
                )
        if isinstance(val, dict):
            return (
                key,
                dict([
                    assigning(sub_key, sub_val)
                    for sub_key, sub_val in val.iteritems()
                    ])
                )
        if isinstance(val, list):
            return (
                key,
                [assigning(key, v)[1] for v in val]
                )
        return (key, val)

    phase = dict([
        assigning(key, val)
        for key, val in phase.iteritems()
        ])
    #return jsonify(phase)

    c.update(phase.get('given', {}))

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'character.show',
                character_id=character_id
                ))

        c.updateFromPost(request.form)
        c = character_mapper.save(c)

        if request.form.get("button", "save") == "save":
            if current_phase == 'base':
                return redirect(url_for(
                    'character.show',
                    character_id=c.id
                    ))
            return redirect(url_for(
                'character.edit',
                character_id=c.id
                ))

    tabs = []
    last = False
    if 'steps' in phase:
        tabs = phase['steps']
        last = sum([1 for s in tabs if s not in c.creation]) == 1

    return render_template(
        phase.get('template', 'character/edit/level-up.html'),
        phase=phase,
        tabs=tabs,
        last=last,
        given=phase.get('given', {}),
        options=phase.get('options', {}),
        paths=phase.get('paths', {}),
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
@character.route('/new/<int:character_id>', methods=['GET', 'POST'])
def new(character_id=None):
    character_data = get_character_data()
    character_mapper = get_datamapper('character')
    steps = ["race", "class", "background"]

    c = CharacterObject({
        'user_id': request.user.id
        })

    if character_id:
        old = character_mapper.getById(character_id)
        if old.user_id != request.user.id \
                and not any([role in request.user.role for role in ['admin', 'dm']]):
            abort(403)
        c.id = old.id
        c.xp = old.xp

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            if character_id:
                return redirect(url_for(
                    'character.show',
                    character_id=character_id
                    ))
            return redirect(url_for(
                'character.overview'
                ))

        c.updateFromPost(request.form)

        completed = all(
            step in c.creation
            for step in steps
            )

        if completed and request.form.get("button", "save") == "save":
            for step in steps:
                data, sub = find_caracter_field(
                    character_data, step, c[step]
                    )
                c.update(data.get('config', {}))
                if sub:
                    c.update(sub.get('config', {}))

            c = character_mapper.save(c)

            return redirect(url_for(
                'character.edit',
                character_id=c.id
                ))

    return render_template(
        'character/create.html',
        tabs=steps,
        last=sum([1 for step in steps if step not in c.creation]) == 1,
        character_data=character_data,
        character=c
        )

@character.route('/create/<int:character_id>', methods=['GET', 'POST'])
def create(character_id=None):
    config = get_config()
    cdata = get_character_data()
    items = get_item_data()

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
                    obj[field][key] = val

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
    if character_id:
        c = character_mapper.getById(character_id)
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
            c = character_mapper.save(c)
            return redirect(url_for(
                'character.edit',
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
