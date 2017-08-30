#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys

import unittest

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..', 'dndmachine'
    )))

loader = unittest.TestLoader()
suite = loader.discover('tests')

runner = unittest.TextTestRunner()
runner.run(suite)