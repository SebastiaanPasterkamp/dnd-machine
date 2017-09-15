#!/usr/bin/env python
# -*- coding: utf-8 -*-

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

(options, args) = parser.parse_args()

app.run(
    host=options.host,
    port=options.port,
    debug=options.debug
    )
