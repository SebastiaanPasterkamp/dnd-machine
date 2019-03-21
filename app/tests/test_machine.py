import unittest
from mock import Mock
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app.models.dndmachine import DndMachine
from app.config import get_config

class DndMachineTestCase(unittest.TestCase):

    def setUp(self):
        config = get_config()
        self.machine = DndMachine(config['machine'], self)

    def tearDown(self):
        pass

    def testResolveMathPath(self):
        obj = Mock()
        obj.hasPath = Mock(return_value=True)
        obj.getPath = Mock(return_value=5)

        self.assertEquals(
            self.machine.resolveMath(obj, 'test.path * 2'), 10)
        obj.hasPath.assert_called_once_with('test.path')
        obj.getPath.assert_called_once_with('test.path')

    def testResolveMathPrefix(self):
        obj = Mock()
        obj.hasPath = Mock(return_value=False)
        obj._pathPrefix = 'test'

        self.assertEquals(
            self.machine.resolveMath(obj, 'test.path'), None)
        obj.hasPath.assert_called_once_with('test.path')
        obj.getPath.assert_not_called()

    def testResolveMathFormulas(self):
        obj = Mock()
        obj.hasPath = Mock(return_value=False)
        obj._pathPrefix = 'test'

        self.assertEquals(
            self.machine.resolveMath(obj, 'min(3, 5)'), 3)
        self.assertEquals(
            self.machine.resolveMath(obj, 'max(3, 5)'), 5)
        self.assertEquals(
            self.machine.resolveMath(obj, 'ceil(5 / 2.0)'), 3)
        self.assertEquals(
            self.machine.resolveMath(obj, 'floor(5 / 2.0)'), 2)

    def testFindByNameByName(self):
        items = [
            {'name': 'foo', 'value': 1},
            {'name': 'bar', 'value': 2},
            {'name': 'foo', 'value': 3},
            {'name': 'bar', 'value': 4},
            ]
        self.assertEquals(
            self.machine.findByName('foo', items), items[0])
        self.assertEquals(
            self.machine.findByName('bar', items), items[1])

    def testFindByNameByCode(self):
        items = [
            {'code': 'foo', 'value': 1},
            {'code': 'bar', 'value': 2},
            {'name': 'foo', 'value': 3},
            {'name': 'bar', 'value': 4},
            ]
        self.assertEquals(
            self.machine.findByName('foo', items), items[0])
        self.assertEquals(
            self.machine.findByName('bar', items), items[1])

    def testFindByNameDefault(self):
        items = [
            {'code': 'foo', 'value': 1},
            {'code': 'bar', 'value': 2},
            {'name': 'foo', 'value': 3},
            {'name': 'bar', 'value': 4},
            ]
        self.assertEquals(
            self.machine.findByName('default', items), None)
        self.assertEquals(
            self.machine.findByName('default', items, 'abc'), 'abc')

    def testDiceNotation(self):
        self.assertEquals(
            "1d4+2",
            self.machine.diceNotation(4, 1, 2)
            )
        self.assertEquals(
            "2d6",
            self.machine.diceNotation(6, 2)
            )
        self.assertEquals(
            "+3",
            self.machine.diceNotation(8, 0, 3)
            )
        self.assertEquals(
            "3d10+4",
            self.machine.diceNotation(size=10, number=3, bonus=4)
            )

    def testDiceCast(self):
        self.assertEquals(self.machine.diceCast(4, 1), {
            'average': 2,
            'critical': 5,
            'notation': '1d4'
            })
        self.assertEquals(self.machine.diceCast(6, 2, 1), {
            'average': 8,
            'critical': 15,
            'notation': '2d6+1'
            })

    def testXpToLevel(self):
        self.assertEquals(
            self.machine.xpToLevel(0), (1, 0, 300))
        self.assertEquals(
            self.machine.xpToLevel(300), (2, 0, 600))
        self.assertEquals(
            self.machine.xpToLevel(20000), (6, 6000, 9000))
        self.assertEquals(
            self.machine.xpToLevel(655000), (20, 300000, 0))

    def testAcpToLevel(self):
        self.assertEquals(
            (1, 0, 4),
            self.machine.acpToLevel(0)
            )
        self.assertEquals(
            (1, 3, 4),
            self.machine.acpToLevel(3)
            )
        self.assertEquals(
            (5, 0, 8),
            self.machine.acpToLevel(16)
            )
        self.assertEquals(
            (5, 1, 8),
            self.machine.acpToLevel(17)
            )
        self.assertEquals(
            (7, 3, 8),
            self.machine.acpToLevel(35)
            )

    def testXpToAcp(self):
        # Level 1.0
        self.assertEquals(
            0,
            self.machine.xpToAcp(0),
            )
        # Level 2.0
        self.assertEquals(
            4,
            self.machine.xpToAcp(300)
            )
        # Level 2.25
        self.assertEquals(
            5,
            self.machine.xpToAcp(301),
            )
        # Level 7.0
        self.assertEquals(
            32,
            self.machine.xpToAcp(23000),
            )
        # Level 7.5
        self.assertEquals(
            36,
            self.machine.xpToAcp(28500)
            )

    def testChallengeByLevel(self):
        self.assertEquals(
            self.machine.challengeByLevel(1), {
                'easy': 25,
                'medium': 50,
                'hard': 75,
                'deadly': 100
                }
            )
        self.assertEquals(
            self.machine.challengeByLevel(2), {
                'easy': 50,
                'medium': 100,
                'hard': 150,
                'deadly': 200
                }
            )
        self.assertEquals(
            self.machine.challengeByLevel(20), {
                'easy': 2800,
                'medium': 5700,
                'hard': 8500,
                'deadly': 12700
                }
            )

    def testMonsterStatByChallengeRating(self):
        self.assertEquals(
            self.machine.monsterStatByChallengeRating(0.1), {
                u"proficiency": 2,
                u"armor_class": {u"min": 13, u"max": 13},
                u"hit_points": {u"min": 7, u"max": 35},
                u"attack_bonus": {u"min": 3, u"max": 3},
                u"average_damage": {u"min": 2, u"max": 3},
                u"spell_save_dc": {u"min": 13, u"max": 13},
                u"xp": 25,
                u"challenge": 0.125
                }
            )
        self.assertEquals(
            self.machine.monsterStatByChallengeRating(1.4), {
                u"proficiency": 2,
                u"armor_class": {u"min": 13, u"max": 13},
                u"hit_points": {u"min": 71, u"max": 85},
                u"attack_bonus": {u"min": 3, u"max": 3},
                u"average_damage": {u"min": 9, u"max": 14},
                u"spell_save_dc": {u"min": 13, u"max": 13},
                u"xp": 200,
                u"challenge": 1
                }
            )
        self.assertEquals(
            self.machine.monsterStatByChallengeRating(10.8), {
                u"proficiency": 4,
                u"armor_class": {u"min": 17, u"max": 17},
                u"hit_points": {u"min": 221, u"max": 235},
                u"attack_bonus": {u"min": 8, u"max": 8},
                u"average_damage": {u"min": 69, u"max": 69},
                u"spell_save_dc": {u"min": 17, u"max": 17},
                u"xp": 7200,
                u"challenge": 11
                }
            )

    def testMonsterChallengeRatingByStat(self):
        self.assertEquals(
            self.machine.monsterChallengeRatingByStat(
                'hit_points', 8
                ),
            (0.125, 1)
            )
        self.assertEquals(
            self.machine.monsterChallengeRatingByStat(
                'spell_save_dc', 13, 3
                ),
            (0.5, 3)
            )
        self.assertEquals(
            self.machine.monsterChallengeRatingByStat(
                'armor_class', 13, 8
                ),
            (3, 6)
            )
        self.assertEquals(
            self.machine.monsterChallengeRatingByStat(
                'armor_class', 15, 7
                ),
            (5, 8)
            )

    def testComputeMonsterChallengeRating(self):
        # CR 0
        cr_0 = {
            'challenge_rating': 0.0,
            'challenge_rating_precise': 0.0,
            'proficiency': 2,
            'xp': 10,
            'xp_rating': 10
            }
        self.assertEquals(
            self.machine.computeMonsterChallengeRating(
                hit_points=6,
                armor_class=12,
                average_damage=1,
                attack_bonus=3,
                spell_dc=13
                ),
            cr_0
            )
        self.assertEquals(
            self.machine.computeMonsterChallengeRating(
                hit_points=6,
                armor_class=12,
                average_damage=1,
                attack_bonus=0,
                spell_dc=13
                ),
            cr_0
            )

        # CR 1/4
        cr_1_4 = {
            'challenge_rating': 0.25,
            'challenge_rating_precise': 0.25,
            'proficiency': 2,
            'xp': 50,
            'xp_rating': 50
            }
        self.assertEquals(
            self.machine.computeMonsterChallengeRating(
                hit_points=49,
                armor_class=13,
                average_damage=5,
                attack_bonus=3,
                spell_dc=13
                ),
            cr_1_4
            )
        self.assertEquals(
            self.machine.computeMonsterChallengeRating(
                hit_points=49,
                armor_class=13,
                average_damage=5,
                attack_bonus=0,
                spell_dc=13
                ),
            cr_1_4
            )

        # CR 10
        cr_10 = {
            'challenge_rating': 10,
            'challenge_rating_precise': 10,
            'proficiency': 4,
            'xp': 5900,
            'xp_rating': 5900
            }
        self.assertEquals(
            self.machine.computeMonsterChallengeRating(
                hit_points=206,
                armor_class=17,
                average_damage=63,
                attack_bonus=7,
                spell_dc=13
                ),
            cr_10
            )
        self.assertEquals(
            self.machine.computeMonsterChallengeRating(
                hit_points=206,
                armor_class=17,
                average_damage=63,
                attack_bonus=0,
                spell_dc=16
                ),
            cr_10
            )

        # CR 16 Defensive / 18 Offensive
        cr_17 = {
            'challenge_rating': 17,
            'challenge_rating_precise': 17,
            'proficiency': 6,
            'xp': 18000,
            'xp_rating': 18000
            }
        self.assertEquals(
            self.machine.computeMonsterChallengeRating(
                hit_points=296,
                armor_class=18,
                average_damage=116,
                attack_bonus=10,
                spell_dc=0
                ),
            cr_17
            )
        self.assertEquals(
            self.machine.computeMonsterChallengeRating(
                hit_points=296,
                armor_class=18,
                average_damage=116,
                attack_bonus=0,
                spell_dc=19
                ),
            cr_17
            )

        # Aarakocra
        self.assertEquals(
            self.machine.computeMonsterChallengeRating(
                hit_points=13,
                armor_class=12,
                # Javelin
                average_damage=5,
                attack_bonus=4,
                spell_dc=0
                ),
            {
                'challenge_rating': 0.5,
                'challenge_rating_precise': 0.84375,
                'proficiency': 2,
                'xp': 100,
                'xp_rating': 168
                }
            )

        # Lamia
        self.assertEquals(
            self.machine.computeMonsterChallengeRating(
                hit_points=97,
                armor_class=13,
                #
                average_damage=19,
                attack_bonus=5,
                spell_dc=13,
                cr_boost=1
                ),
            {
                'challenge_rating': 4,
                'challenge_rating_precise': 3.5,
                'proficiency': 2,
                'xp': 1100,
                'xp_rating': 750
                }
            )

        # Magma Mephit
        self.assertEquals(
            self.machine.computeMonsterChallengeRating(
                hit_points=22,
                armor_class=11,
                # Fire Breath
                average_damage=7,
                attack_bonus=0,
                spell_dc=11,
                cr_boost=1
                ),
            {
                'challenge_rating': 0.5,
                'challenge_rating_precise': 0.375,
                'proficiency': 2,
                'xp': 100,
                'xp_rating': 75
                }
            )

if __name__ == '__main__':
    unittest.main()
