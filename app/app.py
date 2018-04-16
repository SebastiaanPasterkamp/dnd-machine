# -*- coding: utf-8 -*-
import os
import glob
from flask import Flask, request, session, g, redirect, \
    url_for, abort, render_template, jsonify, Markup
from werkzeug.utils import find_modules, import_string


from .models.base import JsonObjectDataMapper
from . import get_db, get_datamapper
from .config import get_item_data
import filters

def create_app(config={}):
    app = Flask(__name__)

    app.config.update(dict(
        DATABASE=os.path.join(app.root_path, 'flaskr.db'),
        SECRET_KEY=b'_5#y2L"F4Q8z\n\xec]/',
        USERNAME='admin',
        PASSWORD='default'
    ))
    app.config.update(config)
    app.config.from_envvar('FLASKR_SETTINGS', silent=True)

    register_blueprints(app, config)
    register_filters(app)
    register_cli(app)
    register_request_hooks(app)

    return app


def register_blueprints(app, config):
    """
    Auto detect blueprint modules
    """
    db = get_db(app)
    dm = get_datamapper(db)
    for name in find_modules('app.views', recursive=True):
        mod = import_string(name)
        url_prefix = '/'.join(
            name.replace('app.views', '').split('.')
            )
        if hasattr(mod, 'get_blueprint'):
            url_prefix, bp = mod.get_blueprint(dm, config)
            app.register_blueprint(bp, url_prefix=url_prefix)
        if hasattr(mod, 'with_app'):
            mod.with_app(app, dm, config)


def register_filters(app):
    """
    Auto detect filters
    """
    for func in dir(filters):
        if not func.startswith('filter_'):
            continue
        name = func.replace('filter_', '')
        app.jinja_env.filters[name] = getattr(filters, func)


def register_cli(app):
    """
    Register command line function calls
    """
    @app.cli.command('initdb')
    def initdb_command():
        print('Initializing the database.')
        db = get_db(app)
        _initdb(db)
        print('Initialized the database.')
    @app.cli.command('updatedb')
    def updatedb_command():
        print('Updating the database.')
        db = get_db(app)
        _updatedb(db)
        print('Updated the database.')
    @app.cli.command('migrate')
    def migrate_command():
        print('Migrating objects.')
        db = get_db(app)
        _migrate(db)
        print('Migrated objects.')
    @app.cli.command('dump-table')
    def dump_table_command(table):
        db = get_db(app)
        for line in _dump_table(db, table):
            print line

def initdb(app):
    with app.app_context():
        db = get_db(app)
        _initdb(db)

def updatedb(app):
    with app.app_context():
        db = get_db(app)
        _updatedb(db)

def migrate(app, objects=None):
    with app.app_context():
        db = get_db(app)
        _migrate(db, objects)

def dump_table(app, table):
    with app.app_context():
        db = get_db(app)
        for line in _dump_table(db, table):
            print line


def _initdb(db):
    """Initializes the database."""
    fn = os.path.join('app', 'schema', '0.0.0.baseline.sql')
    with open(fn, mode='r') as f:
        db.cursor().execute("PRAGMA synchronous = OFF");
        db.cursor().executescript(f.read())
        db.cursor().execute("PRAGMA synchronous = ON");
    db.commit()
    _updatedb(db)

def _updatedb(db):
    """Updates the database."""
    record_schema = """
        INSERT INTO `schema` (`version`, `path`, `comment`)
        VALUES (:version, :path, :comment)
        """

    def get_version(path):
        name = os.path.basename(path)
        return list(map(int, name.split('.')[:3]))

    def newer_version(a, b):
        if not isinstance(a, list):
            a = get_version(a)
        if not isinstance(b, list):
            b = get_version(b)
        return a < b

    def version_string(version):
        return u'.'.join(list(map(unicode, version)))

    latest = {'version': '0.0.0'}
    try:
        cur = db.execute("""
            SELECT *
            FROM `schema`
            ORDER BY `id` DESC
            LIMIT 1
            """)
        latest = cur.fetchone()
    except:
        db.execute("""
            CREATE TABLE `schema` (
                `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                `version` VARCHAR(10) NOT NULL,
                `path` VARCHAR(64) NOT NULL,
                `comment` TEXT NOT NULL,
                `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            )""")
        db.execute(record_schema, {
            'version': '0.0.0',
            'path': 'app/schema/0.0.0.baseline.sql',
            'comment': 'Initial database'
            })
        db.commit()

    changes = sorted(
        glob.glob(os.path.join('app', 'schema', '*.sql')),
        key=lambda change: get_version(change)
        )
    db.cursor().execute("PRAGMA synchronous = OFF");
    for change in changes:
        version = get_version(change)

        if not newer_version(latest['version'], version):
            continue

        with open(os.path.abspath(change), mode='r') as f:
            comment = f.readline().strip("\n\t\r- ")
            db.cursor().executescript(f.read())
            db.execute(record_schema, {
                'version': version_string(version),
                'path': change,
                'comment': comment
                })
            db.commit()
    db.cursor().execute("PRAGMA synchronous = ON");

