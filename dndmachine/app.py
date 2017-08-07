# -*- coding: utf-8 -*-
import os
import json
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash, jsonify
from passlib.hash import pbkdf2_sha256 as password

from .config import get_config
from .models import datamapper_factory, get_db
from .views.monster import monster

app = Flask(__name__)
app.register_blueprint(monster, url_prefix='/monster')

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

def get_datamapper(datamapper):
    """Returns a datamapper for a type.
    """
    if not hasattr(g, 'datamappers'):
        g.datamappers = {}
    if datamapper not in g.datamappers:
        g.datamappers[datamapper] = datamapper_factory(datamapper)
    return g.datamappers[datamapper]

@app.before_request
def get_user():
    """Checks if the user is logged in, and returns the user
    object"""
    if session.get('userid') is None \
            and request.endpoint not in ('login', 'static'):
        request.user = None
        if request.path != url_for('login'):
            return redirect(url_for('login'))
    else:
        user_mapper = get_datamapper('user')
        request.user = user_mapper.getById(session.get('userid'))

@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

@app.route('/')
def home():
    if session.get('userid') is None:
        return redirect(url_for('login'))
    return redirect(url_for('show_party'))

@app.route('/user')
@app.route('/user/<int:user_id>')
@app.route('/user/<action>/<int:user_id>', methods=['GET', 'POST'])
def show_user(user_id=None, action=None):
    user_mapper = get_datamapper('user')

    if user_id is not None:
        user = user_mapper.getById(user_id)

        if user['id'] != request.user['id'] \
                and (
                    'role' not in request.user
                    or 'admin' not in request.user['role']
                    ):
            abort(403)

        if request.method == 'POST':
            if request.form["button"] == "cancel":
                return redirect(url_for('show_user', user_id=user_id))

            user = user_mapper.fromPost(request.form, user)

            if request.form.get("button", "save") == "save":
                user = user_mapper.update(user)
                return redirect(url_for('show_user', user_id=user['id']))

        if action == 'edit':
            return render_template(
                'edit_user.html',
                info=app.config['info'],
                data=app.config['data'],
                user=user
                )

        return render_template(
            'show_user.html',
            info=app.config['info'],
            user=user
            )

    search = request.args.get('search', '')
    users = user_mapper.getList(search)
    return render_template(
        'list_users.html',
        info=app.config['info'],
        users=users,
        search=search
        )

@app.route('/user/add', methods=['GET', 'POST'])
def add_user():
    user_mapper = get_datamapper('user')

    user = {}
    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for('show_user'))

        user = user_mapper.fromPost(request.form)

        if 'admin' not in request.user['role']:
            abort(403)

        if request.form.get("button", "save") == "save":
            user = user_mapper.insert(user)
            return redirect(url_for('show_user', user_id=user['id']))

    return render_template(
        'edit_user.html',
        info=app.config['info'],
        data=app.config['data'],
        user=user
        )

@app.route('/party')
@app.route('/party/<int:party_id>')
@app.route('/party/encounter/<int:encounter_id>')
def show_party(party_id=None, encounter_id=None):
    party_mapper = get_datamapper('party')
    encounter_mapper = get_datamapper('encounter')

    if party_id is None:
        search = request.args.get('search', '')
        parties = party_mapper.getList(search)
        encounter = None
        if encounter_id is not None:
            encounter = encounter_mapper.getById(encounter_id)
        return render_template(
            'list_parties.html',
            info=app.config['info'],
            parties=parties,
            encounter=encounter,
            search=search
            )

    character_mapper = get_datamapper('character')
    machine = get_datamapper('machine')

    characters = character_mapper.getByParty(party_id)

    for character in characters:
        cr = machine.challengeByLevel(
            character['level'],
            session.get('method', 'lookup') == 'formula'
            )
        character.update(cr)

    party = party_mapper.getById(party_id)
    party['size'] = len(characters)
    party['modifier'] = encounter_mapper.modifierByPartySize(party['size'])
    for cr in ['easy', 'medium', 'hard', 'deadly']:
        party[cr] = sum([c[cr] for c in characters])

    return render_template(
        'show_party.html',
        info=app.config['info'],
        party=party,
        characters=characters
        )

@app.route('/party/<action>/<int:party_id>/<int:character_id>')
def modify_party(action, party_id, character_id):
    party_mapper = get_datamapper('party')
    character_mapper = get_datamapper('character')
    user_mapper = get_datamapper('user')

    party = party_mapper.getById(party_id)
    character = character_mapper.getById(character_id)

    if action == 'add':
        party_mapper.addCharacter(party_id, character_id)
        flash(
            "The Character '%s' was added to Party '%s'." % (
                character['name'],
                party['name']
                ),
            'info'
            )
    elif action == 'del':
        party_mapper.delCharacter(party_id, character_id)
        flash(
            "The Character '%s' was removed from Party '%s'." % (
                character['name'],
                party['name']
                ),
            'info'
            )
    else:
        flash("Unknown action '%s'." % action, 'error')

    party['size'] = len(character_mapper.getByParty(party_id))
    party_mapper.update(party)

    return redirect(request.referrer)

