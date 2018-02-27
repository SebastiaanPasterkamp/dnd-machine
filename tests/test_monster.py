import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app.models.dndmachine import DndMachine
from app.models.items import ItemsObject
from app.models.monster import MonsterObject
from app.config import get_config, get_item_data

class TestMonsterObject(unittest.TestCase):

    def setUp(self):
        config = get_config()
        self.machine = DndMachine(config['machine'])
        self.items = ItemsObject(
            os.path.abspath(os.path.join(
                os.path.dirname(__file__),
                '..',
                'app',
                'item-data.json'
                ))
            )

    def tearDown(self):
        pass

    def testHitPoints(self):
        monster = MonsterObject({
            'size': 'tiny',
            'level': 1
            })
        monster.mapper = self
        monster.compute()

        self.assertDictContainsSubset({
            'hit_points_notation': u'1d4',
            'hit_points': 2
            }, monster.config)

        monster.statisticsBareConstitution = 14
        monster.compute()

        self.assertDictContainsSubset({
            'dexterity': 10,
            'strength': 10,
            'constitution': 14,
            'intelligence': 10,
            'wisdom': 10,
            'charisma': 10
            }, monster.statisticsBare)
        self.assertDictContainsSubset({
            'dexterity': 0,
            'strength': 0,
            'constitution': 2,
            'intelligence': 0,
            'wisdom': 0,
            'charisma': 0
            }, monster.statisticsModifiers)
        self.assertDictContainsSubset({
            'hit_points_notation': u'1d4+2',
            'hit_points': 4
            }, monster.config)

        monster = MonsterObject({
            'size': 'medium',
            'statistics': {
                'bare': {
                    'constitution': 11
                    }
                },
            'level': 4
            })
        monster.mapper = self
        monster.compute()

        self.assertEquals(monster.statisticsBareConstitution, 11)
        self.assertEquals(monster.statisticsModifiersConstitution, 0)
        self.assertEquals(monster.hit_points_notation, '4d8')
        self.assertEquals(monster.hit_points, 18)

        monster.statisticsBareConstitution = 15
        monster.compute()

        self.assertEquals(monster.statisticsBareConstitution, 15)
        self.assertEquals(monster.statisticsModifiersConstitution, 2)
        self.assertEquals(monster.hit_points_notation, '4d8+8')
        self.assertEquals(monster.hit_points, 26)


        monster = MonsterObject({
            'size': 'huge',
            'statistics': {
                'bare': {
                    'constitution': 18
                    }
                },
            'level': 10
            })
        monster.mapper = self
        monster.compute()

        self.assertEquals(monster.statisticsBareConstitution, 18)
        self.assertEquals(monster.statisticsModifiersConstitution, 4)
        self.assertEquals(monster.hit_points_notation, '10d12+40')
        self.assertEquals(monster.hit_points, 105)

        monster.statisticsBareConstitution = 19
        monster.compute()

        self.assertEquals(monster.statisticsBareConstitution, 19)
        self.assertEquals(monster.statisticsModifiersConstitution, 4)
        self.assertEquals(monster.hit_points_notation, '10d12+40')
        self.assertEquals(monster.hit_points, 105)


    def testAverageDamage(self):
        monster = MonsterObject({
            'attacks': [{
                'name': 'Slap',
                'damage': [{
                    'type': 'Force',
                    'dice_count': 1,
                    'dice_size': 4
                    }]
                }]
            })
        monster.mapper = self
        monster.compute()

        self.assertEquals(monster.attacks0notation, '1d4 Force')
        self.assertEquals(monster.proficiency, 2)
        self.assertEquals(monster.attack_bonus, 2)
        self.assertEquals(monster.spell_save_dc, 0)
        self.assertEquals(monster.average_damage, 2)
        self.assertEquals(monster.critical_damage, 5)

        monster.statisticsBareStrength = 12
        monster.compute()

        self.assertEquals(monster.attacks0notation, '1d4+1 Force')
        self.assertEquals(monster.proficiency, 2)
        self.assertEquals(monster.attack_bonus, 3)
        self.assertEquals(monster.spell_save_dc, 0)
        self.assertEquals(monster.average_damage, 3)
        self.assertEquals(monster.critical_damage, 6)

        monster = MonsterObject({
            'statistics': {
                'bare': {
                    'strength': 16,
                    'dexterity': 12,
                    'charisma': 10
                    }
                },
            'attacks': [{
                'name': 'Torch Slam',
                'mode': 'spell',
                'damage': [{
                    'type': 'Fire',
                    'dice_count': 2,
                    'dice_size': 8
                    }, {
                    'type': 'Bludgeoning',
                    'dice_count': 3,
                    'dice_size': 6
                    }]
                }]
            })
        monster.mapper = self
        monster.compute()

        self.assertDictContainsSubset({
            'proficiency': 2,
            'attack_bonus': 2,
            'spell_save_dc': 10,
            'average_damage': 19,
            'critical_damage': 39
            }, monster.config)
        self.assertDictContainsSubset({
            'notation': u'3d6 Bludgeoning + 2d8 Fire'
            }, monster.attacks0)

        monster.attacks0mode = 'melee'
        monster.compute()

        self.assertDictContainsSubset({
            'notation': '3d6+3 Bludgeoning + 2d8 Fire'
            }, monster.attacks0)
        self.assertDictContainsSubset({
            'proficiency': 2,
            'attack_bonus': 5,
            'spell_save_dc': 0,
            'average_damage': 22,
            'critical_damage': 42
            }, monster.config)

        monster = MonsterObject({
            'statistics': {
                'bare': {
                    'strength': 15,
                    'dexterity': 17,
                    'charisma': 13
                    }
                },
            'attacks': [{
                'name': 'Poisoned Axe',
                'mode': 'ranged',
                'damage': [{
                    'type': 'Piercing',
                    'dice_count': 3,
                    'dice_size': 8
                    }, {
                    'type': 'Poison',
                    'dice_count': 2,
                    'dice_size': 6
                    }]
                }],
            'multiattack': [{
                'name': 'Double Axe',
                'sequence': ['Poisoned Axe', 'Poisoned Axe']
                }]
            })
        monster.mapper = self
        monster.compute()

        self.assertDictContainsSubset({
            'notation': '3d8+3 Piercing + 2d6 Poison'
            }, monster.attacks0)
        self.assertDictContainsSubset({
            'proficiency': 2,
            'attack_bonus': 5,
            'spell_save_dc': 0,
            'average_damage': 46,
            'critical_damage': 88
            }, monster.config)


        monster.statisticsBareDexterity = 15
        monster.compute()

        self.assertEquals(monster.attacks0notation, '3d8+2 Piercing + 2d6 Poison')
        self.assertEquals(monster.proficiency, 2)
        self.assertEquals(monster.attack_bonus, 4)
        self.assertEquals(monster.spell_save_dc, 0)
        self.assertEquals(monster.average_damage, 44)
        self.assertEquals(monster.critical_damage, 86)


    def testChallengeRating(self):
        monster = MonsterObject({
            'size': 'tiny',
            'level': 1,
            'statistics': {
                'bare': {
                    'constitution': 10,
                    'strength': 10
                    }
                },
            'armor_class': 10,
            'attacks': [{
                'name': 'Slap',
                'damage': [{
                    'type': 'Force',
                    'dice_count': 1,
                    'dice_size': 4
                    }]
                }]
            })
        monster.mapper = self
        monster.compute()

        self.assertAlmostEqual(
            monster.challenge_rating, 0.125, delta=0.01)
        self.assertAlmostEqual(
            monster.challenge_rating_precise, 0.03, delta=0.01)
        self.assertEquals(monster.xp, 25)
        self.assertAlmostEqual(monster.xp_rating, 6., delta=1.0)
        self.assertEquals(monster.proficiency, 2)

        monster.armor_class = 11
        monster.statisticsBareConstitution = 14
        monster.statisticsBareStrength = 12
        monster.compute()

        self.assertAlmostEqual(
            monster.challenge_rating, 0.125, delta=0.01)
        self.assertAlmostEqual(
            monster.challenge_rating_precise, 0.06, delta=0.01)
        self.assertEquals(monster.xp, 25)
        self.assertAlmostEqual(monster.xp_rating, 12., delta=1.0)
        self.assertEquals(monster.proficiency, 2)

        monster = MonsterObject({
            'size': 'medium',
            'level': 4,
            'statistics': {
                'bare': {
                    'constitution': 11,
                    'strength': 18,
                    'dexterity': 12,
                    'charisma': 10
                    }
                },
            'armor_class': 13,
            'attacks': [{
                'name': 'Torch Slam',
                'mode': 'spell',
                'damage': [{
                    'type': 'Fire',
                    'dice_count': 3,
                    'dice_size': 6
                    }, {
                    'type': 'Bludgeoning',
                    'dice_count': 2,
                    'dice_size': 8
                    }]
                }]
            })
        monster.mapper = self
        monster.compute()

        self.assertAlmostEqual(
            monster.challenge_rating, 0.25, delta=0.01)
        self.assertAlmostEqual(
            monster.challenge_rating_precise, 0.5625, delta=0.01)
        self.assertEquals(monster.xp, 50)
        self.assertAlmostEqual(monster.xp_rating, 112., delta=1.0)
        self.assertEquals(monster.proficiency, 2)

        monster.armor_class = 14
        monster.statisticsBareConstitution = 15
        monster.statisticsBareStrength = 10
        monster.statisticsBareCharisma = 16
        monster.compute()

        self.assertAlmostEqual(
            monster.challenge_rating, 2, delta=0.02)
        self.assertAlmostEqual(
            monster.challenge_rating_precise, 2.55, delta=0.02)
        self.assertEquals(monster.xp, 450)
        self.assertAlmostEqual(monster.xp_rating, 582., delta=1.0)
        self.assertEquals(monster.proficiency, 2)


        monster = MonsterObject({
            'size': 'huge',
            'level': 10,
            'statistics': {
                'bare': {
                    'constitution': 18,
                    'strength': 15,
                    'dexterity': 17,
                    'charisma': 13
                    }
                },
            'armor_class': 16,
            'attacks': [{
                'name': 'Poisoned Axe',
                'mode': 'ranged',
                'damage': [{
                    'type': 'Piercing',
                    'dice_count': 3,
                    'dice_size': 8
                    }, {
                    'type': 'Poison',
                    'dice_count': 2,
                    'dice_size': 6
                    }]
                }],
            'multiattack': [{
                'name': 'Double Axe',
                'sequence': ['Poisoned Axe', 'Poisoned Axe']
                }]
            })
        monster.mapper = self
        monster.compute()

        self.assertAlmostEqual(
            monster.challenge_rating, 6, delta=0.1)
        self.assertAlmostEqual(
            monster.challenge_rating_precise, 6.25, delta=0.1)
        self.assertEquals(monster.xp, 2300)
        self.assertAlmostEqual(monster.xp_rating, 2450.0, delta=1.0)
        self.assertEquals(monster.proficiency, 3)

        monster.armor_class = 17
        monster.statisticsBareConstitution = 19
        monster.statisticsBareStrength = 12
        monster.compute()

        self.assertAlmostEqual(
            monster.challenge_rating, 7, delta=0.1)
        self.assertAlmostEqual(
            monster.challenge_rating_precise, 6.75, delta=0.1)
        self.assertEquals(monster.xp, 2900)
        self.assertAlmostEqual(monster.xp_rating, 2650.0, delta=1.0)
        self.assertEquals(monster.proficiency, 3)

if __name__ == '__main__':
    unittest.main()
