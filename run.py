#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
from optparse import OptionParser, OptionGroup

from app.app import app, migrate, updatedb, dump_table

parser = OptionParser("""D&D Machine Web App""")

parser.add_option("--host", dest="host", default="127.0.0.1",
                  metavar="HOST",
                  help="Bind to IP or Host [default %default]")

parser.add_option("--port", dest="port", default=8080,
                  metavar="PORT", type=int,
                  help="Use this port [default %default]")

parser.add_option("--debug", dest="debug", default=False,
                  action="store_true",
                  help="Enable debugging [default: %default]")

parser.add_option("--threaded", dest="threaded", default=False,
                  action="store_true",
                  help="Enable multithreading [default: %default]")

group = OptionGroup(parser, "Enable SSL")
group.add_option("--ssl-key", dest="ssl_key", default=None,
                 help="Enable SSL using this key [default: %default]")
group.add_option("--ssl-crt", dest="ssl_crt", default=None,
                 help="Enable SSL using this crt [default: %default]")
parser.add_option_group(group)

group = OptionGroup(parser, "Optional arguments")
group.add_option("--migrate", dest="migrate", default=False,
                 action="store_true",
                 help="Migrate Objects to new version. Then exit.")
group.add_option("--update-db", dest="update_db", default=False,
                 action="store_true",
                 help="Update database schema. Then exit.")
group.add_option("--dump-table", dest="dump_table", default=None,
                 help="Dump database content to console. Then exit.")
parser.add_option_group(group)

(options, args) = parser.parse_args()
sys.argv = [sys.argv[0]] + args

args = {
    "host": options.host,
    "port": options.port,
    "debug": options.debug,
    "threaded": options.threaded
    }
context = (options.ssl_crt, options.ssl_key)
if all(context):
    args['ssl_context'] = context

if options.migrate:
    migrate()
    exit()

if options.update_db:
    updatedb()
    exit()

if options.dump_table:
    for line in dump_table(options.dump_table):
        print line
    exit()

app.run(**args)
