#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys

import unittest
import coverage

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), 'app'
    )))

loader = unittest.TestLoader()
suite = loader.discover('tests')
cov = coverage.coverage(branch=True, source=['app'])

runner = unittest.TextTestRunner(verbosity=2)
cov.start()
result = runner.run(suite)
if result.wasSuccessful():
    cov.stop()
    print('Coverage Summary:')
    cov.report(show_missing=True)
    cov.erase()
