#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import unittest
import coverage

testDir = os.path.dirname(__file__)
appDir = os.path.abspath(os.path.join(testDir, '..'))

loader = unittest.TestLoader()
suite = loader.discover(testDir)
cov = coverage.coverage(branch=True, source=[appDir], omit=[testDir])

runner = unittest.TextTestRunner(verbosity=2)
cov.start()
result = runner.run(suite)
if result.wasSuccessful():
    cov.stop()
    print('Coverage Summary:')
    cov.report(show_missing=True)
    cov.html_report(directory='coverage')
    cov.erase()
    sys.exit(0)

sys.exit(1)