@app.route('/character')
@app.route('/character/<int:character_id>')
@app.route('/character/add/<int:party_id>')
def show_character(character_id=None, party_id=None):
    character_mapper = get_datamapper('character')

    if character_id is not None:
        character = character_mapper.getById(character_id)
        return render_template(
            'show_character.html',
            info=app.config['info'],
            character=character
            )

    party = None
    members = []
    if party_id is not None:
        party_mapper = get_datamapper('party')
        party = party_mapper.getById(party_id)
        members = [
            c['id']
            for c in character_mapper.getByParty(party_id)
            ]

    search = request.args.get('search', '')
    characters = character_mapper.getList(search)
    return render_template(
        'list_characters.html',
        info=app.config['info'],
        characters=characters,
        party=party,
        members=members,
        search=search
        )

@app.route('/encounter')
@app.route('/encounter/<int:encounter_id>')
@app.route('/encounter/<int:encounter_id>/<int:party_id>')
def show_encounter(encounter_id=None, party_id=None):
    encounter_mapper = get_datamapper('encounter')

    if encounter_id is None:
        search = request.args.get('search', '')
        encounters = encounter_mapper.getList(search)
        return render_template(
            'list_encounters.html',
            info=app.config['info'],
            encounters=encounters,
            search=search
            )

    machine = get_datamapper('machine')
    party_mapper = get_datamapper('party')

    if party_id is None:
        return redirect( url_for('show_party', encounter_id=encounter_id) )

    character_mapper = get_datamapper('character')
    characters = character_mapper.getByParty(party_id)

    for character in characters:
        cr = machine.challengeByLevel(
            character['level'],
            session.get('method', 'lookup') == 'formula'
            )
        character.update(cr)

    party = party_mapper.getById(party_id)
    party['size'] = len(characters)
    party['modifier'] = encounter_mapper.modifierByPartySize(party['size'])
    for cr in ['easy', 'medium', 'hard', 'deadly']:
        party[cr] = sum([c[cr] for c in characters])

    monster_mapper = get_datamapper('monster')
    monsters = monster_mapper.getByEncounter(encounter_id)
    for monster in monsters:
        monster = machine.computeMonsterStatistics(monster)

    encounter = encounter_mapper.getById(encounter_id)
    encounter = encounter_mapper.computeChallenge(encounter, monsters, party)

    return render_template(
        'show_encounter.html',
        info=app.config['info'],
        encounter=encounter,
        monsters=monsters,
        party=party
        )

@app.route('/encounter/<action>/<int:encounter_id>')
@app.route('/encounter/<action>/<int:encounter_id>/<int:monster_id>')
def edit_encounter(action, encounter_id, monster_id=None):
    encounter_mapper = get_datamapper('encounter')
    monster_mapper = get_datamapper('monster')
    machine = get_datamapper('machine')

    encounter = encounter_mapper.getById(encounter_id)
    monster = monster_mapper.getById(monster_id)

    if action == 'edit':
        monsters = monster_mapper.getByEncounter(encounter_id)
        for monster in monsters:
            monster = machine.computeMonsterStatistics(monster)

        encounter = encounter_mapper.getById(encounter_id)
        encounter = encounter_mapper.computeChallenge(encounter, monsters)

        return render_template(
            'edit_encounter.html',
            info=app.config['info'],
            encounter=encounter,
            monsters=monsters
            )

    elif action in ['add', 'del']:
        if action == 'del':
            encounter_mapper.delMonster(encounter_id, monster_id)
            flash(
                "The Monster '%s' was removed from Encounter '%s'." % (
                    monster['name'],
                    encounter['name']
                    ),
                'info'
                )
        else:
            encounter_mapper.addMonster(encounter_id, monster_id)
            flash(
                "The Monster '%s' was added to Encounter '%s'." % (
                    monster['name'],
                    encounter['name']
                    ),
                'info'
                )

        monsters = monster_mapper.getByEncounter(encounter_id)
        for monster in monsters:
            monster = machine.computeMonsterStatistics(monster)

        encounter = encounter_mapper.getById(encounter_id)
        encounter = encounter_mapper.computeChallenge(encounter, monsters)
        encounter_mapper.update(encounter)

    else:
        flash("Unknown action '%s'." % action, 'error')
    return redirect(request.referrer)

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        db = get_db()
        name, pwd = request.form['username'], request.form['password']
        cur = db.execute("""
            SELECT `id`, `username`, `password`
            FROM `users`
            WHERE `username` = ?
            """,
            [name]
            )
        user = cur.fetchone()
        #if not user \
                #or not password.verify(pwd, user['password']):
            #flash('Login failed', 'error')
        #else:
        if True:
            session['userid'] = user['id']
            flash(
                'You are now logged in, %s' % user['username'],
                'info'
                )
            return redirect('/')
    return render_template(
        'login.html',
        info=app.config['info']
        )

@app.route('/logout')
def logout():
    session.pop('userid', None)
    session.pop('user', None)
    flash('You were logged out', 'info')
    return redirect(url_for('home'))

@app.route('/set_method/<method>')
def set_method(method):
    if method in ['lookup', 'formula']:
        session['method'] = method
        flash(
            "Your calculation method is now set to '%s'" % (
                session.get('method')
                ),
            'good'
            )
    else:
        flash("Unknown method '%s'" % method, 'error')
    return redirect(request.referrer)
