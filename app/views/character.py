# -*- coding: utf-8 -*-
from flask import (
    request, abort, render_template, send_file, jsonify, redirect,
    url_for
    )
import os
import sys
import re
import markdown

from .baseapi import BaseApiBlueprint
from ..config import get_character_data
from ..filters import filter_bonus, filter_distance, filter_damage, filter_unique
from . import fill_pdf

class CharacterBlueprint(BaseApiBlueprint):

    def __init__(self, name, *args, **kwargs):
        super(CharacterBlueprint, self).__init__(name, *args, **kwargs)

        self.add_url_rule(
            '/races/api', 'get_races',
            self.get_races, methods=['GET'])
        self.add_url_rule(
            '/classes/api', 'get_classes',
            self.get_classes, methods=['GET'])
        self.add_url_rule(
            '/backgrounds/api', 'get_backgrounds',
            self.get_backgrounds, methods=['GET'])
        self.add_url_rule(
            '/download/<int:obj_id>', 'download',
            self.download)
        self.add_url_rule(
            '/xp/<int:obj_id>/<int:xp>', 'xp',
            self.xp, methods=['GET', 'POST'])
        self.add_url_rule(
            '/reset/<int:obj_id>', 'reset',
            self.reset, methods=['GET', 'POST'])

    @property
    def datamapper(self):
        return self.basemapper.character

    @property
    def armormapper(self):
        return self.basemapper.armor

    @property
    def weaponmapper(self):
        return self.basemapper.weapon

    @property
    def itemmapper(self):
        return self.basemapper.items

    @property
    def usermapper(self):
        return self.basemapper.user

    @property
    def character_data(self):
        if '_character_data' not in self.__dict__:
            self._character_data = get_character_data(True)
        return self._character_data

    def _exposeAttributes(self, obj):
        result = obj.config

        if not self.checkRole(['dm']) \
                and obj.user_id != request.user.id:
            fields = [
                'id', 'name', 'gender', 'race', 'class', 'alignment',
                'background', 'level', 'xp', 'xp_progress',
                'user_id', 'xp_level', 'challenge', 'spell'
                ]
            result = dict([
                (key, obj[key])
                for key in fields
                ])
        return result

    def _mutableAttributes(self, update, obj=None):
        if self.checkRole(['dm']):
            return update

        immutable = [
            'id', 'user_id', 'xp',
            ]

        if obj is not None:
            immutable.extend([
                'race', 'class', 'background', 'alignment',
                'hit_dice', 'speed', 'size',
                ])
            if not len(obj.level_upCreation):
                immutable.extend([
                    'statistics', 'abilities', 'info', 'computed',
                    'creation', 'level_up', 'equipment', 'spell',
                    'languages', 'proficiencies', 'proficiency',
                    'saving_throws',
                    ])

        update = dict(
            (key, value)
            for key, value in update.items()
            if key not in immutable
            )
        return update

    def find_caracter_field(self, field, value):
        for data in self.character_data[field]:
            for sub in data.get('sub', []):
                if sub['name'] == value:
                    return data, sub
            if data['name'] == value:
                return data, None

    def get_races(self):
        def _race_attribs(race):
            return dict(
                (attrib, race.get(attrib))
                for attrib in [
                    'name', 'sub', 'config', 'description'
                    ]
                )
        races = [
            _race_attribs(race)
            for race in self.character_data['race']
            ]
        return jsonify(races)


    def get_classes(self):
        return jsonify(self.character_data['class'])

    def get_backgrounds(self):
        return jsonify(self.character_data['background'])

    def download(self, obj_id):
        items = self.itemmapper

        c = self.datamapper.getById(obj_id)
        if c.user_id != request.user.id \
                and not self.checkRole(['admin', 'dm']):
            abort(403)
        user = self.usermapper.getById(c.user_id)

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
            "Appearance": c.appearance,
            "PersonalityTraits ": c.personalityTraits,
            "Ideals": c.personalityIdeals,
            "Bonds": c.personalityBonds,
            "Flaws": c.personalityFlaws
            }
        fdf_html = {
            "Appearance": c.appearance or "",
            "Background": c.backstory or "",
            "PersonalityTraits ": c.personalityTraits,
            "Ideals": c.personalityIdeals,
            "Bonds": c.personalityBonds,
            "Flaws": c.personalityFlaws
            }

        if c.spellSafe_dc:
            fdf_text.update({
                "SpellSaveDC 2": c.spellSafe_dc,
                "SpellAtkBonus 2": filter_bonus(c.spellAttack_modifier),
                "Spellcasting Class 2": c.Class,
                "Total Prepared Spells": c.spellMax_prepared or '',
                #"AttacksSpellcasting": "",
                })
        if c.spellSlots:
            fdf_spell_slots = {
                "level_1": "SlotsTotal 19",
                "level_2": "SlotsTotal 20",
                "level_3": "SlotsTotal 21",
                "level_4": "SlotsTotal 22",
                "level_5": "SlotsTotal 23",
                "level_6": "SlotsTotal 24",
                "level_7": "SlotsTotal 25",
                "level_8": "SlotsTotal 26",
                "level_9": "SlotsTotal 27"
                }
            for level, slots in c.spellSlots.items():
                fdf_text[ fdf_spell_slots[level] ] = slots

        if c.spellList:
            fdf_spell_lists = {
                "cantrip": ["1014", "1015", "1016", "1017", "1018", "1019", "1020", "1021"],
                "level_1": ["1022", "1023", "1024", "1025", "1026", "1027", "1028", "1029", "1030", "1031", "1032", "1033"],
                "level_2": ["1046", "1034", "1035", "1036", "1037", "1038", "1039", "1040", "1041", "1042", "1043", "1044", "1045"],
                "level_3": ["1048", "1047", "1049", "1050", "1051", "1052", "1053", "1054", "1055", "1056", "1057", "1058", "1059"],
                "level_4": ["1061", "1060", "1062", "1063", "1064", "1065", "1066", "1067", "1068", "1069", "1070", "1071", "1072"],
                "level_5": ["1074", "1073", "1075", "1076", "1077", "1078", "1079", "1080", "1081"],
                "level_6": ["1083", "1082", "1084", "1085", "1086", "1087", "1088", "1089", "1090"],
                "level_7": ["1092", "1091", "1093", "1094", "1095", "1096", "1097", "1098", "1099"],
                "level_8": ["10101", "10100", "10102", "10103", "10104", "10105", "10106"],
                "level_9": ["10108", "10107", "10109", "101010", "101011", "101012", "101013"]
                }
            for level, spells in c.spellLevel.items():
                fdf_spell_list = fdf_spell_lists[ level ]
                for i, spell in enumerate(spells):
                    fdf_text[ "Spells %s" % fdf_spell_list[i] ] = spell['name']

        for stat in items.statistics:
            stat_prefix = stat['code'][:3].upper()
            fdf_text[stat_prefix] = c.statisticsBase[stat['code']]
            fdf_text[stat_prefix + 'mod'] = filter_bonus(c.statisticsModifiers[stat['code']])
            fdf_text['SavingThrow ' + stat['label']] = filter_bonus(c.saving_throws[stat['code']])
            if stat['code'] in c.proficienciesAdvantages:
                fdf_text['SavingThrow ' + stat['label']] += 'A'
            if stat['code'] in c.proficienciesSaving_throws:
                fdf_text['ST ' + stat['label']] = True

        for skill in items.skills:
            fdf_text[skill['label']] = filter_bonus(c.skills[skill['code']])
            if skill['code'] in c.proficienciesSkills:
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
            if coin not in c.wealth:
                continue
            fdf_text[coin.upper()] = c.wealth[coin]

        proficiencies = {}
        if c.languages:
            proficiencies["Languages"] = []
            for prof in c.languages:
                lang = items.itemByNameOrCode(prof, 'languages')
                proficiencies["Languages"].append(
                    lang['label'] if lang else prof
                    )

        if c.proficienciesArmor:
            proficiencies["Armor"] = []
            for prof in c.proficienciesArmor:
                label = prof
                armor = items.itemByNameOrCode(prof, 'armor_types')
                if armor is not None:
                    label = armor['label']
                else:
                    objs = self.armormapper.getMultiple(
                        'name COLLATE nocase = :name',
                        {'name': prof}
                        )
                    if objs:
                        label = objs[0].name
                proficiencies["Armor"].append(label)

        if c.proficienciesWeapons:
            proficiencies["Weapons"] = []
            for prof in c.proficienciesWeapons:
                label = prof
                weapon = items.itemByNameOrCode(prof, 'weapon_types')
                if weapon is not None:
                    label = weapon['label']
                else:
                    objs = self.weaponmapper.getMultiple(
                        'name COLLATE nocase = :name',
                        {'name': prof}
                        )
                    if objs:
                        label = objs[0].name
                proficiencies["Weapons"].append(label)

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
        fdf_html["ProficienciesLang"] = "\n\n".join([
            "**%s:**\n    %s" % (
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
            for count, weapon in filter_unique(c.weapons):
                desc = [
                    "-",
                    "%s x %s" % (count, weapon['name']) \
                        if count > 1 \
                        else weapon['name'],
                    filter_damage(weapon['damage']),
                    ", **Hit:** %s" % filter_bonus(weapon['bonus'])
                    ]
                if 'ranged' in weapon['type']:
                    desc.append(
                        " (%s)" % filter_distance(weapon['range'])
                        )
                equipment[-1].append(" ".join(desc))

                desc = []
                for prop in weapon.get("property", []):
                    tag = items.itemByNameOrCode(
                        prop, 'weapon_properties'
                        )
                    tag = tag['short']
                    if prop == 'thrown':
                        tag += " (%s)" % filter_distance(weapon['range'])
                    if prop == 'versatile':
                        tag += " (%s)" % filter_damage(weapon['versatile']),
                    desc.append(tag)
                if len(desc):
                    equipment[-1].append("  " + ", ".join(desc))


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
                if "requirements" in armor \
                        and "strength" in armor["requirements"]:
                    desc.extend([
                        "(Str: %s)" % armor["requirements"]["strength"]
                        ])
                if armor.get('disadvantage', False):
                    desc.extend([
                        "(Stealth: disadv.)"
                        ])
                equipment[-1].append(" ".join(desc))

        for toolType, tools in c.items.items():
            if not len(tools):
                continue
            _type = items.itemByNameOrCode(
                toolType, 'tool_types'
                )
            equipment.append([_type['label'] + ":"])

            for count, item in filter_unique(tools):
                label = item['label'] \
                    if isinstance(item, dict) \
                    else item
                desc = [
                    "-",
                    "%d x %s" % (count, label) \
                        if count > 1 \
                        else label
                    ]
                equipment[-1].append(" ".join(desc))

        equipment = sorted(
            equipment,
            key=lambda lines: len(lines),
            reverse=True
            )
        key = ["Equipment", "Equipment2"]
        fdf_text["Equipment"] = fdf_html["Equipment"] = "\n".join([
            "\n".join(equipment[i])
            for i in range(0, len(equipment), 2)
            ])

        fdf_text["Equipment2"] = fdf_html["Equipment2"] = "\n".join([
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
                markdown.markdown(fdf_html[field])
                )

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

    def xp(self, obj_id, xp):
        if not self.checkRole(['admin', 'dm']):
            abort(403)

        character = self.datamapper.getById(obj_id)
        character.xp += xp
        character.compute()

        character = self.datamapper.update(character)

        return redirect(url_for(
            'character.show',
            obj_id=obj_id
            ))

    def reset(self, obj_id):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        keeping = [
            'user_id', 'class', 'race', 'background', 'xp', 'name',
            'personality', 'gender', 'appearance', 'alignment',
            'backstory'
            ]

        character = self.datamapper.getById(obj_id)
        reset = self.datamapper.create(dict([
            (keep, character[keep])
            for keep in keeping
            ]))
        reset.id = obj_id
        reset.user_id = character.user_id
        reset.compute()

        character = self.datamapper.update(reset)

        return redirect(url_for(
            'character.edit',
            obj_id=obj_id
            ))

    def _api_list_filter(self, objects):
        extended_ids = self.datamapper.getExtendedIds(request.user.id)

        objects = [
            obj
            for obj in objects
            if obj.user_id == request.user.id \
                or obj.id in extended_ids \
                or self.checkRole(['admin', 'dm'])
            ]

        return objects

    def _api_get_filter(self, obj):
        if obj.user_id != request.user.id \
                and not self.checkRole(['admin', 'dm']):

            extended_ids = self.datamapper.getExtendedIds(request.user.id)
            if obj_id not in extended_ids:
                abort(403)

        return obj

    def _api_post_filter(self, obj):
        if not self.checkRole(['player', 'dm']):
            print request.user.config
            abort(403, "Invalid role")

        obj.user_id = request.user.id

        return obj

    def _api_patch_filter(self, obj):
        if not self.checkRole(['player', 'dm']):
            abort(403, "Invalid role")

        if obj.user_id != request.user.id \
                and not self.checkRole(['admin', 'dm']):
            abort(403, "Not owned")

        obj.creation += obj.level_upCreation
        obj.compute()

        return obj

    def _api_delete_filter(self, obj):
        if not self.checkRole(['player', 'dm']):
            abort(403, "Invalid role")

        if obj.user_id != request.user.id \
                and not self.checkRole(['admin', 'dm']):
            abort(403, "Not owned")

        return obj

def get_blueprint(basemapper):
    return CharacterBlueprint(
        'character',
        __name__,
        basemapper=basemapper,
        template_folder='templates'
        )
