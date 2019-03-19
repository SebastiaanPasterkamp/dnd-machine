import parser
import re
import math

from base import JsonObject, JsonObjectDataMapper

class DndMachine(object):
    _instance = None
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(DndMachine, cls).__new__(
                                cls, *args, **kwargs)
        return cls._instance

    def __init__(self, config, mapper):
        self.xp_at_level = config['xp_at_level']
        self.challenge_rating = config["challenge_rating"]
        self.monster_scaling = config["monster_scaling"]
        self.size_hit_dice = config["size_hit_dice"]
        self.mapper = mapper

        self.ns = vars(math).copy()
        self.ns.update({
            '__builtins__': None,
            'min': min,
            'max': max,
            })

    def resolveMath(self, obj, formula):
        replace = {}
        for m in re.finditer(ur'\b[a-z_.]+\b', formula):
            path = m.group(0)
            if obj.hasPath(path):
                replace[path] = obj.getPath(path)
            elif path.startswith(obj._pathPrefix):
                replace[path] = None
        for var, val in replace.iteritems():
            formula = formula.replace(var, str(val))
        code = parser.expr(formula).compile()
        return eval(code, self.ns)

    def findByName(self, name, items, default=None):
        matches = [
            item
            for item in items
            if item.get('name', item.get('code')) == name
            ]
        if matches:
            return matches[0]
        return default

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
        notation = ""
        if number:
            notation += "%dd%d" % (number, size)
        if bonus:
            notation += "+%d" % bonus
        return notation

    def xpToLevel(self, xp):
        xp_level, xp_offset = 0, 0
        level = 1
        for next_level in range(1, 21):
            xp_level = self.xp_at_level.get(str(next_level), None)
            if xp < xp_level:
                break
            level = next_level
            xp_offset = xp_level
        return level, xp - xp_offset, xp_level - xp_offset

    def acpToLevel(self, acp):
        level = 1
        acp_per_level = 4
        if acp < 16:
            level = 1 + int(acp / 4)
            return level, acp % 4, 4
        level = 3 + int(acp / 8)
        return level, acp % 8, 8

    def xpToAcp(self, xp):
        level, progress, max_progress = self.xpToLevel(xp)
        acp = 0
        if level <= 4:
            acp_per_level = 4
            acp = (level - 1) * acp_per_level
        else:
            acp_per_level = 8
            acp = 16 + (level - 5) * acp_per_level

        acp += int(math.ceil(
            float(acp_per_level * progress) / max_progress
            ))
        return acp

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
        elif str(level) in self.challenge_rating['scale']:
            challenge = self.challenge_rating['scale'][str(level)]

        return dict(zip(
            self.challenge_rating['ratings'],
            challenge
            ))

    def monsterStatByChallengeRating(
            self, challenge_rating, stat=None, nextUp=False):
        """Find matching challenge rating statistics closest to
        'challenge_rating', favoring higher challenge ratings on ties.
        * Return 'stat' attribute if requested
        * return 'nextUp' (next step up in challenge rating) if True
        """
        scaling = sorted(
            self.monster_scaling,
            key=lambda d: (
                abs(d['challenge'] - challenge_rating),
                -d['challenge']
                )
            )
        data = scaling[0]
        if nextUp:
            scaling = [
                s for s in scaling
                if s['challenge'] > data['challenge']
                ]
            data = scaling[0]
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

    def computeMonsterChallengeRating(
            self, hit_points, armor_class,
            average_damage, attack_bonus, spell_dc, cr_boost=0
            ):
        cr_hp, i_hp = self.monsterChallengeRatingByStat(
            "hit_points", hit_points
            )
        precise_cr_hp = self.monster_scaling[i_hp + cr_boost]['challenge']
        cr_ac, i_ac = self.monsterChallengeRatingByStat(
            "armor_class", armor_class, i_hp
            )
        precise_cr_ac = self.monster_scaling[i_ac + cr_boost]['challenge']

        i_d = cr_boost + i_hp + int((i_ac - i_hp)/2.0)
        cr_d = self.monster_scaling[i_d]['challenge']
        precise_cr_d = (precise_cr_hp + precise_cr_ac) / 2.0

        cr_ad, i_ad = self.monsterChallengeRatingByStat(
            "average_damage", average_damage
            )
        precise_cr_ad = self.monster_scaling[i_ad + cr_boost]['challenge']
        cr_dc, i_dc = self.monsterChallengeRatingByStat(
            "spell_save_dc", spell_dc, i_ad
            )
        precise_cr_dc = self.monster_scaling[i_dc + cr_boost]['challenge']
        cr_ab, i_ab = self.monsterChallengeRatingByStat(
            "attack_bonus", attack_bonus, i_ad
            )
        precise_cr_ab = self.monster_scaling[i_ab + cr_boost]['challenge']

        i_o = cr_boost + i_ad + max(
            int((i_dc - i_ad)/2.0),
            int((i_ab - i_ad)/2.0)
            )
        cr_o = self.monster_scaling[i_o]['challenge']
        precise_cr_o = (precise_cr_ad + max(precise_cr_dc, precise_cr_ab)) / 2.0

        cr = (cr_d + cr_o) / 2.0
        precise_cr = (precise_cr_d + precise_cr_o) / 2.0

        stats = self.monsterStatByChallengeRating(cr)
        nextUp = self.monsterStatByChallengeRating(
            cr, nextUp=True
            )
        next_xp, next_cr = nextUp['xp'], nextUp['challenge']
        challenge_ratio = \
            (precise_cr - stats['challenge']) / (next_cr - stats['challenge'])

        return {
            'challenge_rating': stats['challenge'],
            'challenge_rating_precise': precise_cr,
            'proficiency': stats["proficiency"],
            'xp': stats['xp'],
            'xp_rating':int(
                (stats['xp'] * (1.0 - challenge_ratio)) \
                + (next_xp * challenge_ratio)
                )
            }

    def findObj(self, item):
        objs = self.mapper.weapon.getMultiple(
            'name COLLATE nocase = :name',
            {'name': item}
            )
        if len(objs):
            return (
                'weapons',
                objs[0]
                )
        objs = self.mapper.armor.getMultiple(
            'name COLLATE nocase = :name',
            {'name': item}
            )
        if len(objs):
            return (
                'armor',
                objs[0]
                )
        obj = self.mapper.items.itemByNameOrCode(item, 'tools')
        if obj is not None:
            return (
                'items%s' % obj['type'].capitalize(),
                obj
                )
        return (None, None)

    def identifyEquipment(self, equipment):
        mappers = {
            'armor': self.mapper.armor,
            'weapons': self.mapper.weapon,
            }
        re_cnt_item = re.compile(ur"^(\d+)\s+x\s+(.*)$")

        data = {
            'armor': [],
            'weapons': [],
            'items': {
                "artisan": [],
                "kit": [],
                "gaming": [],
                "musical": [],
                "trinket": [],
                },
            'equipment': [],
            }

        for item in equipment:
            obj = None
            if not isinstance(item, dict):
                item = {
                    'name': item,
                    'count': 1,
                    'path': 'itemsTrinket',
                    }
                matches = re_cnt_item.match(item['name'])
                if matches != None:
                    item['count'] = int(matches.group(1))
                    item['name'] = matches.group(2)
            elif 'id' in item and item['path'] in mappers:
                obj = mappers[ item['path'] ].getById(
                    item['id']
                    )

            if obj is None:
                path, obj = self.findObj(item['name'])
                item['path'] = path or item['path']
                if obj is None:
                    obj = item['name']
                elif 'id' in obj:
                    item['id'] = obj['id']

            for old in data['equipment']:
                if old['path'] == item['path'] \
                        and old['name'] == item['name']:
                    old['count'] += item['count']
                    break
            else:
                data['equipment'].append(item)

            if isinstance(obj, JsonObject):
                obj = obj._config

            if item['path'].startswith('items'):
                itemType = item['path'][5:].lower()
                data['items'][itemType] += [obj] * item['count']
            else:
                data[item['path']] += [obj] * item['count']
        return data

    def computeWeaponStats(self, weapon, wielder, autoProf=False):
        attack_modifier = "strength"
        if u"ranged" in weapon["type"]:
            attack_modifier = "dexterity"
        if u"finesse" in weapon['property']:
            finesse = {
                "strength": wielder.statisticsModifiersStrength,
                "dexterity": wielder.statisticsModifiersDexterity,
                }
            attack_modifier = max(finesse, key=finesse.get)

        dmg = self.mapper.items.itemByNameOrCode(
            weapon["damage"]["type"],
            'damage_types'
            )
        weapon["damage"]["type_label"] = dmg["label"]
        weapon["damage"]["type_short"] = dmg["short"]

        weapon["bonus"] = weapon["damage"]["bonus"] = \
            wielder.statisticsModifiers[attack_modifier]
        if autoProf \
                or weapon['type'] in wielder.proficienciesWeapons \
                or weapon['name'] in wielder.proficienciesWeapons:
            weapon["bonus"] += wielder.proficiency

        weapon["damage"]["notation"] = self.diceNotation(
            weapon["damage"]["dice_size"],
            weapon["damage"]["dice_count"],
            weapon["damage"]["bonus"]
            )

        if "versatile" in weapon["property"]:
            weapon["versatile"]["bonus"] = weapon["damage"]["bonus"]
            weapon["versatile"]["notation"] = self.diceNotation(
                weapon["versatile"]["dice_size"],
                weapon["versatile"]["dice_count"],
                weapon["versatile"]["bonus"]
                )
        return weapon