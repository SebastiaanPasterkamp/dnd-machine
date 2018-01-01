import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app.models.base import JsonObject

class TestJsonObject(JsonObject):
    def __init__(self, config={}):
        super(TestJsonObject, self).__init__(
            config,
            pathPrefix = "test",
            defaultConfig = {
                "default": {
                    "unicode": u"Unicode string",
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
                        u"foo",
                        u"bar"
                    ],
                    "dict": {
                        "one": u"foo",
                        "two": u"bar"
                        }
                    }
                },
            fieldTypes = {
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
                    "list": unicode,
                    "dict": unicode
                    }
                }
            )
        self.compute()

    def compute(self):
        pass

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
        self.assertIn('default', obj.config)
        self.assertIn('unicode', obj.config["default"])
        self.assertIn('new_field', obj.config)
        self.assertEquals(obj.config['default']['unicode'], u"Unicode string")
        self.assertEquals(obj.config['default']['float'], 3.0)
        self.assertEquals(obj.config['default']['int'], 7)
        self.assertEquals(obj.config['new_field'], u"foo bar")

    def test_getPath(self):
        obj = TestJsonObject()
        self.assertEquals(obj.getPath('default.unicode'), u"Unicode string")
        self.assertEquals(obj.getPath('default.float'), 1.5)
        self.assertEquals(obj.getPath('default.int'), 7)
        self.assertEquals(obj.getPath('int.list.0'), 1)
        self.assertEquals(obj.getPath('int.dict.one'), 1)
        self.assertEquals(obj.getPath('string.list.1'), u"bar")
        self.assertEquals(obj.getPath('string.dict.two'), u"bar")

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

        self.assertEquals(obj.config['new_field'], u"foo bar")
        self.assertEquals(obj.config['default']['float'], 3.0)
        self.assertEquals(obj.config['default']['new'], u"hello")
        self.assertEquals(obj.config['int']['list'], [1, 10, 5])
        self.assertEquals(obj.config['string']['list'], [u"foo", u"changed", u"new"])
        self.assertEquals(obj.config['int']['dict']["add"], 5)
        self.assertEquals(obj.config['int']['dict']["two"], 10)
        self.assertEquals(obj.config['string']['dict']["add"], u"new")
        self.assertEquals(obj.config['string']['dict']["two"], u"changed")

    def test_getItem(self):
        obj = TestJsonObject()
        self.assertEquals(obj['default.unicode'], u"Unicode string")
        self.assertEquals(obj['default.float'], 1.5)
        self.assertEquals(obj['default.int'], 7)
        self.assertEquals(obj['int.list.0'], 1)
        self.assertEquals(obj['int.dict.one'], 1)
        self.assertEquals(obj['string.list.1'], u"bar")
        self.assertEquals(obj['string.dict.two'], u"bar")

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

        self.assertEquals(obj.config['new_field'], u"foo bar")
        self.assertEquals(obj.config['default']['float'], 3.0)
        self.assertEquals(obj.config['default']['new'], u"hello")
        self.assertEquals(obj.config['int']['list'], [1, 10, 5])
        self.assertEquals(obj.config['string']['list'], [u"foo", u"changed", u"new"])
        self.assertEquals(obj.config['int']['dict']["add"], 5)
        self.assertEquals(obj.config['int']['dict']["two"], 10)
        self.assertEquals(obj.config['string']['dict']["add"], u"new")
        self.assertEquals(obj.config['string']['dict']["two"], u"changed")

    def test_getAttribute(self):
        obj = TestJsonObject()
        self.assertEquals(obj.defaultUnicode, u"Unicode string")
        self.assertEquals(obj.defaultFloat, 1.5)
        self.assertEquals(obj.defaultInt, 7)
        self.assertEquals(obj.intList0, 1)
        self.assertEquals(obj.intDictOne, 1)
        self.assertEquals(obj.stringList1, u"bar")
        self.assertEquals(obj.stringDictTwo, u"bar")

    def test_setAttribute(self):
        obj = TestJsonObject()
        obj.new_field = "foo bar"
        obj.defaultFloat = "3.0"
        obj.defaultNew = "hello"
        obj.intList.append(5)
        obj.intList1 = "10"
        obj.stringList.append(u"new")
        obj.stringList1 = "changed"
        obj.intDictAdd = "5"
        obj.intDictTwo = "10"
        obj.stringDictAdd = "new"
        obj.stringDictTwo = "changed"

        self.assertEquals(obj.config['new_field'], u"foo bar")
        self.assertEquals(obj.config['default']['float'], 3.0)
        self.assertEquals(obj.config['default']['new'], u"hello")
        self.assertEquals(obj.config['int']['list'], [1, 10, 5])
        self.assertEquals(obj.config['string']['list'], [u"foo", u"changed", u"new"])
        self.assertEquals(obj.config['int']['dict']["add"], 5)
        self.assertEquals(obj.config['int']['dict']["two"], 10)
        self.assertEquals(obj.config['string']['dict']["add"], u"new")
        self.assertEquals(obj.config['string']['dict']["two"], u"changed")

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

        self.assertEquals(obj.config['new_field'], u"foo bar")
        self.assertEquals(obj.config['default']['float'], 3.0)
        self.assertEquals(obj.config['default']['new'], u"hello")
        self.assertEquals(obj.config['int']['list'], [5])
        self.assertEquals(obj.config['string']['list'], [u"changed"])
        self.assertEquals(obj.config['int']['dict']["add"], 5)
        self.assertEquals(obj.config['int']['dict']["two"], 10)
        self.assertEquals(obj.config['string']['dict']["add"], u"new")
        self.assertEquals(obj.config['string']['dict']["two"], u"changed")

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

        self.assertEquals(obj.config['new_field'], u"foo bar")
        self.assertEquals(obj.config['default']['float'], 3.0)
        self.assertEquals(obj.config['default']['new'], u"hello")
        self.assertEquals(obj.config['int']['list'], [5])
        self.assertEquals(obj.config['string']['list'], [u"new"])
        self.assertEquals(obj.config['int']['dict']["add"], 5)
        self.assertEquals(obj.config['int']['dict']["two"], 10)
        self.assertEquals(obj.config['string']['dict']["add"], u"new")
        self.assertEquals(obj.config['string']['dict']["two"], u"changed")

    def test_create(self):
        obj = TestJsonObject({
            'new_field': "foo bar",
            'default': {
                'new': "hello",
                'float': "3.0",
                },
            'int': {
                'list': ["5"],
                },
            'string': {
                'dict': {
                    'add': "new",
                    'two': "changed"
                    }
                }
            })

        self.assertEquals(obj.config, {
            'new_field': u"foo bar",
            "default": {
                'new': u"hello",
                "unicode": u"Unicode string",
                "float": 3.0,
                "int": 7
                },
            "int": {
                "list": [5],
                "dict": {
                    "one": 1,
                    "two": 2
                    }
                },
            "string": {
                "list": [
                    u"foo",
                    u"bar"
                ],
                "dict": {
                    "add": u"new",
                    "one": u"foo",
                    "two": u"changed"
                    }
                }
            })

if __name__ == '__main__':
    unittest.main()
