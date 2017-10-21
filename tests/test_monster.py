import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from dndmachine.models.monster import MonsterObject

class TestMonsterObject(unittest.TestCase):

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def testHitPoints(self):
        monster = MonsterObject({
            'size': 'tiny',
            'stats': {
                'constitution': 10
                },
            'level': 1
            })
        self.assertEquals(monster.statsConstitution, 10)
        self.assertEquals(monster.modifiersConstitution, 0)
        self.assertEquals(monster.hit_points_notation, '1d4')
        self.assertEquals(monster.hit_points, 2, 'Half of 1d4')

        monster.update({
            'stats': {'constitution': 14}
            })
        self.assertEquals(monster.statsConstitution, 14)
        self.assertEquals(monster.modifiersConstitution, 2)
        self.assertEquals(monster.hit_points_notation, '1d4+2')
        self.assertEquals(monster.hit_points, 4)

        monster = MonsterObject({
            'size': 'medium',
            'stats': {
                'constitution': 11
                },
            'level': 4
            })
        self.assertEquals(monster.statsConstitution, 11)
        self.assertEquals(monster.modifiersConstitution, 0)
        self.assertEquals(monster.hit_points_notation, '4d8')
        self.assertEquals(monster.hit_points, 18)

        monster.update({
            'stats': {'constitution': 15}
            })
        self.assertEquals(monster.statsConstitution, 15)
        self.assertEquals(monster.modifiersConstitution, 2)
        self.assertEquals(monster.hit_points_notation, '4d8+8')
        self.assertEquals(monster.hit_points, 26)


        monster = MonsterObject({
            'size': 'huge',
            'stats': {
                'constitution': 18
                },
            'level': 10
            })
        self.assertEquals(monster.statsConstitution, 18)
        self.assertEquals(monster.modifiersConstitution, 4)
        self.assertEquals(monster.hit_points_notation, '10d12+40')
        self.assertEquals(monster.hit_points, 105)

        monster.update({
            'stats': {'constitution': 19}
            })
        self.assertEquals(monster.statsConstitution, 19)
        self.assertEquals(monster.modifiersConstitution, 4)
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
        self.assertEquals(monster.attacks0notation, '1d4 Force')
        self.assertEquals(monster.proficiency, 2)
        self.assertEquals(monster.attack_bonus, 2)
        self.assertEquals(monster.spell_save_dc, 0)
        self.assertEquals(monster.average_damage, 2)
        self.assertEquals(monster.critical_damage, 5)

        monster.update({
            'stats': {'strength': 12}
            })
        self.assertEquals(monster.attacks0notation, '1d4+1 Force')
        self.assertEquals(monster.proficiency, 2)
        self.assertEquals(monster.attack_bonus, 3)
        self.assertEquals(monster.spell_save_dc, 0)
        self.assertEquals(monster.average_damage, 3)
        self.assertEquals(monster.critical_damage, 6)

        monster = MonsterObject({
            'stats': {
                'strength': 18,
                'dexterity': 12,
                'charisma': 10
                },
            'attacks': [{
                'name': 'Torch Slam',
                'damage': [{
                    'type': 'Fire',
                    'mode': 'spell',
                    'dice_count': 3,
                    'dice_size': 6
                    }, {
                    'type': 'Bludgeoning',
                    'mode': 'melee',
                    'dice_count': 2,
                    'dice_size': 8
                    }]
                }]
            })
        self.assertEquals(
            monster.attacks0notation, '2d8+4 Bludgeoning + 3d6 Fire')
        self.assertEquals(monster.proficiency, 2)
        self.assertEquals(monster.attack_bonus, 6)
        self.assertEquals(monster.spell_save_dc, 0)
        self.assertEquals(monster.average_damage, 23)
        self.assertEquals(monster.critical_damage, 43)

        monster.update({
            'stats': {
                'strength': 10,
                'charisma': 16
                }
            })
        self.assertEquals(
            monster.attacks0notation, '3d6+3 Fire + 2d8 Bludgeoning')
        self.assertEquals(monster.proficiency, 2)
        self.assertEquals(monster.attack_bonus, 0)
        self.assertEquals(monster.spell_save_dc, 13)
        self.assertEquals(monster.average_damage, 22)
        self.assertEquals(monster.critical_damage, 42)

        monster = MonsterObject({
            'stats': {
                'strength': 15,
                'dexterity': 17,
                'charisma': 13
                },
            'attacks': [{
                'name': 'Poisoned Axe',
                'damage': [{
                    'type': 'Piercing',
                    'mode': 'ranged',
                    'dice_count': 3,
                    'dice_size': 8
                    }, {
                    'type': 'Poison',
                    'mode': 'spell',
                    'dice_count': 2,
                    'dice_size': 6
                    }]
                }],
            'multiattack': [{
                'name': 'Double Axe',
                'sequence': ['Poisoned Axe', 'Poisoned Axe']
                }]
            })
        self.assertEquals(monster.attacks0notation, '3d8+3 Piercing + 2d6+1 Poison')
        self.assertEquals(monster.proficiency, 2)
        self.assertEquals(monster.attack_bonus, 5)
        self.assertEquals(monster.spell_save_dc, 0)
        self.assertEquals(monster.average_damage, 48)
        self.assertEquals(monster.critical_damage, 90)

        monster.update({
            'stats': {
                'dexterity': 15
                }
            })
        self.assertEquals(monster.attacks0notation, '3d8+2 Piercing + 2d6+1 Poison')
        self.assertEquals(monster.proficiency, 2)
        self.assertEquals(monster.attack_bonus, 4)
        self.assertEquals(monster.spell_save_dc, 0)
        self.assertEquals(monster.average_damage, 46)
        self.assertEquals(monster.critical_damage, 88)


    def testChallengeRating(self):
        monster = MonsterObject({
            'size': 'tiny',
            'level': 1,
            'stats': {
                'constitution': 10,
                'strength': 10
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
        self.assertAlmostEqual(
            monster.challenge_rating, 0.03, delta=0.01)
        self.assertEquals(monster.xp, 10)
        self.assertAlmostEqual(monster.xp_rating, 10., delta=1.0)
        self.assertEquals(monster.proficiency, 2)

        monster.update({
            'armor_class': 11,
            'stats': {
                'constitution': 14,
                'strength': 12
                }
            })
        self.assertAlmostEqual(
            monster.challenge_rating, 0.06, delta=0.01)
        self.assertEquals(monster.xp, 10)
        self.assertAlmostEqual(monster.xp_rating, 10., delta=1.0)
        self.assertEquals(monster.proficiency, 2)

        monster = MonsterObject({
            'size': 'medium',
            'level': 4,
            'stats': {
                'constitution': 11,
                'strength': 18,
                'dexterity': 12,
                'charisma': 10
                },
            'armor_class': 13,
            'attacks': [{
                'name': 'Torch Slam',
                'damage': [{
                    'type': 'Fire',
                    'mode': 'spell',
                    'dice_count': 3,
                    'dice_size': 6
                    }, {
                    'type': 'Bludgeoning',
                    'mode': 'melee',
                    'dice_count': 2,
                    'dice_size': 8
                    }]
                }]
            })
        self.assertAlmostEqual(
            monster.challenge_rating, 2.06, delta=0.01)
        self.assertEquals(monster.xp, 450)
        self.assertAlmostEqual(monster.xp_rating, 450., delta=1.0)
        self.assertEquals(monster.proficiency, 2)

        monster.update({
            'armor_class': 14,
            'stats': {
                'constitution': 15,
                'strength': 10,
                'charisma': 16
                }
            })
        self.assertAlmostEqual(
            monster.challenge_rating, 2.55, delta=0.02)
        self.assertEquals(monster.xp, 700)
        self.assertAlmostEqual(monster.xp_rating, 700., delta=1.0)
        self.assertEquals(monster.proficiency, 2)


        monster = MonsterObject({
            'size': 'huge',
            'level': 10,
            'stats': {
                'constitution': 18,
                'strength': 15,
                'dexterity': 17,
                'charisma': 13
                },
            'armor_class': 16,
            'attacks': [{
                'name': 'Poisoned Axe',
                'damage': [{
                    'type': 'Piercing',
                    'mode': 'ranged',
                    'dice_count': 3,
                    'dice_size': 8
                    }, {
                    'type': 'Poison',
                    'mode': 'spell',
                    'dice_count': 2,
                    'dice_size': 6
                    }]
                }],
            'multiattack': [{
                'name': 'Double Axe',
                'sequence': ['Poisoned Axe', 'Poisoned Axe']
                }]
            })
        self.assertAlmostEqual(
            monster.challenge_rating, 6.25, delta=0.1)
        self.assertEquals(monster.xp, 2300)
        self.assertAlmostEqual(monster.xp_rating, 2300.0, delta=1.0)
        self.assertEquals(monster.proficiency, 3)

        monster.update({
            'armor_class': 17,
            'stats': {
                'constitution': 19,
                'strength': 12
                }
            })

        self.assertAlmostEqual(
            monster.challenge_rating, 6.75, delta=0.1)
        self.assertEquals(monster.xp, 2900)
        self.assertAlmostEqual(monster.xp_rating, 2900.0, delta=1.0)
        self.assertEquals(monster.proficiency, 3)

if __name__ == '__main__':
    unittest.main()
