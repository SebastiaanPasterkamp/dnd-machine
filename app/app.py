# -*- coding: utf-8 -*-
import os
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash, jsonify, Markup

from . import get_db, get_datamapper
from .config import get_config, get_item_data
import filters
from .views.user import blueprint as user
from .views.items import blueprint as items
from .views.character import blueprint as character
from .views.party import blueprint as party
from .views.monster import blueprint as monster
from .views.npc import blueprint as npc
from .views.encounter import encounter
from .views.campaign import campaign

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

def init_db():
    db = get_db()
    with app.open_resource('schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.execute("""
        INSERT INTO `users`
        VALUES (1,'admin','$pbkdf2-sha256$6400$/N87Z6w1xjgHwPifs3buPQ$7k8ZnhgsKVR0BW5mpwgro50PlGKBcWilBXIZyHHGddg','','{"role": ["admin", "dm"]}')
        """);
    db.commit()

@app.cli.command('initdb')
def initdb_command():
    """Initializes the database."""
    init_db()
    print('Initialized the database.')

def update_db():
    db = get_db()
    with app.open_resource('update.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()

@app.cli.command('updatedb')
def updatedb_command():
    """Updates the database."""
    update_db()
    print('Updated the database.')

@app.before_request
def get_user():
    """Checks if the user is logged in, and returns the user
    object"""
    datamapper = get_datamapper()

    if session.get('user_id') is None \
            and request.endpoint not in ('login', 'static'):
        request.user = None
        if request.path != url_for('login'):
            return redirect(url_for('login'))
    else:
        request.user = datamapper.user.getById(session.get('user_id'))

@app.before_request
def get_party():
    """Checks if the user is hosting a party"""
    datamapper = get_datamapper()

    if session.get('party_id'):
        datamapper = get_datamapper()
        request.party = datamapper.party.getById(session.get('party_id'))
    else:
        request.party = None

@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

@app.context_processor
def inject_metadata():
    config = get_config()
    items = get_item_data()
    return dict(
        info=config['info'],
        items=items
        )

@app.route('/')
def home():
    if session.get('user_id') is None:
        return redirect(url_for('login'))
    return redirect(url_for('character.overview'))

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
    if session.get('party_id') is None:
        return jsonify(None)
    return redirect(url_for(
        'party.api_get',
        party_id=session.get('party_id')
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
        'path': url_for('items.spells'),
        })

    items_group['items'].append({
        'label': 'Languages',
        'icon': 'language',
        'path': url_for('items.languages'),
        })

    items_group['items'].append({
        'label': 'Weapons',
        'icon': 'cutlery',
        'path': url_for('items.get_list', item_type='weapons'),
        })

    items_group['items'].append({
        'label': 'Armor',
        'icon': 'shield',
        'path': url_for('items.get_list', item_type='armor'),
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

    if request.party:
        user_group['items'].append({
            'label': "Hosting %s" % request.party.name,
            'icon': 'beer',
            'path': url_for('party.show', party_id=request.party.id),
            })
        user_group['items'].append({
            'label': "Stop hosting",
            'icon': 'times',
            'path': url_for('party.host', party_id=0),
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



@app.route('/login', methods=['GET', 'POST'])
def login():
    datamapper = get_datamapper()

    error = None
    if request.method == 'POST':
        username,password = \
            request.form['username'], request.form['password']
        user = datamapper.user.getByCredentials(username, password)

        if user is None:
            flash('Login failed', 'error')
        else:
            session['user_id'] = user.id
            flash(
                'You are now logged in, %s' % user.username,
                'info'
                )
            return redirect('/')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('user', None)
    session.pop('party_id', None)
    flash('You were logged out', 'info')
    return redirect(url_for('home'))

@app.route('/test')
def show_test():
    return render_template('test.html')
