#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
from optparse import OptionParser, OptionGroup

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), 'app'
    )))

from app.app import (
    create_app,
    migrate,
    initdb,
    updatedb,
    import_sql,
    dump_table,
    )
from config import get_config

config = get_config()

def changeConfig(option, opt, value, parser):
    (key, val) = value.split('=', 1)
    config[key] = val

parser = OptionParser("""D&D Machine Web App""")

parser.add_option("--host", default="127.0.0.1", metavar="HOST",
                  help="Bind to IP or Host [default %default]")

parser.add_option("--port", default=5000, metavar="PORT", type=int,
                  help="Use this port [default %default]")

parser.add_option("--debug", default=False, action="store_true",
                  help="Enable debugging [default: %default]")

parser.add_option("--threaded", default=False, action="store_true",
                  help="Enable multithreading [default: %default]")

parser.add_option("--config", default={}, type='string', action="callback",
                  callback=changeConfig,
                  metavar="FIELD=value", help="Change config parameters.")


group = OptionGroup(parser, "Enable SSL")

group.add_option("--ssl-adhoc", default=False, action="store_true",
                 help="Enable development SSL usage [default: %default]")

group.add_option("--ssl-key", default=None,
                 help="Enable SSL using this key [default: %default]")

group.add_option("--ssl-crt", default=None,
                 help="Enable SSL using this crt [default: %default]")

parser.add_option_group(group)


group = OptionGroup(parser, "Optional arguments")

group.add_option("--migrate", default=False, action="store_true",
                 help="Migrate Objects to new version. Then exit.")

group.add_option("--initdb", default=False, action="store_true",
                 help="Initialize the database. Then exit.")

group.add_option("--updatedb", default=False, action="store_true",
                 help="Update database schema. Then exit.")

group.add_option("--force-skipped", default=False, action="store_true",
                 help="Force executing database update versions that have been "
                 "skipped. Used with --updatedb.")

group.add_option("--import-sql", default=None, metavar="FILE",
                 help="Import custom SQL into the database."
                 " Then exit.")

group.add_option("--migrate-object", default=[], action="append",
                 help="Migrate only these Objects to new version."
                 " Then exit.")

group.add_option("--dump-table", default=None,
                 help="Dump database content to console. Then exit.")

parser.add_option_group(group)

(options, args) = parser.parse_args()

app = create_app(config)

if __name__ == '__main__':
    args = {
        "host": options.host,
        "port": options.port,
        "debug": options.debug,
        "threaded": options.threaded,
        }
    context = (options.ssl_crt, options.ssl_key)
    if all(context):
        args['ssl_context'] = context
    elif options.ssl_adhoc:
        args['ssl_context'] = "adhoc"

    if options.initdb:
        print('Initializing the database.')
        initdb(app)
        print('Initialized the database.')
        exit()

    if options.updatedb:
        print('Updating the database.')
        updatedb(app, options.force_skipped)
        print('Updated the database.')
        exit()

    if options.import_sql:
        print('Importing custom SQL into the database.')
        import_sql(app, options.import_sql)
        print('Imported custom SQL into the database.')
        exit()

    if options.migrate or options.migrate_object:
        print('Migrating objects.')
        migrate(app, options.migrate_object)
        print('Migrated objects.')
        exit()

    if options.dump_table:
        dump_table(app, options.dump_table)
        exit()

    app.run(**args)
