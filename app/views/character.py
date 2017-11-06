# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, \
    send_file, current_app, abort, render_template, jsonify
import os
import re
import markdown

from .. import get_datamapper
from ..models.base import JsonObject
from ..models.character import CharacterObject
from ..config import get_config, get_character_data, get_item_data
from ..filters import filter_bonus, filter_unique
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
    datamapper = get_datamapper()

    search = request.args.get('search', '')
    characters = datamapper.character.getList(search)
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
        users = dict([
            (user_id, datamapper.user.getById(user_id))
            for user_id in set([
                c.user_id
                for c in characters if c.user_id
                ])
            ])

    if party_id is not None:
        party = datamapper.party.getById(party_id)
        members = [c['id'] for c in datamapper.character.getByPartyId(party_id)]

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
    datamapper = get_datamapper()

    party_members = []
    if party_id:
        party_members = [
            c.id
            for c in datamapper.character.getByPartyId(party_id)
            ]

    c = datamapper.character.getById(character_id)
    if c.user_id != request.user.id \
            and c.id not in party_members \
            and not any([role in request.user.role for role in ['admin', 'dm']]):
        abort(403)

    user = datamapper.user.getById(c.user_id)

    return render_template(
        'character/show.html',
        character=c,
        items=items,
        user=user
        )

