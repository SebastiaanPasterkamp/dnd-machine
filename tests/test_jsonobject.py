import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from dndmachine.models.base import JsonObject

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
                "list": [1, 2],
                "dict": {
                    "one": "foo",
                    "two": "bar"
                    }                },
            keepFields = ['keepme'],
            fieldTypes = {
                "default": {
                    "float": float,
                    "int": int
                    },
                "list": int,
                "dict": unicode
                }
            )

class JsonObjectTestCase(unittest.TestCase):

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_init(self):
        obj = TestJsonObject({
            "default": {"float": 3.0},
            "new_field": "foo bar"
            })
        self.assertIn('default', obj.config)
        self.assertIn('unicode', obj.config["default"])
        self.assertIn('new_field', obj.config)
        self.assertEquals(
            obj.config['default']['unicode'], u"Unicode string")
        self.assertEquals(obj.config['default']['float'], 3.0)
        self.assertEquals(obj.config['default']['int'], 7)
        self.assertEquals(obj.config['new_field'], u"foo bar")

    def test_getPath(self):
        obj = TestJsonObject({
            "default": {"float": 3.0},
            "new_field": "foo bar"
            })
        self.assertEquals(
            obj.getPath('default.unicode'), u"Unicode string")
        self.assertEquals(obj.getPath('default.float'), 3.0)
        self.assertEquals(obj.getPath('default.int'), 7)
        self.assertEquals(obj.getPath('new_field'), u"foo bar")
        self.assertEquals(obj.getPath('list.0'), 1)
        self.assertEquals(obj.getPath('list.1'), 2)
        self.assertEquals(obj.getPath('dict.one'), u"foo")
        self.assertEquals(obj.getPath('dict.two'), u"bar")

    def test_setPath(self):
        obj = TestJsonObject()
        obj.setPath('new_field', "foo bar")
        obj.setPath('default.float', 3.0)
        obj.setPath('default.new', u"hello")
        obj.setPath('list.1', 5)
        obj.setPath('list.4', 10)

        self.assertEquals(obj.config['new_field'], u"foo bar")
        self.assertEquals(obj.config['default']['float'], 3.0)
        self.assertEquals(obj.config['default']['new'], u"hello")
        self.assertEquals(obj.config['list'][1], 5)
        self.assertEquals(obj.config['list'][4], 10)

    def test_getItem(self):
        obj = TestJsonObject({
            "default": {"float": 3.0},
            "new_field": "foo bar"
            })
        self.assertEquals(
            obj['default.unicode'], u"Unicode string")
        self.assertEquals(obj['default.float'], 3.0)
        self.assertEquals(obj['default.int'], 7)
        self.assertEquals(obj['new_field'], u"foo bar")
        self.assertEquals(obj['list.0'], 1)
        self.assertEquals(obj['list.1'], 2)
        self.assertEquals(obj['dict.one'], u"foo")
        self.assertEquals(obj['dict.two'], u"bar")

    def test_setItem(self):
        obj = TestJsonObject()
        obj['new_field'] = "foo bar"
        obj['default.float'] = 3.0
        obj['default.new'] = u"hello"
        obj['list.1'] = 5
        obj['list.4'] = 10

        self.assertEquals(obj.config['new_field'], u"foo bar")
        self.assertEquals(obj.config['default']['float'], 3.0)
        self.assertEquals(obj.config['default']['new'], u"hello")
        self.assertEquals(obj.config['list'][1], 5)
        self.assertEquals(obj.config['list'][4], 10)

    def test_getAttribute(self):
        obj = TestJsonObject()
        self.assertEquals(obj.defaultUnicode, u"Unicode string")
        self.assertEquals(obj.defaultFloat, 1.5)
        self.assertEquals(obj.defaultInt, 7)
        self.assertEquals(obj.dictOne, u"foo")
        self.assertEquals(obj.dictTwo, u"bar")
        self.assertEquals(obj.list0, 1)
        self.assertEquals(obj.list1, 2)

    def test_setAttribute(self):
        obj = TestJsonObject()
        obj.new_field = "foo bar"
        obj.defaultFloat = 13.0
        obj.defaultNew = u"hello"
        obj.list1 = 5
        obj.list4 = 10

        self.assertEquals(obj.config['new_field'], u"foo bar")
        self.assertEquals(obj.config['default']['float'], 13.0)
        self.assertEquals(obj.config['default']['new'], u"hello")
        self.assertEquals(obj.config['list'][1], 5)
        self.assertEquals(obj.config['list'][4], 10)

    def test_updateFromPost(self):
        obj = TestJsonObject({
            'keepme': u"foo",
            'forgetme': u"bar"
            })
        obj.updateFromPost({
            'test.new_field': 'foo bar',
            'test.default.float': '13.0',
            'test.default.new': 'hello',
            'test.list.0': '5',
            'test.list.1': '10',
            'test.list.+': '15'
            })

        self.assertEquals(obj.config['new_field'], u"foo bar")
        self.assertEquals(obj.config['default']['float'], 13.0)
        self.assertEquals(obj.config['default']['new'], u"hello")
        self.assertEquals(obj.config['list'], [5, 10, 15])
        self.assertIn('keepme', obj)
        self.assertNotIn('forgetme', obj.config)
        self.assertEquals(obj.config['keepme'], u"foo")

if __name__ == '__main__':
    unittest.main()