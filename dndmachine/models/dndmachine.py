from flask import g
import json
import sqlite3
from passlib.hash import pbkdf2_sha256 as password
import parser
import re

from base import JsonObject

class DndMachine(object):
    def __init__(self, config, items):
        self.xp_at_level = config['xp_at_level']
        self.challenge_rating = config["challenge_rating"]
        self.monster_scaling = config["monster_scaling"]
        self.size_hit_dice = config["size_hit_dice"]
        self.items = JsonObject(items, pathPrefix='items')

    def resolveMath(self, obj, formula):
        replace = {}
        for m in re.finditer(ur'[a-z_.]+', formula):
            if obj.hasPath(m.group(0)):
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
        if matches:
            return matches[0]
        return default

    def itemByName(self, name, path=[]):
        matches = [
            item
            for item in self.items.getPath(path)
            if item['name'] == name
            ]
        if matches:
            return matches[0]
        return None

    def diceCast(self, size, number=1, bonus=0):
        return {
            'average': self.diceAverage(size, number, bonus),
            'critical': self.diceCritical(size, number, bonus),
            'notation': self.diceNotation(size, number, bonus)
            }

    def diceAverage(self, size, number=1, bonus=0):
        return int(number * ((size+1)/2.0) + bonus)

    def diceCritical(self, size, number=1, bonus=0):
        return int((number*2) * ((size+1)/2.0) + bonus)

    def diceNotation(self, size, number, bonus=0):
        notation = []
        if number:
            notation.append("%dd%d" % (number, size))
        if bonus:
            notation.append("%d" % bonus)
        return '+'.join(notation)

    def xpAtLevel(self, level):
        return self.xp_at_level.get(str(level), None)

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

    def computeMonsterChallengeRating(self, hit_points, armor_class,
                               average_damage, attack_bonus, spell_dc):
        hp, hp_i = self.monsterChallengeRatingByStat(
            "hit_points", hit_points
            )
        ac, ac_i = self.monsterChallengeRatingByStat(
            "armor_class", armor_class, hp_i
            )
        ad, ad_i = self.monsterChallengeRatingByStat(
            "average_damage", average_damage
            )
        ab, ab_i = self.monsterChallengeRatingByStat(
            "attack_bonus", attack_bonus, ad_i
            )
        dc, dc_i = self.monsterChallengeRatingByStat(
            "spell_save_dc", spell_dc, ad_i
            )

        defensive = hp + (ac - hp) / 2.0
        offensive = ad + max([(ab - ad) / 2.0, (dc - ad) / 2.0])
        challenge_rating = (defensive + offensive) / 2.0

        xp = self.monsterStatByChallengeRating(
           challenge_rating, "xp"
           )
        next_xp = self.monsterStatByChallengeRating(
            challenge_rating + 0.5, "xp"
            )
        challenge_ratio = challenge_rating % 1.0

        return {
            'challenge_rating': challenge_rating,
            'proficiency': self.monsterStatByChallengeRating(
                challenge_rating, "proficiency"
                ),
            'xp': xp,
            'xp_rating': (xp * challenge_ratio) \
                + (xp * (1.0-challenge_ratio))
            }
