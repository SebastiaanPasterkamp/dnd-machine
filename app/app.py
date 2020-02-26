# -*- coding: utf-8 -*-
import os
import glob
import datetime
from flask import Flask, request, session, redirect, url_for, jsonify
from flask_compress import Compress
from werkzeug.utils import find_modules, import_string
from werkzeug.routing import IntegerConverter

from errors import ApiException
from models import Datamapper
from models.base import JsonObjectDataMapper
from db import Database
import filters

def create_app(config={}):
    app = Flask(__name__)

    app.config.update(config)
    app.config.from_envvar('FLASKR_SETTINGS', silent=True)
    Compress().init_app(app)
    Database().init_app(app)
    Datamapper().init_app(app)

    register_converters(app)
    register_blueprints(app)
    register_filters(app)
    register_cli(app)
    register_request_hooks(app)
    return app

def register_converters(app):
    """
    Handle signed integers as URL parameters
    """
    class SignedIntConverter(IntegerConverter):
        regex = r'-?\d+'
    app.url_map.converters['signed_int'] = SignedIntConverter

def register_blueprints(app):
    """
    Auto detect blueprint modules
    """
    for name in find_modules('views', recursive=True):
        mod = import_string(name)
        url_prefix = '/'.join(
            name.replace('views', '').split('.')
            )
        if hasattr(mod, 'get_blueprint'):
            url_prefix, bp = mod.get_blueprint(app.datamapper, app.config)
            app.register_blueprint(bp, url_prefix=url_prefix)
        if hasattr(mod, 'with_app'):
            mod.with_app(app)


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
        if os.path.exists(app.config.get('DATABASE')):
            os.remove(app.config.get('DATABASE'))
        with app.db.connect() as db:
            _initdb(db)
        print('Initialized the database.')
    @app.cli.command('updatedb')
    def updatedb_command(force_skipped):
        print('Updating the database.')
        with app.db.connect() as db:
            _updatedb(db, force_skipped)
        print('Updated the database.')
    @app.cli.command('migrate')
    def migrate_command():
        print('Migrating objects.')
        _migrate(app)
        print('Migrated objects.')
    @app.cli.command('dump-table')
    def dump_table_command(table):
        with app.db.connect() as db:
            for line in _dump_table(db, table):
                print(line)
    @app.cli.command('import-sql')
    def import_sql_command(filename):
        with app.db.connect() as db:
            _import_sql(db, filename)

def initdb(app):
    with app.app_context():
        if os.path.exists(app.config.get('DATABASE')):
            app.db.close()
            os.remove(app.config.get('DATABASE'))
        with app.db.connect() as db:
            _initdb(db)

def updatedb(app, force_skipped=False):
    with app.app_context():
        with app.db.connect() as db:
            _updatedb(db, force_skipped)

def migrate(app, objects=None):
    with app.app_context():
        _migrate(app, objects)

def dump_table(app, table):
    with app.app_context():
        with app.db.connect() as db:
            for line in _dump_table(db, table):
                print(line)

def import_sql(app, filename=None):
    with app.app_context():
        with app.db.connect() as db:
            _import_sql(db, filename)


def _initdb(db):
    """Initializes the database."""
    fn = os.path.join('app', 'schema', '0.0.0.baseline.sql')
    with open(fn, mode='r') as f:
        db.execute("PRAGMA synchronous = OFF")
        db.executescript(f.read())
        db.execute("PRAGMA synchronous = ON")
    db.commit()
    _updatedb(db)

def _updatedb(db, force_skipped=False):
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
        return '.'.join(list(map(str, version)))

    executed = set(['0.0.0'])
    latest = '0.0.0'
    try:
        cur = db.execute("""SELECT version FROM `schema` ORDER BY `id` ASC""")
        for row in cur.fetchall():
            executed.add(row['version'])
            latest = row['version']
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
    db.execute("PRAGMA synchronous = OFF")
    for change in changes:
        version = get_version(change)

        if version_string(version) in executed:
            continue

        if not newer_version(latest, version):
            if not force_skipped:
                print(
                    "Skipped change %s (%s) detected! Use --force-skipped to ammend." % (
                    version_string(version), change))
                continue
            else:
                print(
                    "Executing skipped change %s (%s) out of order!" % (
                    version_string(version), change))

        with open(os.path.abspath(change), mode='r') as f:
            comment = f.readline().strip("\n\t\r- ")
            db.executescript(f.read())
            db.execute(record_schema, {
                'version': version_string(version),
                'path': change,
                'comment': comment
                })
            db.commit()
    db.execute("PRAGMA synchronous = ON")

def _dump_table(db, table):
    """Dump database content to console."""

    yield('BEGIN TRANSACTION;')

    # sqlite_master table contains the SQL CREATE statements for the database.
    schema = """
        SELECT `name`, `sql`
        FROM `sqlite_master`
            WHERE `sql` NOT NULL AND
            `type` == 'table' AND
            name == :table
        """
    result = db.execute(schema, {'table': table})
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
        pragma = db.execute("PRAGMA table_info('%s')" % name)
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
        values_res = db.execute(values)
        for row in values_res:
            yield(row[0])
    yield('COMMIT;')

def _migrate(app, objects=None):
    """Migrate all Objects to any new configuration."""
    objects = objects or app.datamapper._CREATORS.keys()

    with app.db.connect() as db:
        db.execute("PRAGMA synchronous = OFF")
        for mapperType in objects:
            mapper = app.datamapper[mapperType]
            if not isinstance(mapper, JsonObjectDataMapper):
                continue
            objs = mapper.getMultiple()
            for obj in objs:
                obj.migrate(app.datamapper)
                mapper.update(obj)
        db.execute("PRAGMA synchronous = ON")
        db.commit()

def _import_sql(db, filename=None):
    """Import sql file into the database."""
    db.execute("PRAGMA synchronous = OFF")
    with open(filename, mode='r') as f:
        db.executescript(f.read())
        db.commit()
    db.execute("PRAGMA synchronous = ON")

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
            'login',
            'login_with_google',
            'login_with_google_callback',
            'privacy_policy',
            'current_user',
            'messages',
            'static',
            'authenticate',
            'recover',
            'recovery',
            )
        if request.endpoint not in publicPages:
            response = redirect(url_for('login'))
            if request.accept_mimetypes.accept_json \
                    and not request.accept_mimetypes.accept_html:
                response = jsonify({'message': 'Not logged in'})
                response.status_code = 401
            return response

    @app.before_request
    def get_user():
        """
        Attaches a User object to the authenticated session
        """
        if session.get('user_id') is None:
            request.user = None
            return
        request.user = app.datamapper.user.getById(
            session.get('user_id')
            )

    @app.before_request
    def get_party():
        """Checks if the user is hosting a party"""
        if session.get('party_id') is None:
            request.party = None
            return

        request.party = app.datamapper.party.getById(
            session.get('party_id')
            )
        request.party.members = app.datamapper.character.getByIds(
            request.party.member_ids
            )

    @app.context_processor
    def inject_metadata():
        return dict(
            info=app.config.get('info', {}),
            now=datetime.datetime.utcnow,
            )

    @app.after_request
    def add_header(response):
        """
        Add headers to force reloading resources during development
        """
        response.cache_control.must_revalidate = True
        response.cache_control.max_age = 0
        response.cache_control.public = True
        return response

    @app.errorhandler(ApiException)
    def handle_api_exception(error):
        """
        Return ApiException as JSON messages with HTTP status code
        """
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response
