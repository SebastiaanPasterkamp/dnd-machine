# -*- coding: utf-8 -*-
import os
import json
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash, jsonify
from passlib.hash import pbkdf2_sha256 as password

from .config import get_config
from .models import datamapper_factory, get_db
from .views.user import user
from .views.character import character
from .views.party import party
from .views.monster import monster
from .views.encounter import encounter

app = Flask(__name__)
app.register_blueprint(user, url_prefix='/user')
app.register_blueprint(character, url_prefix='/character')
app.register_blueprint(party, url_prefix='/party')
app.register_blueprint(monster, url_prefix='/monster')
app.register_blueprint(encounter, url_prefix='/encounter')

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
    return redirect(url_for('character.list'))

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
