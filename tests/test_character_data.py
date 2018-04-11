import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app.config import get_character_data

class CharacterDataTestCase(unittest.TestCase):

    def setUp(self):
        self.config = get_character_data()

    def tearDown(self):
        pass

    def testConfig(self):
        struct = {
            'race': {
                'instance': list,
                'required': True,
                'callback': lambda r, p: self.verifyStruct(r, {
                    'name': {
                        'instance': unicode,
                        'required': True,
                        },
                    'filename': {
                        'instance': unicode,
                        },
                    'description': {
                        'instance': unicode,
                        'required': True,
                        },
                    'sub': {
                        'instance': list,
                        'callback': self.checkSubrace,
                        },
                    'phases': {
                        'instance': dict,
                        'required': True,
                        'callback': self.checkPhase,
                        },
                    }, p),
                },
            'class': {
                'instance': list,
                'required': True,
                'callback': lambda c, p: self.verifyStruct(c, {
                    'name': {
                        'instance': unicode,
                        'required': True,
                        },
                    'filename': {
                        'instance': unicode,
                        },
                    'description': {
                        'instance': unicode,
                        'required': True,
                        },
                    'phases': {
                        'instance': dict,
                        'required': True,
                        'callback': lambda d, p: self.checkPhase(
                            d, p, True
                            )
                        },
                    }, p),
                },
            'background': {
                'instance': list,
                'required': True,
                'callback': lambda b, p: self.verifyStruct(b, {
                    'name': {
                        'instance': unicode,
                        'required': True,
                        },
                    'filename': {
                        'instance': unicode,
                        },
                    'description': {
                        'instance': unicode,
                        'required': True,
                        },
                    'phases': {
                        'instance': dict,
                        'required': True,
                        'callback': self.checkPhase,
                        },
                    }, p),
                },
            }
        character_data = get_character_data()
        self.verifyStruct(
            character_data,
            struct,
            []
            )


    def verifyStruct(self, data, struct, path):
        name = '.'.join(path)

        self.assertIsInstance(
            data, dict,
            '%s, verifyStruct Expected dict' % name
            )

        for key in data.keys():
            self.assertIn(
                key, struct,
                "Unexpected key '%s' in %r" % (
                    key, name
                    )
                )

        for key, settings in struct.items():
            p = path + [data.get('label', key)]
            name = '.'.join(p)

            if 'required' in settings:
                self.assertIn(
                    key, data,
                    "%s: Expected in '%r %r" % (key, name, struct)
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
                    }
                }
        self.verifyStruct(phase, struct, path)


    def checkOption(self, option, path):
        struct = {
            'label': {
                'instance': unicode,
                'required': True,
                },
            'description': {
                'instance': unicode,
                },
            'config': {
                'instance': list,
                'required': True,
                'callback': self.checkConfig,
                },
            }
        self.verifyStruct(option, struct, path)


    def checkConfig(self, config, path):
        typeSpecific = {
            'list': {
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
                'filter': {
                    'instance': dict,
                    },
                'limit': {
                    'instance': int,
                    },
                'replace': {
                    'instance': int,
                    },
                'limit_formula': {
                    'instance': unicode,
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
                'config': {
                    'instance': list,
                    'required': True,
                    'callback': self.checkConfig,
                    },
                },
            'value': {
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
                }
            }
        base = {
            'hidden': {
                'instance': bool,
                },
            'hidden_formula': {
                'instance': unicode,
                },
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


    def checkSubrace(self, subrace, path):
        struct = {
            'name': {
                'instance': unicode,
                'required': True,
                },
            'phases': {
                'instance': dict,
                'callback': self.checkPhase,
                },
            }
        self.verifyStruct(subrace, struct, path)


if __name__ == '__main__':
    unittest.main()
