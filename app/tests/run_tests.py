#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import unittest
import coverage

appDir = os.path.abspath(os.path.join(
    os.path.dirname(__file__),
    '..'
    ))

loader = unittest.TestLoader()
suite = loader.discover(os.path.join(appDir, 'tests'))
cov = coverage.coverage(branch=True, source=[appDir])

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
