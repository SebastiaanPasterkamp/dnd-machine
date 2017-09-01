from flask import g
import json
import sqlite3
from passlib.hash import pbkdf2_sha256 as password
import parser
import re

from ..config import get_config, get_item_data
from .character import CharacterMapper

class DndMachine(object):
    def __init__(self, config):
        self.xp_at_level = config['xp_at_level']
        self.challenge_rating = config["challenge_rating"]
        self.monster_scaling = config["monster_scaling"]
        self.size_hit_dice = config["size_hit_dice"]
        self.attack_modifier = config["attack_modifier"]
        self.monster_types = config["monster_types"]

    def resolveMath(self, obj, formula):
        replace = {}
        for m in re.finditer(ur'[a-z.]+', formula):
            replace[m.group(0)] = obj.getPath(m.group(0))
        for var, val in replace.iteritems():
            formula = formula.replace(var, str(val))
        code = parser.expr(formula).compile()
        return eval(code)

    def findByName(self, name, items, default=None):
        matches = [
            item
            for item in items
            if item['name'] == name
            ]
        return matches[0] if matches else default

    def diceAverage(self, size, number=1, bonus=0):
        return int(number * ((size+1)/2.0) + bonus)

    def diceCritical(self, size, number=1, bonus=0):
        return int(number * size + number * ((size+1)/2.0) + bonus)

    def diceNotation(self, size, number, bonus=0):
        notation = []
        if number:
            notation.append("%dd%d" % (number, size))
        if bonus:
            notation.append("%d" % bonus)
        return '+'.join(notation)

    def xpAtLevel(self, level):
        return self.xp_at_level[str(level)]

    def challengeByLevel(self, level, formula=False):
        """Returns the Challenge Rating in XP by level
        use formula=True to use a mathematical approach,
        use formula=False to use a lookup table"""

        challenge = self.challenge_rating['scale']["1"]
        if formula:
            challenge = [
                self.challenge_rating['linear'] * i * level \
                    + self.challenge_rating['power'] * i * level**2 \
                    + self.challenge_rating['offset'] * i
                for i in range(len(self.challenge_rating['ratings']))
                ]
            return dict(zip(
            ['easy', 'medium', 'hard', 'deadly'],
            challenge
            ))
        elif str(level) in self.challenge_rating['scale']:
            challenge = self.challenge_rating['scale'][str(level)]

        return dict(zip(
            self.challenge_rating['ratings'],
            challenge
            ))

    def monsterStatByChallengeRating(self, challenge_rating, stat=None):
        data = min(
            self.monster_scaling,
            key=lambda data: abs(data['challenge'] - challenge_rating)
            )
        if stat is not None:
            return data.get(stat, None)
        return data

    def monsterChallengeRatingByStat(self, stat, value, target=None):
        indexes = []
        for index in range(len(self.monster_scaling)):
            data = self.monster_scaling[index]
            if data[stat]['min'] <= value <= data[stat]['max']:
                indexes.append(index)
        if not indexes:
            return 0, 0
        if target is None:
            index = indexes[0]
        else:
            index = min(indexes, key=lambda i: abs(i - target))
        data = self.monster_scaling[index]
        return data["challenge"], index

    def computeCharacterStatistics(self, character):
        items = get_item_data()

        for stat in items["statistics"]:
            stat = stat["name"]
            character["stats"][stat] = character["base_stats"][stat] \
                + character["stats_bonus"][stat]
            character["modifiers"][stat] = int(
                (character["stats"][stat] - 10) / 2
                )

        for skill in items["skills"]:
            stat, skill = skill["stat"], skill["name"]
            character["skills"][skill] = character["stats"][stat]
            if skill in character["proficiencies"]["skills"]:
                character["skills"][skill] += character["proficiency"]

        for path, compute in character["computed"].iteritems():
            value = self.resolveMath(
                character, compute.get("formula", ""))
            for bonus in compute.get('bonus', []):
                value += resolveMath(character, bonus)
            character[path] = value

        cr = self.challengeByLevel(character['level'])
        for challenge, rating in cr.iteritems():
            character[challenge] = rating

        character['xp_level'] = self.xpAtLevel(character['level'])
        character['xp_next_level'] = \
            self.xpAtLevel(character['level'] + 1)

        return character

    def computeMonsterStatistics(self, monster):
        for stat, value in monster["stats"].iteritems():
            monster["modifiers"][stat] = (value - 10) / 2

        monster_size = self.findByName(
            monster["size"], self.size_hit_dice, {'dice_size': 4})
        monster["hit_points"] = self.diceAverage(
                monster_size['dice_size'],
                monster["level"],
                monster["modifiers"]["constitution"] * monster["level"]
                )

        monster["hit_points_notation"] = self.diceNotation(
            monster_size['dice_size'],
            monster["level"],
            monster["modifiers"]["constitution"] * monster["level"]
            )

        monster["average_damage"] = 0
        monster["critical_damage"] = 0
        monster["attack_bonus"] = 0
        monster["spell_save_dc"] = 0

        monster["attacks"] = [
            attack
            for attack in monster["attacks"]
            if attack.get("name", "")
            ]
        primary_attack = monster["proficiency"]
        for attack in monster["attacks"]:
            attack_method = attack.get("method", "melee")

            attack["modifier"] = monster["modifiers"].get(
                self.attack_modifier.get(attack_method, "strength"), 0
                ) + primary_attack
            attack["bonus"] = attack["modifier"] \
                if attack_method in ["melee", "ranged"] \
                else 0
            attack["spell_save_dc"] = attack["modifier"] \
                if attack_method not in ["melee", "ranged"] \
                else 0

            attack["damage"] = [
                damage
                for damage in attack.get("damage", [])
                if any(damage.get(n, 0)
                       for n in ['dice_count', 'bonus']
                       )
                ]
            default_bonus = attack['modifier']
            for damage in attack["damage"]:
                damage["average"] = self.diceAverage(
                    damage["dice_size"],
                    damage["dice_count"],
                    default_bonus \
                            if default_bonus \
                            else damage.get('bonus', 0)
                    )
                damage["notation"] = self.diceNotation(
                    damage["dice_size"],
                    damage["dice_count"],
                    default_bonus \
                            if default_bonus \
                            else damage.get('bonus', 0)
                    )
                damage["critical"] = self.diceCritical(
                    damage["dice_size"],
                    damage["dice_count"],
                    default_bonus \
                            if default_bonus \
                            else damage.get('bonus', 0)
                    )
                # Primary attack gets stats modifier as bonus
                default_bonus = 0
            attack["average"] = sum([
                damage["average"]
                for damage in attack["damage"]
                ])
            attack["notation"] = ' + '.join([
                "%(notation)s %(type)s" % (damage)
                for damage in sorted(
                    attack["damage"],
                    key=lambda d: d["average"],
                    reverse=True
                    )
                ])
            attack["critical"] = sum([
                damage["critical"]
                for damage in attack["damage"]
                ]) + attack["modifier"]
            if attack["average"] > monster["average_damage"]:
                monster["average_damage"] = attack["average"]
                monster["attack_bonus"] = attack["bonus"]
                monster["critical_damage"] = attack["critical"]
                monster["spell_save_dc"] = attack["spell_save_dc"]

        monster["multiattack"] = [
            rotation
            for rotation in monster["multiattack"]
            if rotation.get("name", "")
            ]
        for multiattack in monster["multiattack"]:
            multiattack["average"] = sum([
                attack["average"]
                for attack_name in multiattack["sequence"]
                for attack in monster["attacks"]
                if attack["name"] == attack_name
                ])
            multiattack["critical"] = sum([
                attack["critical"]
                for attack_name in multiattack["sequence"]
                for attack in monster["attacks"]
                if attack["name"] == attack_name
                ])
            if multiattack["average"] > monster["average_damage"]:
                monster["average_damage"] = multiattack["average"]
                monster["critical_damage"] = multiattack["critical"]
                monster["attack_bonus"] = max([
                    attack["modifier"]
                    for attack_name in multiattack["sequence"]
                    for attack in monster["attacks"]
                    if attack["name"] == attack_name
                    ])
                monster["spell_save_dc"] = max([
                    attack["spell_save_dc"]
                    for attack_name in multiattack["sequence"]
                    for attack in monster["attacks"]
                    if attack["name"] == attack_name
                    ])

        monster.traits = [
            trait
            for trait in monster.traits
            if trait and trait.get('name')
            ]

        hp, hp_i = self.monsterChallengeRatingByStat(
            "hit_points", monster["hit_points"]
            )
        ac, ac_i = self.monsterChallengeRatingByStat(
            "armor_class", monster["armor_class"], hp_i
            )
        ad, ad_i = self.monsterChallengeRatingByStat(
            "average_damage", monster["average_damage"]
            )
        ab, ab_i = self.monsterChallengeRatingByStat(
            "attack_bonus", monster["attack_bonus"], ad_i
            )
        dc, dc_i = self.monsterChallengeRatingByStat(
            "spell_save_dc", monster["spell_save_dc"], ad_i
            )

        defensive = hp + (ac - hp) / 2.0
        offensive = ad + max([(ab - ad) / 2.0, (dc - ad) / 2.0])
        challenge_rating = (defensive + offensive) / 2.0

        monster["challenge_rating"] = challenge_rating
        monster["proficiency"] = self.monsterStatByChallengeRating(
            challenge_rating, "proficiency"
            )
        monster["xp"] = self.monsterStatByChallengeRating(
            challenge_rating, "xp"
            )
        monster["xp_rating"] = monster["xp"]

        return monster
