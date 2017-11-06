import unittest
import os
import sys

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from app.utils import markdownToToc

class UtilsTestCase(unittest.TestCase):

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def testMarkdownToToc(self):
        toc = markdownToToc("")
        self.assertIsInstance(toc, list)
        self.assertEquals(len(toc), 0)
        self.assertEquals(toc, [])

        toc = markdownToToc("\n".join([
            "# Main title",
            "",
            "Foo bar"
            ]))
        self.assertIsInstance(toc, list)
        self.assertEquals(len(toc), 1)
        self.assertIn('title', toc[0])
        self.assertNotIn('children', toc[0])
        self.assertEquals(toc, [{
            'title': 'Main title'
            }])

        toc = markdownToToc("\n".join([
            "# Main title",
            "",
            "Foo bar",
            "",
            "## Part 1",
            "",
            "Testing",
            "",
            "## Part 2"
            ]))
        self.assertIsInstance(toc, list)
        self.assertEquals(len(toc), 1)
        self.assertIn('title', toc[0])
        self.assertIn('children', toc[0])
        self.assertEquals(toc, [{
            'title': 'Main title',
            'children': [
                {'title': 'Part 1'},
                {'title': 'Part 2'}
                ]
            }])

        toc = markdownToToc("\n".join([
            "# Main title",
            "",
            "Foo bar",
            "",
            "## Level 2.a",
            "",
            "Testing",
            "",
            "## Level 2.b",
            "",
            "### Level 3.a",
            "",
            "More stuff",
            "",
            "### Level 3.b"
            ]))
        self.assertIsInstance(toc, list)
        self.assertEquals(len(toc), 1)
        self.assertEquals(toc, [{
            'title': 'Main title',
            'children': [
                {'title': 'Level 2.a'},
                {'title': 'Level 2.b', 'children': [
                    {'title': 'Level 3.a'},
                    {'title': 'Level 3.b'}
                    ]}
                ]
            }])

if __name__ == '__main__':
    unittest.main()