# -*- coding: utf-8 -*-
import os
import glob
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash, jsonify, Markup


from .models.base import JsonObjectDataMapper
from . import get_db, get_datamapper
from .config import get_config, get_item_data
import filters
from .views.user import blueprint as user
from .views.items import blueprint as items
from .views.character import blueprint as character
from .views.party import blueprint as party
from .views.monster import blueprint as monster
from .views.npc import blueprint as npc
from .views.encounter import blueprint as encounter
from .views.campaign import blueprint as campaign

app = Flask(__name__)

# Register blueprints
app.register_blueprint(user, url_prefix='/user')
app.register_blueprint(items, url_prefix='/items')
app.register_blueprint(character, url_prefix='/character')
app.register_blueprint(party, url_prefix='/party')
app.register_blueprint(monster, url_prefix='/monster')
app.register_blueprint(npc, url_prefix='/npc')
app.register_blueprint(encounter, url_prefix='/encounter')
app.register_blueprint(campaign, url_prefix='/campaign')

# Register filters
app.jinja_env.filters['max'] = filters.filter_max
app.jinja_env.filters['sanitize'] = filters.filter_sanitize
app.jinja_env.filters['unique'] = filters.filter_unique
app.jinja_env.filters['field_title'] = filters.filter_field_title
app.jinja_env.filters['bonus'] = filters.filter_bonus
app.jinja_env.filters['damage'] = filters.filter_damage
app.jinja_env.filters['coinage'] = filters.filter_coinage
app.jinja_env.filters['distance'] = filters.filter_distance
app.jinja_env.filters['classify'] = filters.filter_classify
app.jinja_env.filters['completed'] = filters.filter_completed
app.jinja_env.filters['by_name'] = filters.filter_by_name
app.jinja_env.filters['json'] = filters.filter_json
app.jinja_env.filters['md5'] = filters.filter_md5
app.jinja_env.filters['markdown'] = filters.filter_markdown
app.jinja_env.filters['named_headers'] = filters.filter_named_headers
app.jinja_env.filters['linked_objects'] = filters.filter_linked_objects

# Load default config and override config from an environment variable
app.config.update(get_config())

app.config.from_envvar('FLASKR_SETTINGS', silent=True)

def initdb():
    with app.app_context():
        _initdb()

@app.cli.command('initdb')
def initdb_command():
    _initdb()

