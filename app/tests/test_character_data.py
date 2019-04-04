import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from config import get_character_data

class CharacterDataTestCase(unittest.TestCase):

    def setUp(self):
        self.config = get_character_data()

    def tearDown(self):
        pass

    def testMainConfig(self):
        self.assertEquals(
            ['race', 'class', 'background', 'sets'],
            self.config.keys()
            )
        for name, config in self.config.items():
            if name == "sets":
                self.assertIsInstance(
                    config, dict,
                    'Expectd config.%s to be a dict' % name
                    )
            else:
                self.assertIsInstance(
                    config, list,
                    'Expectd config.%s to be a list' % name
                    )

    def testRaceConfig(self):
        structure = {
            'label': {
                'instance': unicode,
                'required': True,
                },
            'description': {
                'instance': unicode,
                'required': True,
                },
            'type': {
                'one-of': ['config'],
                'required': True,
                },
            'config': {
                'instance': list,
                'required': True,
                'callback': self.checkConfig,
                },
            'phases': {
                'instance': dict,
                'required': False,
                'callback': lambda d, p: self.checkPhase(
                    d, p, True
                    )
                },
            }
        for index, data in enumerate(self.config['race']):
            self.verifyStruct(data, structure, ['race', str(index)])

    def testClassConfig(self):
        structure = {
            'label': {
                'instance': unicode,
                'required': True,
                },
            'description': {
                'instance': unicode,
                'required': True,
                },
            'type': {
                'one-of': ['config'],
                'required': True,
                },
            'config': {
                'instance': list,
                'required': True,
                'callback': self.checkConfig,
                },
            'phases': {
                'instance': dict,
                'required': True,
                'callback': lambda d, p: self.checkPhase(
                    d, p, True
                    )
                },
            }
        for index, data in enumerate(self.config['class']):
            self.verifyStruct(data, structure, ['race', str(index)])

    def testBackgroundConfig(self):
        for index, data in enumerate(self.config['background']):
            self.checkConfig(data, ['background', str(index)])

    def testSetsConfig(self):
        for group, items in self.config['sets'].items():
            if "type" in items:
                self.checkConfig(items, ['sets', group])
            else:
                for name, item in items.items():
                    self.checkConfig(item, ['sets', group, name])


    def verifyStruct(self, data, struct, path):
        name = '.'.join(path)

        self.assertIsInstance(
            data, dict,
            '%s, verifyStruct Expected dict' % name
            )

        for key in data.keys():
            self.assertIn(
                key, struct,
                "Unexpected key '%s' in %r: %r" % (
                    key, name, data
                    )
                )

        for key, settings in struct.items():
            p = path + [data.get('label', key)]
            name = '.'.join(p)

            if settings.get('required', False):
                self.assertIn(
                    key, data,
                    "%s: Expected in '%r': %r" % (
                        key, name, data
                        )
                    )
            if key not in data:
                continue
            value = data[key]
            if 'instance' in settings:
                self.assertIsInstance(
                    value,
                    settings.get('instance'),
                    "%s: %r (%r) is instance of %r" % (
                        key, name, value,
                        settings.get('instance')
                        )
                    )
            if 'one-of' in settings:
                self.assertIn(
                    value,
                    settings.get('one-of'),
                    "%s: %r (%r) in %r" % (
                        key, name, value, settings.get('one-of')
                        )
                    )
            if 'subset' in settings:
                self.assertTrue(
                    set(value) <= set(settings.get('subset')),
                    "%s: %r (%r) subset of %r" % (
                        key, name, value, settings.get('subset')
                        )
                    )
            if 'callback' in settings:
                callback = settings['callback']
                if isinstance(value, list):
                    for vi, vdata in enumerate(value):
                        callback(vdata, p + ['c(%d)' % vi])
                elif isinstance(value, dict):
                    for vkey, vdata in value.items():
                        callback(vdata, p + ['c(%s)' % vkey])
                else:
                    callback(value, p + ['c()'])
            if 'struct' in settings:
                self.verifyStruct(
                    value,
                    settings['struct'],
                    p + ['v()']
                    )


    def checkPhase(self, phase, path, conditional=False):
        struct = {
            'config': {
                'instance': list,
                'required': True,
                'callback': self.checkConfig,
                },
            }
        if conditional:
            struct['conditions'] = {
                'instance': dict,
                'required': True,
                'struct': {
                    'level': {
                        'instance': int,
                        'required': True,
                        },
                    'creation': {
                        'instance': unicode,
                        },
                    'race': {
                        'instance': unicode,
                        },
                    'class': {
                        'instance': unicode,
                        },
                    'path': {
                        'instance': list,
                        },
                    'college': {
                        'instance': list,
                        },
                    'domain': {
                        'instance': list,
                        },
                    'archetype': {
                        'instance': list,
                        },
                    'oath': {
                        'instance': list,
                        },
                    'origin': {
                        'instance': list,
                        },
                    'patron': {
                        'instance': list,
                        },
                    }
                }
        self.verifyStruct(phase, struct, path)


    def checkConfig(self, config, path):
        typeSpecific = {
            'list': {
                'hidden': {
                    'instance': bool,
                    },
                'described': {
                    'instance': bool,
                    },
                'hidden_formula': {
                    'instance': unicode,
                    },
                'given': {
                    'instance': list,
                    },
                'list': {
                    'instance': list,
                    'subset': [
                        'armor_types', 'armor', 'weapon_types',
                        'weapon', 'tools', 'spell', 'skills',
                        'trinket', 'statistics', 'items',
                        'languages', 'monster_types',
                        'humanoid_types', 'terrain_types',
                        ]
                    },
                'items': {
                    'instance': list,
                    },
                'filter': {
                    'instance': dict,
                    },
                'limit': {
                    'instance': int,
                    },
                'limit_formula': {
                    'instance': unicode,
                    },
                'replace': {
                    'instance': int,
                    },
                },
            'select': {
                'items': {
                    'instance': list,
                    'required': True,
                    },
                'limit': {
                    'instance': int,
                    },
                'limit_formula': {
                    'instance': unicode,
                    },
                },
            'config': {
                'path': {},
                'hidden': {
                    'instance': bool,
                    },
                'hidden_formula': {
                    'instance': unicode,
                    },
                'config': {
                    'instance': list,
                    'required': True,
                    'callback': self.checkConfig,
                    },
                },
            'value': {
                'hidden': {
                    'instance': bool,
                    },
                'hidden_formula': {
                    'instance': unicode,
                    },
                'value': {
                    'required': True,
                    },
                },
            'ability_score': {
                'path': {},
                'limit': {
                    'instance': int,
                    'required': True,
                    },
                },
            'choice': {
                'path': {},
                'options': {
                    'instance': list,
                    'required': True,
                    'callback': self.checkConfig,
                    },
                },
            'multichoice': {
                'path': {},
                'filter': {
                    'instance': dict,
                    },
                'limit': {
                    'instance': int,
                    },
                'replace': {
                    'instance': int,
                    },
                'options': {
                    'instance': list,
                    'required': True,
                    'callback': self.checkConfig,
                    },
                },
            'dict': {
                'hidden': {
                    'instance': bool,
                    },
                'hidden_formula': {
                    'instance': unicode,
                    },
                'dict': {
                    'instance': dict,
                    'required': True
                    },
                },
            }
        pathSpecific = {
            'equipment': {
                'multiple': {
                    'instance': bool,
                    'required': True,
                    'one-of': [True]
                    },
                'type': {
                    'instance': unicode,
                    'required': True,
                    'one-of': ['list'],
                    },
                }
            }
        base = {
            'label': {
                'instance': unicode,
                },
            'description': {
                'instance': unicode,
                },
            'path': {
                'instance': unicode,
                'required': True,
                },
            'type': {
                'instance': unicode,
                'required': True,
                'one-of': typeSpecific.keys(),
                },
            }

        self.assertIn('type', config, path)
        self.assertIn(config['type'], typeSpecific)
        struct = base.copy()
        struct.update(typeSpecific[ config['type'] ])
        if 'path' in config:
            struct.update(
                pathSpecific.get( config['path'], {} )
                )
        self.verifyStruct(config, struct, path)

        if config['type'] == 'list':
            need_one = ['given', 'limit', 'limit_formula', 'replace']
            self.assertTrue(
                any(f in config for f in need_one),
                "Need one of '%r' in '%r'" % (
                    need_one, config
                    )
                )
            if config.get('hidden', False):
                exclude = ['limit', 'limit_formula', 'replace']
                self.assertFalse(
                    any(f in config for f in exclude),
                    "Can't have one of '%r' in '%r'" % (
                        exclude, config
                        )
                    )

    def getSets(self, path):
        path = path.split('.')
        config = self.config['sets']
        for step in path:
            config = config[step]
        return config


if __name__ == '__main__':
    unittest.main()
