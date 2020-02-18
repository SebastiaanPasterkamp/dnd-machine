# -*- coding: utf-8 -*-
from flask import (
    request, abort, send_file, jsonify, redirect, url_for
    )
import os
import re
import markdown

from views.baseapi import BaseApiBlueprint, BaseApiCallback
from config import get_character_data
from errors import ApiException
from filters import filter_bonus, filter_distance, filter_unique
from .__init__ import fill_pdf

class CharacterBlueprint(BaseApiBlueprint):

    def __init__(self, name, *args, **kwargs):
        super(CharacterBlueprint, self).__init__(name, *args, **kwargs)

        self.add_url_rule(
            '/api/<int:obj_id>', 'api_post',
            self.api_post, methods=['POST'])
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
            '/xp/<int:obj_id>/<signed_int:xp>', 'xp',
            self.xp, methods=['GET', 'POST'])
        self.add_url_rule(
            '/reset/<int:obj_id>', 'reset',
            self.newObj, methods=['GET'])

    @property
    def datamapper(self):
        return self.basemapper.character

    @property
    def leaguelogmapper(self):
        return self.basemapper.adventureleague

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

    def _exposeAttributes(self, obj):
        if obj.user_id == request.user.id \
                or self.checkRole(['admin', 'dm']):
            return obj.config

        protected = set([
            'creation', 'background', 'personality', 'computed',
            'wealth', 'level_up',
            ])

        return dict(
            (key, value)
            for key, value in obj.config.items()
            if key not in protected
            )

    def _mutableAttributes(self, update, obj=None):
        if self.checkRole(['admin', 'dm']):
            return update

        immutable = set([
            'user_id', 'xp',
            ])

        return dict(
            (key, obj[key] if obj and key in immutable else value)
            for key, value in update.items()
            if not obj or key not in immutable
            )

    def get_character_data(self, field):
        options = self.basemapper.options

        def inlineIncludes(data):
            if isinstance(data, dict):
                if 'include' in data:
                    include = options.getById(data['include'])
                    if include is not None:
                        include = include.clone()
                        include.update(data)
                        data.update(include)
                    del data['include']
                for key, value in list(data.items()):
                    inlineIncludes(value)
            if isinstance(data, list):
                for value in data:
                    inlineIncludes(value)

        items = []
        for obj in self.basemapper[field].getMultiple():
            item = obj.clone()
            item['uuid'] = "%s-%d" % (field, obj.id)
            if 'phases' in item:
                del item['phases']
            inlineIncludes(item)
            items.append(item)

        return jsonify({
            'type': 'choice',
            'options': items,
            })

    def get_races(self):
        return self.get_character_data('race')

    def get_classes(self):
        return self.get_character_data('klass')

    def get_backgrounds(self):
        return self.get_character_data('background')

    @BaseApiCallback('new')
    @BaseApiCallback('edit')
    @BaseApiCallback('api_copy')
    @BaseApiCallback('api_post')
    @BaseApiCallback('api_patch')
    @BaseApiCallback('api_delete')
    def playerOrDmOnly(self, *args, **kwargs):
        if not self.checkRole(['dm', 'player']):
            raise ApiException(403, "Insufficient privileges")

    @BaseApiCallback('show')
    @BaseApiCallback('reset')
    def pageAdminDmOrOwned(self, obj_id):
        if self.checkRole(['admin', 'dm']):
            return
        extended_ids =  self.datamapper.getExtendedIds(
            request.user.id
            )
        if obj_id not in extended_ids:
            abort(403)

    @BaseApiCallback('api_post.data')
    def keepFields(self, data, obj):
        if obj is None:
            return
        if obj.adventure_league:
            logs = self.leaguelogmapper.getByCharacterId(obj.id)
            for log in logs:
                log = obj.unconsumeAdventureLeague(log)
                self.leaguelogmapper.save(log)
            return
        keeping = [
            'xp',
            ]

        data.update(dict(
            (keep, obj[keep])
            for keep in keeping
            if keep in obj
            ))

    @BaseApiCallback('api_post.object')
    @BaseApiCallback('api_copy.object')
    def setOwner(self, obj):
        obj.user_id = request.user.id

    @BaseApiCallback('raw')
    def adminOnly(self, *args, **kwargs):
        if not self.checkRole(['admin']):
            raise ApiException(403, "Insufficient privileges")

    @BaseApiCallback('xp')
    def adminOrDmOnly(self, *args, **kwargs):
        if not self.checkRole(['admin', 'dm']):
            raise ApiException(403, "Insufficient privileges")

    @BaseApiCallback('api_delete.object')
    @BaseApiCallback('api_patch.original')
    @BaseApiCallback('api_patch.object')
    def adminDmOrOwned(self, obj):
        if obj.user_id != request.user.id \
                and not self.checkRole(['admin', 'dm']):
            raise ApiException(403, "Insufficient privileges")

    @BaseApiCallback('api_patch.object')
    def recordCreation(self, obj):
        obj.creation += obj.level_upCreation

    @BaseApiCallback('api_list.objects')
    def adminDmOrExtendedMultiple(self, objs):
        if self.checkRole(['admin', 'dm']):
            return
        extended_ids = self.datamapper.getExtendedIds(
            request.user.id
            )
        objs[:] = [
            obj
            for obj in objs
            if obj.user_id == request.user.id \
                or obj.id in extended_ids
            ]

    @BaseApiCallback('api_get.object')
    @BaseApiCallback('api_copy.original')
    @BaseApiCallback('download.object')
    def adminDmOrExtendedSingle(self, obj):
        if obj.user_id == request.user.id \
                or self.checkRole(['admin', 'dm']):
            obj.compute()
            return
        extended_ids =  self.datamapper.getExtendedIds(
            request.user.id
            )
        if obj.id not in extended_ids:
            raise ApiException(403, "Insufficient privileges")


    def download(self, obj_id):
        self.doCallback('download', obj_id)

        obj = self.datamapper.getById(obj_id)
        if obj is None:
            raise ApiException(404, "Character not found")
        self.doCallback(
            'download.object',
            obj,
            )

        user = self.usermapper.getById(obj.user_id)
        items = self.itemmapper
        machine = self.basemapper.machine

        def filter_damage(damage):
            return machine.diceNotation(
                damage['dice_size'],
                damage['dice_count'],
                damage.get('dice_bonus', 0)
                )

        fdf_txt = {
            "CharacterName": obj.name,
            "CharacterName 2": obj.name,
            "PlayerName": user.name or user.username,
            "HPMax": obj.hit_points,
            "AC": "%s / +%s" % (
                    obj.armor_class,
                    obj.armor_class_bonus
                    ) \
                if obj.armor_class_bonus \
                else "%s" %  obj.armor_class,
            "HD": "%dd%d" % (obj.level, obj.hit_dice),
            "XP": ' + '.join([_f for _f in [
                '%d XP' % obj.xp if obj.xp else None,
                '%d ACP' % obj.adventure_checkpoints
                    if obj.adventure_checkpoints else None,
                    ] if _f]),
            "Race ": obj.race,
            "ClassLevel": "%s %d" % (obj.Class, obj.level),
            "Speed": obj.speed,
            "Background": obj.background,
            "Alignment": items.itemByNameOrCode(
                obj.alignment,
                'alignments',
                {'label': obj.alignment}
                )['label'],
            "ProBonus": filter_bonus(obj.proficiency),
            "Initiative": filter_bonus(obj.initiative_bonus),
            "Passive": filter_bonus(obj.passive_perception),
            "Age": obj.age,
            "Height": obj.height,
            "Weight": obj.weight,
            "Current Weight": obj.weight,
            "Appearance": obj.appearance,
            "PersonalityTraits ": obj.personalityTraits,
            "Ideals": obj.personalityIdeals,
            "Bonds": obj.personalityBonds,
            "Flaws": obj.personalityFlaws
            }
        fdf_html = {
            "Appearance": obj.appearance or "",
            "Backstory": obj.backstory or "",
            "PersonalityTraits ": obj.personalityTraits,
            "Ideals": obj.personalityIdeals,
            "Bonds": obj.personalityBonds,
            "Flaws": obj.personalityFlaws
            }

        if obj.spellSafe_dc:
            fdf_txt.update({
                "SpellSaveDC  2": obj.spellSafe_dc,
                "SpellAtkBonus 2": filter_bonus(obj.spellAttack_modifier),
                "Spellcasting Class 2": obj.Class,
                "Total Prepared Spells": obj.spellMax_prepared or '',
                #"AttacksSpellcasting": "",
                })
        if obj.spellSlots:
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
            for level, slots in list(obj.spellSlots.items()):
                fdf_txt[ fdf_spell_slots[level] ] = slots

        if obj.spellList:
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
            for level, spells in list(obj.spellLevel.items()):
                fdf_spell_list = fdf_spell_lists[ level ]
                for i, spell in enumerate(spells):
                    fdf_txt[ "Spells %s" % fdf_spell_list[i] ] = spell['name']

        for stat in items.statistics:
            stat_prefix = stat['code'][:3].upper()
            fdf_txt[stat_prefix] = obj.statisticsBase[stat['code']]
            fdf_txt[stat_prefix + 'mod'] = filter_bonus(obj.statisticsModifiers[stat['code']])
            fdf_txt['SavingThrow ' + stat['label']] = filter_bonus(obj.saving_throws[stat['code']])
            if stat['code'] in obj.proficienciesAdvantages:
                fdf_txt['SavingThrow ' + stat['label']] += 'A'
            if stat['code'] in obj.proficienciesSaving_throws:
                fdf_txt['ST ' + stat['label']] = True

        for skill in items.skills:
            fdf_txt[skill['label']] = filter_bonus(obj.skills[skill['code']])
            if skill['code'] in obj.proficienciesSkills:
                fdf_txt['ChBx ' + skill['label']] = True

        i = 0
        for count, weapon in filter_unique(obj.weapons):
            fdf_txt['Wpn Name %d' % (i+1)] = \
                "%d x %s" % (count, weapon['name']) if count > 1 \
                else weapon['name']
            fdf_txt['Wpn%d Damage' % (i+1)] = "%s %s" % (
                weapon['damage'].get('notation', ''),
                weapon['damage'].get('type_short', '')
                )
            fdf_txt['Wpn%d AtkBonus' % (i+1)] = filter_bonus(weapon.get('bonus', 0))
            i += 1

        for coin in ['cp', 'sp', 'ep', 'gp', 'pp']:
            if coin not in obj.wealth:
                continue
            fdf_txt[coin.upper()] = obj.wealth[coin]

        proficiencies = {}
        if obj.languages:
            proficiencies["Languages"] = []
            for prof in obj.languages:
                lang = items.itemByNameOrCode(prof, 'languages')
                proficiencies["Languages"].append(
                    lang['label'] if lang else prof
                    )

        if obj.proficienciesArmor:
            proficiencies["Armor"] = []
            for prof in obj.proficienciesArmor:
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

        if obj.proficienciesWeapons:
            proficiencies["Weapons"] = []
            for prof in obj.proficienciesWeapons:
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

        if obj.proficienciesTools:
            proficiencies["Tools"] = []
            for prof in obj.proficienciesTools:
                if prof is None:
                    continue
                proficiencies["Tools"].append(prof)
        fdf_txt["ProficienciesLang"] = "\n\n".join([
            "%s:\n    %s" % (
                key, ", ".join(lines)
                )
            for key, lines in proficiencies.items()
            ])
        fdf_html["ProficienciesLang"] = "\n\n".join([
            "**%s:**\n    %s" % (
                key, ", ".join(lines)
                )
            for key, lines in proficiencies.items()
            ])

        fdf_txt["Features and Traits"] = "\n\n".join([
            "* %s: %s" % (
                key, desc
                )
            for key, desc in obj.info.items()
            ])
        fdf_html["Features and Traits"] = "\n".join([
            "* **%s**: %s" % (
                key, desc
                )
            for key, desc in obj.info.items()
            ])

        fdf_txt["Feat+Traits"] = "\n\n".join([
            "* %s: %s" % (
                key, ability['description'] % ability
                )
            for key, ability in obj.abilities.items()
            ])
        fdf_html["Feat+Traits"] = "\n".join([
            "* **%s**: %s" % (
                key, ability['description'] % ability
                )
            for key, ability in obj.abilities.items()
            ])

        equipment = []
        if obj.weapons:
            equipment.append(["Weapons:\n"])
            for count, weapon in filter_unique(obj.weapons):
                desc = [
                    "*",
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
                    tag = tag['label']
                    if prop == 'thrown':
                        tag += " (%s)" % filter_distance(weapon['range'])
                    if prop == 'versatile':
                        tag += " (%s)" % filter_damage(weapon['versatile'])
                    desc.append(tag)
                if len(desc):
                    equipment[-1].append("  " + ", ".join(desc))

        if obj.armor:
            equipment.append(["Armor:\n"])
            for armor in obj.armor:
                if "value" in armor:
                    desc = [
                        "*",
                        armor['name'],
                        "AC: %d" % armor["value"]
                        ]
                if "bonus" in armor:
                    desc = [
                        "*",
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

        for toolType, tools in list(obj.items.items()):
            if not len(tools):
                continue
            _type = items.itemByNameOrCode(
                toolType, 'tool_types'
                )

            equipment.append([_type['label'] + ":\n"])
            for count, item in filter_unique(tools):
                label = item['label'] \
                    if isinstance(item, dict) \
                    else item
                desc = [
                    "*",
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
        keys = ["Equipment", "Equipment2"]
        for key in keys:
            fdf_txt[key] = []
        for equip in sorted(equipment, key=lambda equip: -len(equip)):
            key = min(keys, key=lambda key: len(fdf_txt[key]))
            fdf_txt[key].append("")
            fdf_txt[key].extend(equip)
        for key in keys:
            fdf_txt[key] = fdf_html[key] = "\n".join(fdf_txt[key])

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
        for old, new in fdf_translation.items():
            if old in fdf_txt:
                fdf_txt[new] = fdf_txt[old]

        for field in fdf_html:
            fdf_html[field] = markdown.markdown(fdf_html[field])

        pdf_file = os.path.join('app', 'static', 'pdf', 'Current Standard v1.4.pdf')

        filename = re.sub(r'[^\w\d]+', '_', obj.name)
        filename = re.sub(r'^_+|_+$', '', filename)
        filename +=  '.pdf'
        return send_file(
            fill_pdf(
                pdf_file,
                fdf_txt,
                fdf_html,
                '/tmp/%s.xfdf' % obj.name,
                debug=request.args.get('debug', False)
                ),
            mimetype="application/pdf",
            as_attachment=False if request.args.get('debug', False) else True,
            attachment_filename=filename
            )

    @BaseApiCallback('api_copy.object')
    def changeName(self, obj, *args, **kwargs):
        obj.name += " (Copy)"

    def xp(self, obj_id, xp):
        self.doCallback('xp', obj_id, xp)

        obj = self.datamapper.getById(obj_id)
        self.doCallback('xp.object', obj, xp)

        obj.xp += xp
        obj.compute()

        obj = self.datamapper.update(obj)

        return redirect(url_for(
            'character.show',
            obj_id=obj_id
            ))


def get_blueprint(basemapper, config):
    return '/character', CharacterBlueprint(
        'character',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