@character.route('/raw/<int:character_id>')
def raw(character_id):
    datamapper = get_datamapper()

    c = datamapper.character.getById(character_id)

    if c['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)
    return jsonify(c.config)

@character.route('/download/<int:character_id>')
def download(character_id):
    items = get_item_data()
    datamapper = get_datamapper()

    c = datamapper.character.getById(character_id)
    if c['user_id'] != request.user['id'] \
            and not any([role in request.user.role for role in ['admin', 'dm']]):
        abort(403)
    user = datamapper.user.getById(c['user_id'])

    fdf_text = {
        "CharacterName": c.name,
        "CharacterName 2": c.name,
        "PlayerName": user.username,
        "HPMax": c.hit_points,
        "AC": "%s%s" % (
            c.armor_class,
            " / +%s" % c.armor_class_bonus if c.armor_class_bonus else ""
            ),
        "HD": "%dd%d" % (c.level, c.hit_dice),
        "XP": c.xp,
        "Race ": c.race,
        "ClassLevel": "%s %d" % (c.Class, c.level),
        "Speed": c.speed,
        "Background": c.background,
        "Alignment": c.alignment,
        "ProBonus": filter_bonus(c.proficiency),
        "Initiative": filter_bonus(c.initiative_bonus),
        "Passive": filter_bonus(c.passive_perception),
        "Age": c.age,
        "Height": c.height,
        "Weight": c.weight,
        "Current Weight": c.weight,
        #"Appearance": c.appearance,
        "PersonalityTraits ": c.personalityTraits,
        "Ideals": c.personalityIdeals,
        "Bonds": c.personalityBonds,
        "Flaws": c.personalityFlaws
        }
    fdf_html = {
        "Background": c.background
        }

    if c.spell_safe_dc:
        fdf_text.update({
            "SpellSaveDC 2": c.spell_safe_dc,
            "SpellAtkBonus 2": filter_bonus(c.spell_attack_modifier),
            "Spellcasting Class 2": c.Class,
            "Total Prepared Spells": c.known_spells or '',
            "AttacksSpellcasting": ""
            })
    if c.spell_slots:
        fdf_spell_slots = {
            "1st_level": "SlotsTotal 19",
            "2nd_level": "SlotsTotal 20",
            "3rd_level": "SlotsTotal 21",
            "4th_level": "SlotsTotal 22",
            "5th_level": "SlotsTotal 23",
            "6th_level": "SlotsTotal 24",
            "7th_level": "SlotsTotal 25",
            "8th_level": "SlotsTotal 26",
            "9th_level": "SlotsTotal 27"
            }
        for level, slots in c.spell_slots.items():
            fdf_text[ fdf_spell_slots[level] ] = slots

    if c.spells:
        fdf_spell_lists = {
            "cantrip": ["1014", "1015", "1016", "1017", "1018", "1019", "1020", "1021"],
            "1st_level": ["1022", "1023", "1024", "1025", "1026", "1027", "1028", "1029", "1030", "1031", "1032", "1033"],
            "2nd_level": ["1046", "1034", "1035", "1036", "1037", "1038", "1039", "1040", "1041", "1042", "1043", "1044", "1045"],
            "3rd_level": ["1048", "1047", "1049", "1050", "1051", "1052", "1053", "1054", "1055", "1056", "1057", "1058", "1059"],
            "4th_level": ["1061", "1060", "1062", "1063", "1064", "1065", "1066", "1067", "1068", "1069", "1070", "1071", "1072"],
            "5th_level": ["1074", "1073", "1075", "1076", "1077", "1078", "1079", "1080", "1081"],
            "6th_level": ["1083", "1082", "1084", "1085", "1086", "1087", "1088", "1089", "1090"],
            "7th_level": ["1092", "1091", "1093", "1094", "1095", "1096", "1097", "1098", "1099"],
            "8th_level": ["10101", "10100", "10102", "10103", "10104", "10105", "10106"],
            "9th_level": ["10108", "10107", "10109", "101010", "101011", "101012", "101013"]
            }
        for level, spells in c.spells.items():
            fdf_spell_list = fdf_spell_lists[ level ]
            for i, spell in enumerate(spells):
                fdf_text[ "Spells %s" % fdf_spell_list[i] ] = spell

    for stat in items['statistics']:
        stat_prefix = stat['name'][:3].upper()
        fdf_text[stat_prefix] = c.stats[stat['name']]
        fdf_text[stat_prefix + 'mod'] = filter_bonus(c.modifiers[stat['name']])
        fdf_text['SavingThrow ' + stat['label']] = filter_bonus(c.saving_throws[stat['name']])
        if stat['name'] in c.proficienciesAdvantages:
            fdf_text['SavingThrow ' + stat['label']] += 'A'
        if stat['name'] in c.proficienciesSaving_throws:
            fdf_text['ST ' + stat['label']] = True

    for skill in items['skills']:
        fdf_text[skill['label']] = filter_bonus(c.skills[skill['name']])
        if skill['name'] in c.proficienciesSkills:
            fdf_text['ChBx ' + skill['label']] = True

    i = 0
    for count, weapon in filter_unique(c.weapons):
        fdf_text['Wpn Name %d' % (i+1)] = "%d x %s" % (
            count, weapon['name']) if count > 1 else weapon['name']
        fdf_text['Wpn%d Damage' % (i+1)] = "%s %s" % (
            weapon['damage'].get('notation', ''),
            weapon['damage'].get('type_short', '')
            )
        fdf_text['Wpn%d AtkBonus' % (i+1)] = filter_bonus(weapon.get('bonus', 0))
        i += 1

    for coin in ['cp', 'sp', 'ep', 'gp', 'pp']:
        fdf_text[coin.upper()] = c.wealth[coin]

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
    fdf_text["ProficienciesLang"] = "\n\n".join([
        "%s:\n    %s" % (
            key, ", ".join(lines)
            )
        for key, lines in proficiencies.iteritems()
        ])

    fdf_text["Features and Traits"] = "\n\n".join([
        "* %s: %s" % (
            key, desc
            )
        for key, desc in c.info.iteritems()
        ])
    fdf_html["Features and Traits"] = "\n".join([
        "* **%s**: %s" % (
            key, desc
            )
        for key, desc in c.info.iteritems()
        ])

    fdf_text["Feat+Traits"] = "\n\n".join([
        "* %s: %s" % (
            key, ability['description'] % ability
            )
        for key, ability in c.abilities.iteritems()
        ])
    fdf_html["Feat+Traits"] = "\n".join([
        "* **%s**: %s" % (
            key, ability['description'] % ability
            )
        for key, ability in c.abilities.iteritems()
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
            if "value" in armor:
                desc = [
                    "-",
                    armor['name'],
                    "AC: %d" % armor["value"]
                    ]
            if "bonus" in armor:
                desc = [
                    "-",
                    armor['name'],
                    "AC: %s" % filter_bonus(armor["bonus"])
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
    fdf_text["Equipment"] = "\n".join([
        "\n".join(equipment[i])
        for i in range(0, len(equipment), 2)
        ])
    fdf_text["Equipment2"] = "\n".join([
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
        if old in fdf_text:
            fdf_text[new] = fdf_text[old]

    for field in fdf_html:
        fdf_html[field] = """<?xml version="1.0"?><body>%s</body>""" % (
            markdown.markdown(fdf_html[field]))

    pdf_file = os.path.join('app', 'static', 'pdf', 'Current Standard v1.4.pdf')

    filename = re.sub(ur'[^\w\d]+', '_', c['name'])
    filename = re.sub(ur'^_+|_+$', '', filename)
    filename +=  '.pdf'
    return send_file(
        fill_pdf(
            pdf_file,
            fdf_text, fdf_html,
            '/tmp/%s.fdf' % c['name'],
            debug=request.args.get('debug', False)
            ),
        mimetype="application/pdf",
        as_attachment=False if request.args.get('debug', False) else True,
        attachment_filename=filename
        )

@character.route('/edit/<int:character_id>', methods=['GET', 'POST'])
def edit(character_id):
    character_data = get_character_data()
    datamapper = get_datamapper()

    c = datamapper.character.getById(character_id)
    if c['user_id'] != request.user['id'] \
            and not any([role in request.user.role for role in ['admin', 'dm']]):
        abort(403)

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'character.show',
                character_id=character_id
                ))

        if request.form.get("button", "save") == "save":
            c.updateFromPost(request.form)
            c = datamapper.character.save(c)
            return redirect(url_for(
                'character.show',
                character_id=c.id
                ))

    return render_template(
        'character/edit.html',
        character=c
        )

@character.route('/level-up/<int:character_id>')
@character.route('/level-up/<string:level>/<int:character_id>', methods=['GET', 'POST'])
def level_up(character_id, level=None):
    character_data = get_character_data()
    datamapper = get_datamapper()

    c = datamapper.character.getById(character_id)
    if c['user_id'] != request.user['id'] \
            and not any([role in request.user.role for role in ['admin', 'dm']]):
        abort(403)

    phases = JsonObject(
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

    phase_names = []
    for p, phase in phases.iteritems():
        if p in c.creation:
            continue
        cond = phase.get('conditions', {})
        for check in cond:
            if check == 'level':
                if c.level < cond[check]:
                    p = None
            elif check == 'creation':
                if cond[check] not in c.creation:
                    p = None
            elif not all(checked in (c[check] or []) for checked in cond[check]):
                p = None
        if p is not None:
            phase_names.append(p)
    phase_names = sorted(
        phase_names,
        key=lambda p: phases[p].get('conditions', {}).get('level', 99)
        )

    if level not in phase_names:
        if not len(phase_names):
            return redirect(url_for(
                'character.show',
                character_id=character_id
                ))
        return redirect(url_for(
            'character.level_up',
            character_id=character_id,
            level=phase_names[0]
            ))

    phase = phases[level]

    def assigning(key, val):
        if isinstance(val, unicode) and '.' in val:
            if key.endswith('_formula'):
                return [
                    (key, val),
                    (
                        key.replace('_formula', ''),
                        datamapper.machine.resolveMath(c, val)
                        )
                    ]
            if val.startswith('character'):
                return [
                    (key, c.getPath(val) or val)
                    ]
            if any(datamapper.machine.items.getPath(v) for v in val.split(',')):
                return [(key, [
                    item
                    for v in val.split(',')
                    for item in datamapper.machine.items.getPath(v) or val
                    ])]
            return [
                (key, val)
                ]
        if isinstance(val, dict):
            return [(
                key,
                dict([
                    pair
                    for sub_key, sub_val in val.iteritems()
                    for pair in assigning(sub_key, sub_val)
                    ])
                )]
        if isinstance(val, list):
            return [(
                key,
                [
                    pair[1]
                    for v in val
                    for pair in assigning(key, v)
                    ]
                )]
        return [(key, val)]

    phase = dict([
        pair
        for key, val in phase.iteritems()
        for pair in assigning(key, val)
        ])
    #return jsonify(phase)

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'character.show',
                character_id=character_id
                ))

        if request.form.get("button", "save") == "save":

            c.updateFromPost(request.form)
            c.creation.append(level)
            c = datamapper.character.save(c)

            return redirect(url_for(
                'character.level_up',
                character_id=c.id
                ))

    return render_template(
        phase.get('template', 'character/level-up.html'),
        level=level,
        phase=phase,
        character=c
        )

@character.route('/del/<int:character_id>')
def delete(character_id):
    datamapper = get_datamapper()

    c = datamapper.character.getById(character_id)
    if c['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)

    datamapper.character.delete(c)

    return redirect(url_for(
        'character.overview'
        ))

@character.route('/new', methods=['GET', 'POST'])
@character.route('/new/<int:character_id>', methods=['GET', 'POST'])
def new(character_id=None):
    character_data = get_character_data()
    datamapper = get_datamapper()

    c = CharacterObject({
        'user_id': request.user.id
        })

    if character_id:
        old = datamapper.character.getById(character_id)
        if old.user_id != request.user.id \
                and not any([role in request.user.role for role in ['admin', 'dm']]):
            abort(403)
        c.id = old.id
        c.user_id = old.user_id
        c.xp = old.xp

    last = False
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

        for step in ["race", "class", "background"]:
            if step in c.creation:
                data, sub = find_caracter_field(
                    character_data, step, c[step]
                    )
                c.update(data.get('config', {}))
                if sub:
                    c.update(sub.get('config', {}))

        completed = all(
            step in c.creation
            for step in ["race", "class", "background", "core", "stats"]
            )

        if completed and request.form.get("button", "save") == "save":
            c = datamapper.character.save(c)
            return redirect(url_for(
                'character.level_up',
                character_id=c.id
                ))

    return render_template(
        'character/create.html',
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


    c = CharacterObject({
        'user_id': request.user['id']
        })
    if character_id:
        c = datamapper.character.getById(character_id)
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
            c = datamapper.character.save(c)
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


@character.route('/copy/<int:character_id>')
@character.route('/copy/<int:character_id>/<int:target_id>')
def copy(character_id, target_id=None):
    config = get_config()
    datamapper = get_datamapper()

    c = datamapper.character.getById(character_id)
    c = c.clone()
    c.user_id = request.user.id
    if target_id != None:
        target = datamapper.character.getById(target_id)
        c.id = target.id
        c.user_id = target.user_id
    else:
        c.name += " (copy)"

    c = datamapper.character.save(c)

    return redirect(url_for(
        'character.edit',
        character_id=c.id
        ))

@character.route('/xp/<int:character_id>/<int:xp>')
def xp(character_id, xp):
    config = get_config()
    datamapper = get_datamapper()

    if not any([role in request.user.role for role in ['admin', 'dm']]):
        abort(403)

    c = datamapper.character.getById(character_id)
    c.xp += xp

    c = datamapper.character.update(c)

    return redirect(url_for(
        'character.show',
        character_id=character_id
        ))