def _initdb():
    """Initializes the database."""
    print('Initializing the database.')
    db = get_db()
    fn = os.path.join('schema', '0.0.0.baseline.sql')
    with app.open_resource(fn, mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()
    print('Initialized the database.')
    _updatedb()


def updatedb():
    with app.app_context():
        _updatedb()

@app.cli.command('updatedb')
def updatedb_command():
    _updatedb()

def _updatedb():
    """Updates the database."""
    print('Updating the database.')
    db = get_db()

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
    for change in changes:
        version = get_version(change)

        if not newer_version(latest['version'], version):
            continue

        with app.open_resource(os.path.abspath(change), mode='r') as f:
            comment = f.readline().strip("\n\t\r- ")
            print version_string(version), change, comment
            db.cursor().executescript(f.read())
            db.execute(record_schema, {
                'version': version_string(version),
                'path': change,
                'comment': comment
                })
            db.commit()

    print('Updated the database.')


def dump_table(table):
    with app.app_context():
        for line in _dump_table(table):
            print line

@app.cli.command('dump-table')
def dump_table_command(table):
    for line in _dump_table(table):
        print line

def _dump_table(table):
    """Dump database content to console."""
    db = None
    with app.app_context():
        db = get_db().cursor()

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


def migrate():
    with app.app_context():
        _migrate()

@app.cli.command('migrate')
def migrate_command():
    _migrate()

def _migrate():
    """Migrate all Objects to any new configuration."""
    datamapper = get_datamapper()

    for mapperType in datamapper._creators:
        mapper = datamapper[mapperType]
        if not isinstance(mapper, JsonObjectDataMapper):
            continue
        objs = mapper.getMultiple()
        print "Converting '%s': %d" % (
            mapperType, len(objs)
            )
        for obj in objs:
            print "- %d" % obj.id
            obj.migrate(datamapper)
            mapper.update(obj)
    print "Done"

@app.before_request
def get_user():
    """Checks if the user is logged in, and returns the user
    object"""
    datamapper = get_datamapper()

    if session.get('user_id') is not None:
        request.user = datamapper.user.getById(session.get('user_id'))
    elif request.endpoint not in ('login', 'doLogin', 'static', 'authenticate'):
        if request.is_xhr:
            return jsonify({'error': 'Not logged in'})
        return redirect(url_for('login'))

@app.before_request
def get_party():
    """Checks if the user is hosting a party"""
    datamapper = get_datamapper()

    if session.get('party_id'):
        datamapper = get_datamapper()
        request.party = datamapper.party.getById(session.get('party_id'))
        request.party.members = datamapper.character.getByPartyId(session.get('party_id'))
    else:
        request.party = None

@app.context_processor
def inject_metadata():
    items = get_item_data()
    return dict(
        info=app.config.get('info', {}),
        items=items
        )

@app.route('/')
def home():
    if session.get('user_id') is None:
        return redirect(url_for('login'))
    return redirect(url_for('character.overview'))

@app.route('/error', methods=["POST"])
def error():
    data = request.get_json()
    print data

@app.route('/authenticate')
def authenticate():
    return jsonify(app.config.get('info', {}))

@app.route('/current_user')
def current_user():
    if session.get('user_id') is None:
        return jsonify(None)
    return redirect(url_for(
        'user.api_get',
        user_id=session.get('user_id')
        ))

@app.route('/hosted_party')
def hosted_party():
    return redirect(url_for(
        'party.hosting'
        ))

@app.route('/navigation')
def navigation():
    navigation = []
    datamapper = get_datamapper()

    if session.get('user_id') is None:
        abort(404)

    navigation.append({
        'label': 'Characters',
        'icon': 'user-secret',
        'path': url_for('character.overview'),
        })

    navigation.append({
        'label': 'Parties',
        'icon': 'users',
        'path': url_for('party.overview'),
        })

    dm_group = {
        'label': 'Dungeon Master',
        'roles': ['dm'],
        'icon': 'gavel',
        'items': [],
        }

    dm_group['items'].append({
        'label': 'Monsters',
        'roles': ['dm'],
        'icon': 'paw',
        'path': url_for('monster.overview'),
        })

    dm_group['items'].append({
        'label': 'NPCs',
        'roles': ['dm'],
        'icon': 'commenting-o',
        'path': url_for('npc.overview'),
        })

    dm_group['items'].append({
        'label': 'Encounters',
        'roles': ['dm'],
        'icon': 'gamepad',
        'path': url_for('encounter.overview'),
        })

    dm_group['items'].append({
        'label': 'Campaigns',
        'roles': ['dm'],
        'icon': 'book',
        'path': url_for('campaign.overview'),
        })

    navigation.append(dm_group)

    items_group = {
        'label': 'Items',
        'icon': 'list',
        'items': [],
        }

    items_group['items'].append({
        'label': 'Spells',
        'icon': 'magic',
        'path': url_for('items.get_list', objects='spells'),
        })

    items_group['items'].append({
        'label': 'Languages',
        'icon': 'language',
        'path': url_for('items.get_list', objects='languages'),
        })

    items_group['items'].append({
        'label': 'Weapons',
        'icon': 'cutlery',
        'path': url_for('items.get_list', objects='weapons'),
        })

    items_group['items'].append({
        'label': 'Armor',
        'icon': 'shield',
        'path': url_for('items.get_list', objects='armor'),
        })

    navigation.append(items_group)

    admin_group = {
        'label': 'Admin',
        'roles': ['admin'],
        'icon': 'address-book',
        'items': [],
        }

    admin_group['items'].append({
        'label': 'Users',
        'roles': ['admin'],
        'icon': 'address-book-o',
        'path': url_for('user.overview'),
        })

    navigation.append(admin_group)

    user_group = {
        'label': request.user.username,
        'icon': 'user-circle',
        'items': [],
        }

    user_group['items'].append({
        'label': 'View profile',
        'icon': 'address-card-o',
        'path': url_for('user.show', user_id=request.user.id),
        })

    user_group['items'].append({
        'label': "Logout %s" % request.user.username,
        'icon': 'sign-out',
        'path': url_for('logout'),
        })

    navigation.append(user_group)

    def authorized(item):
        if 'items' in item:
            item['items'] = [
                nav
                for nav in item['items']
                if authorized(nav)
                ]
        if 'items' in item and not len(item['items']):
            return False
        if 'roles' not in item:
            return True
        if any([role in item['roles'] for role in request.user['role']]):
            return True
        return False

    navigation = [
        nav
        for nav in navigation
        if authorized(nav)
        ]

    return jsonify(navigation)

@app.route('/login', methods=['GET'])
def login():
    return render_template(
        'reactjs-layout.html'
        )

@app.route('/login', methods=['POST'])
def doLogin():
    datamapper = get_datamapper()

    credentials = request.get_json()
    user = datamapper.user.getByCredentials(
        credentials.get('username'),
        credentials.get('password')
        )

    if user is None:
        return jsonify({
            'error': 'Login failed'
            })
    else:
        session['user_id'] = user.id
        flash(
            'You are now logged in, %s' % user.username,
            'info'
            )
        return redirect(url_for('current_user'))


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('user', None)
    session.pop('party_id', None)
    flash('You were logged out', 'info')
    return redirect(url_for('current_user'))

@app.route('/test')
def show_test():
    return render_template('test.html')

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
