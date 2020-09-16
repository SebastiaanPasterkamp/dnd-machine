import unittest
import os
import sys
import json

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..'
    )))

from basemodeltest import BaseModelTestCase

from models.character import CharacterObject

class CharacterObjectTestCase(BaseModelTestCase):
    obj = CharacterObject

    def testRecompute(self):
        examples = [
            ("Blank Character", "test-blank.json"),
            ("Elven Wizard", "test-wizard.json"),
            ("Dwarven Warior", "test-warior.json"),
            ("Unconfigured Level 5 Elven Wizard", "test-wizard-level-5.json"),
            ("Configured Level 6 Elven Wizard", "test-wizard-level-6.json"),
            ]
        for name, filename in examples:
            with self.subTest(msg=name, filename=filename):
                char = self.load_from_file(filename)
                char.migrate(self.app.datamapper)
                orig = char.clone()
                self.write_to_file(orig, "expected." + filename)
                char.recompute(self.app.datamapper)
                updated = char.clone()
                self.write_to_file(updated, "actual." + filename)
                self.assertDeepEqual(orig, updated)

if __name__ == '__main__':
    unittest.main()