def _dump_table(db, table):
    """Dump database content to console."""
    cursor = db.cursor()

    yield('BEGIN TRANSACTION;')

    # sqlite_master table contains the SQL CREATE statements for the database.
    schema = """
        SELECT `name`, `sql`
        FROM `sqlite_master`
            WHERE `sql` NOT NULL AND
            `type` == 'table' AND
            name == :table
        """
    result = cursor.execute(schema, {'table': table})
    for name, sql in result.fetchall():
        if name == 'sqlite_sequence':
            yield '-- '  + sql
            yield('DELETE FROM sqlite_sequence;')
        elif name == 'sqlite_stat1':
            yield '-- '  + sql
            yield('ANALYZE sqlite_master;')
        elif name.startswith('sqlite_'):
            yield '-- '  + sql
            continue
        else:
            yield(sql + ';')

        # Build the insert statement for each row of the current table
        pragma = cursor.execute("PRAGMA table_info('%s')" % name)
        columns = [
            str(table_info[1])
            for table_info in pragma.fetchall()
            ]
        values = "SELECT 'INSERT INTO `%(table)s` (%(columns)s)\n    VALUES (%(values)s);' FROM `%(table)s`;" % {
            'table': table,
            'columns': ', '.join(columns),
            'values': ', '.join([
                "'||quote(`%s`)||'" % col
                for col in columns
                ])
            }
        values_res = cursor.execute(values)
        for row in values_res:
            yield(row[0])
    yield('COMMIT;')

def _migrate(db, objects=None):
    """Migrate all Objects to any new configuration."""
    datamapper = get_datamapper(db)
    objects = objects or datamapper._creators

    db.cursor().execute("PRAGMA synchronous = OFF");
    for mapperType in objects:
        mapper = datamapper[mapperType]
        if not isinstance(mapper, JsonObjectDataMapper):
            continue
        objs = mapper.getMultiple()
        for obj in objs:
            obj.migrate(datamapper)
            mapper.update(obj)
    db.cursor().execute("PRAGMA synchronous = ON");

def register_request_hooks(app):
    """
    Register before/after request hooks
    """
    @app.before_request
    def check_authorization():
        """
        Prevents access to pages that require authentication
        """
        if session.get('user_id') is not None:
            return
        publicPages = (
            'home',
            'login',
            'doLogin',
            'static',
            'authenticate',
            )
        if request.endpoint not in publicPages:
            if request.is_xhr:
                response = jsonify({'message': 'Not logged in'})
                response.status_code = 401
                return response
            return redirect('/login')

    @app.before_request
    def get_user():
        """
        Attaches a User object to the authenticated session
        """
        if session.get('user_id') is None:
            request.user = None
            return
        db = get_db(app)
        datamapper = get_datamapper(db)
        request.user = datamapper.user.getById(
            session.get('user_id')
            )

    @app.before_request
    def get_party():
        """Checks if the user is hosting a party"""
        if session.get('party_id') is None:
            request.party = None
            return

        db = get_db(app)
        datamapper = get_datamapper(db)
        request.party = datamapper.party.getById(
            session.get('party_id')
            )
        request.party.members = datamapper.character.getByPartyId(
            session.get('party_id')
            )

    @app.context_processor
    def inject_metadata():
        items = get_item_data()
        return dict(
            info=app.config.get('info', {}),
            items=items
            )

    @app.after_request
    def add_header(r):
        """
        Add headers to force reloading resources during development
        """
        if not app.debug:
            return r
        r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        r.headers["Pragma"] = "no-cache"
        r.headers["Expires"] = "0"
        r.headers['Cache-Control'] = 'public, max-age=0'
        return r
