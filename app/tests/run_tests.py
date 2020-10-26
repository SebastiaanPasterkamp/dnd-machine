#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import unittest
import coverage
import argparse

testDir = os.path.dirname(__file__)
appDir = os.path.abspath(os.path.join(testDir, '..'))

loader = unittest.TestLoader()
suite = loader.discover(testDir)
cov = coverage.coverage(branch=True, source=[appDir], omit=[testDir])

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('--buffer', '-b', default=False, action='store_true',
                    help='The standard output and standard error streams are '
                    'buffered during the test run. Output during a passing '
                    'test is discarded. Output is echoed normally on test fail '
                    'or error and is added to the failure messages.')
parser.add_argument('--failfast', '-f', default=False, action='store_true',
                    help='Stop the test run on the first error or failure.')

args = vars(parser.parse_args())

runner = unittest.TextTestRunner(verbosity=2, **args)
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
