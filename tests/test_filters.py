import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

import dndmachine.filters as filters

class FiltersTestCase(unittest.TestCase):

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def testFilterMax(self):
        self.assertEquals(
            filters.filter_max([10, 10, 9]), 10)
        self.assertEquals(
            filters.filter_max([9, 10, 10]), 10)
        self.assertEquals(
            filters.filter_max([9, 11.0, 10.0]), 11.0)

    def testFilterSanitize(self):
        self.assertEquals(
            filters.filter_sanitize("F00$.Ba_ll"), 'F00_Ba_ll')

    def testFilterUnique(self):
        self.assertEquals(
            list(filters.filter_unique([
                'foo',
                'bar',
                'foo'
                ])),
            [(1, 'bar'), (2, 'foo')]
            )
        self.assertEquals(
            list(filters.filter_unique([
                {'foo': 1, 'FOO': 2},
                {'bar': 3, 'BAR': 4},
                {'foo': 1, 'FOO': 2}
                ])),
            [(2, {'FOO': 2, 'foo': 1}), (1, {'BAR': 4, 'bar': 3})]
            )

    def testFilterFieldTitle(self):
        self.assertEquals(
            filters.filter_field_title('examples'),
            'Examples'
            )
        self.assertEquals(
            filters.filter_field_title('test.case.examples'),
            'Examples'
            )
        self.assertEquals(
            filters.filter_field_title('test.case.examples.+'),
            'Examples'
            )
        self.assertEquals(
            filters.filter_field_title('test.case.examples[]'),
            'Examples'
            )

    def testFilterBonus(self):
        self.assertEquals(
            filters.filter_bonus(-1),
            '-1'
            )
        self.assertEquals(
            filters.filter_bonus(0),
            '0'
            )
        self.assertEquals(
            filters.filter_bonus(1),
            '+1'
            )

    def testFilterClassify(self):
        self.assertEquals(
            filters.filter_classify(1, {'one': 1, 'two': 2, 'three': 3}),
            'one'
            )
        self.assertEquals(
            filters.filter_classify(4, {'one': 1, 'two': 2, 'three': 3}),
            'three'
            )
        self.assertEquals(
            filters.filter_classify(25, {'ten': 10, 'twenty': 20, 'thirty': 30}),
            'twenty'
            )

    def testFilterCompleted(self):
        self.assertEquals(
            list(filters.filter_completed(['one', 'two', 'three'], [])),
            [('one', False, True), ('two', False, False), ('three', False, False)],
            "Nothing completed, start with 'one'"
            )
        self.assertEquals(
            list(filters.filter_completed(['one', 'two', 'three'], ['one'])),
            [('one', True, False), ('two', False, True), ('three', False, False)],
            "'one' completed, continue with 'two'"
            )
        self.assertEquals(
            list(filters.filter_completed(['one', 'two', 'three'], ['one', 'two'])),
            [('one', True, False), ('two', True, False), ('three', False, True)],
            "'one', and 'two' completed, continue with 'three'"
            )
        self.assertEquals(
            list(filters.filter_completed(['one', 'two', 'three'], ['one', 'two', 'three'])),
            [('one', True, False), ('two', True, False), ('three', True, False)],
            "All completed, nothing left"
            )

if __name__ == '__main__':
    unittest.main()
