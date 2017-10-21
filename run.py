#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

from dndmachine.app import app
from optparse import OptionParser

parser = OptionParser("""D&D Machine Web App""")

parser.add_option("--host", dest="host", default="127.0.0.1",
                  metavar="HOST",
                  help="Bind to IP or Host [default %default]")

parser.add_option("--port", dest="port", default=8080,
                  metavar="PORT", type=int,
                  help="Use this port [default %default]")

parser.add_option("--debug", dest="debug", default=False,
                  action="store_false",
                  help="Enable debugging [default: %default]")

parser.add_option("--ssl-key", dest="ssl_key", default=None,
                  help="Enable SSL using this key [default: %default]")
parser.add_option("--ssl-crt", dest="ssl_crt", default=None,
                  help="Enable SSL using this crt [default: %default]")

(options, args) = parser.parse_args()

args = {
    "host": options.host,
    "port": options.port,
    "debug": options.debug,
    "threaded": not options.debug
    }
context = (options.ssl_crt, options.ssl_key)
if all(context):
    args['ssl_context'] = context

app.run(**args)
