import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from models.base import JsonObject

class TestJsonObject(JsonObject):
    _pathPrefix = "test"
    _defaultConfig = {
        "default": {
            "unicode": "Unicode string",
            "float": 1.5,
            "int": 7
            },
        "int": {
            "list": [1, 2],
            "dict": {
                "one": 1,
                "two": 2
                }
            },
        "string": {
            "list": [
                "foo",
                "bar"
            ],
            "dict": {
                "one": "foo",
                "two": "bar"
                }
            }
        }
    _defaultFieldType = str
    _fieldTypes = {
        "default": {
            # unicode through default type
            "float": float,
            "int": int
            },
        "int": {
            "list": int,
            "dict": {
                "*": int
                }
            },
        "string": {
            "list": str,
            "dict": {
                '*': str
                }
            }
        }

class JsonObjectTestCase(unittest.TestCase):

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_init(self):
        obj = TestJsonObject({
            "default": {"float": "3.0"},
            "new_field": "foo bar"
            })
        self.assertEqual(obj.config, {
            "default": {
                "unicode": "Unicode string",
                "float": 3.0,
                "int": 7
                },
            "int": {
                "list": [1, 2],
                "dict": {
                    "one": 1,
                    "two": 2
                    }
                },
            "string": {
                "list": [
                    "foo",
                    "bar"
                ],
                "dict": {
                    "one": "foo",
                    "two": "bar"
                    }
                },
            "new_field": "foo bar"
            })

    def test_getPath(self):
        obj = TestJsonObject()
        self.assertEqual(obj.getPath('default.unicode'), "Unicode string")
        self.assertEqual(obj.getPath('default.float'), 1.5)
        self.assertEqual(obj.getPath('default.int'), 7)
        self.assertEqual(obj.getPath('int.list.0'), 1)
        self.assertEqual(obj.getPath('int.dict.one'), 1)
        self.assertEqual(obj.getPath('string.list.1'), "bar")
        self.assertEqual(obj.getPath('string.dict.two'), "bar")

    def test_setPath(self):
        obj = TestJsonObject()
        obj.setPath('new_field', "foo bar")
        obj.setPath('default.float', "3.0")
        obj.setPath('default.new', "hello")
        obj.setPath('int.list.+', "5")
        obj.setPath('int.list.1', "10")
        obj.setPath('string.list.+', "new")
        obj.setPath('string.list.1', "changed")
        obj.setPath('int.dict.add', "5")
        obj.setPath('int.dict.two', "10")
        obj.setPath('string.dict.add', "new")
        obj.setPath('string.dict.two', "changed")

        self.assertEqual(obj.config, {
            "default": {
                "unicode": "Unicode string",
                "float": 3.0,
                "int": 7,
                "new": "hello"
                },
            "int": {
                "list": [1, 10, 5],
                "dict": {
                    "one": 1,
                    "two": 10,
                    "add": 5
                    }
                },
            "string": {
                "list": [
                    "foo",
                    "changed",
                    "new"
                ],
                "dict": {
                    "one": "foo",
                    "two": "changed",
                    "add": "new"
                    }
                },
            "new_field": "foo bar"
            })

    def test_getItem(self):
        obj = TestJsonObject()
        self.assertEqual(obj['default.unicode'], "Unicode string")
        self.assertEqual(obj['default.float'], 1.5)
        self.assertEqual(obj['default.int'], 7)
        self.assertEqual(obj['int.list.0'], 1)
        self.assertEqual(obj['int.dict.one'], 1)
        self.assertEqual(obj['string.list.1'], "bar")
        self.assertEqual(obj['string.dict.two'], "bar")

    def test_setItem(self):
        obj = TestJsonObject()
        obj['new_field'] = "foo bar"
        obj['default.float'] = "3.0"
        obj['default.new'] = "hello"
        obj['int.list.+'] = "5"
        obj['int.list.1'] = "10"
        obj['string.list.+'] = "new"
        obj['string.list.1'] = "changed"
        obj['int.dict.add'] = "5"
        obj['int.dict.two'] = "10"
        obj['string.dict.add'] = "new"
        obj['string.dict.two'] = "changed"

        self.assertEqual(obj.config, {
            "default": {
                "unicode": "Unicode string",
                "float": 3.0,
                "int": 7,
                "new": "hello"
                },
            "int": {
                "list": [1, 10, 5],
                "dict": {
                    "one": 1,
                    "two": 10,
                    "add": 5
                    }
                },
            "string": {
                "list": [
                    "foo",
                    "changed",
                    "new"
                ],
                "dict": {
                    "one": "foo",
                    "two": "changed",
                    "add": "new"
                    }
                },
            "new_field": "foo bar"
            })

    def test_getAttribute(self):
        obj = TestJsonObject()
        self.assertEqual(obj.defaultUnicode, "Unicode string")
        self.assertEqual(obj.defaultFloat, 1.5)
        self.assertEqual(obj.defaultInt, 7)
        self.assertEqual(obj.intList0, 1)
        self.assertEqual(obj.intDictOne, 1)
        self.assertEqual(obj.stringList1, "bar")
        self.assertEqual(obj.stringDictTwo, "bar")

    def test_setAttribute(self):
        obj = TestJsonObject()
        obj.new_field = "foo bar"
        obj.defaultFloat = "3.0"
        obj.defaultNew = "hello"
        obj.intList.append(5)
        obj.intList1 = "10"
        obj.stringList.append("new")
        obj.stringList1 = "changed"
        obj.intDictAdd = "5"
        obj.intDictTwo = "10"
        obj.stringDictAdd = "new"
        obj.stringDictTwo = "changed"

        self.assertEqual(obj.config, {
            "default": {
                "unicode": "Unicode string",
                "float": 3.0,
                "int": 7,
                "new": "hello"
                },
            "int": {
                "list": [1, 10, 5],
                "dict": {
                    "one": 1,
                    "two": 10,
                    "add": 5
                    }
                },
            "string": {
                "list": [
                    "foo",
                    "changed",
                    "new"
                ],
                "dict": {
                    "one": "foo",
                    "two": "changed",
                    "add": "new"
                    }
                },
            "new_field": "foo bar"
            })

    def test_updateFromPost(self):
        obj = TestJsonObject()
        obj.updateFromPost({
            'test.new_field': "foo bar",
            'test.default.float': "3.0",
            'test.default.new': "hello",
            'test.int.list': ["5"],
            'test.string.list': ["changed"],
            'test.int.dict.add': "5",
            'test.int.dict.two': "10",
            'test.string.dict.add': "new",
            'test.string.dict.two': "changed"
            })

        self.assertEqual(obj.config, {
            "default": {
                "unicode": "Unicode string",
                "float": 3.0,
                "int": 7,
                "new": "hello"
                },
            "int": {
                "list": [5],
                "dict": {
                    "one": 1,
                    "two": 10,
                    "add": 5
                    }
                },
            "string": {
                "list": ["changed"],
                "dict": {
                    "one": "foo",
                    "two": "changed",
                    "add": "new"
                    }
                },
            "new_field": "foo bar"
            })

    def test_update(self):
        obj = TestJsonObject()
        obj.update({
            'new_field': "foo bar",
            'default': {
                'float': "3.0",
                'new': "hello"
                },
            'int': {
                'list': ["5"],
                'dict': {
                    'add': "5",
                    'two': "10"
                    }
                },
            'string': {
                'list': ["new"],
                'dict': {
                    'add': "new",
                    'two': "changed"
                    }
                }
            })

        self.assertEqual(obj.config, {
            "default": {
                "float": 3.0,
                "new": "hello"
                },
            "int": {
                "list": [5],
                "dict": {
                    "two": 10,
                    "add": 5
                    }
                },
            "string": {
                "list": ["new"],
                "dict": {
                    "two": "changed",
                    "add": "new"
                    }
                },
            "new_field": "foo bar"
            })

    def test_create(self):
        obj = TestJsonObject({
            'new_field': "foo bar",
            'default': {
                'new': "hello",
                'float': "3.0",
                },
            'int': {
                'list': ["5"],
                'dict': {
                    'add': "5",
                    'two': "10"
                    }
                },
            'string': {
                'list': [
                    "foo",
                    "changed",
                    "new"
                    ],
                'dict': {
                    'add': "new",
                    'two': "changed"
                    }
                }
            })

        self.assertEqual(obj.config, {
            "default": {
                "unicode": "Unicode string",
                "float": 3.0,
                "int": 7,
                "new": "hello"
                },
            "int": {
                "list": [5],
                "dict": {
                    "one": 1,
                    "two": 10,
                    "add": 5
                    }
                },
            "string": {
                "list": [
                    "foo",
                    "changed",
                    "new"
                ],
                "dict": {
                    "one": "foo",
                    "two": "changed",
                    "add": "new"
                    }
                },
            "new_field": "foo bar"
            })

if __name__ == '__main__':
    unittest.main()
