# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template

from ..config import get_config
from . import get_datamapper

character = Blueprint(
    'character', __name__, template_folder='templates')

@character.route('/')
@character.route('/list')
@character.route('/list/<int:party_id>')
def list(party_id=None):
    config = get_config()
    character_mapper = get_datamapper('character')

    search = request.args.get('search', '')
    characters = character_mapper.getList(search)
    party = None
    members = []
    users = []

    if not any(role in request.user['role'] for role in ['admin', 'dm']):
        characters = [
            c
            for c in characters
            if c['user_id'] == request.user['id']
            ]
    else:
        user_mapper = get_datamapper('user')
        users = dict([
            (user_id, user_mapper.getById(user_id))
            for user_id in set([c['user_id'] for c in characters if c.get('user_id')])
            ])

    if party_id is not None:
        party_mapper = get_datamapper('party')
        party = party_mapper.getById(party_id)
        members = [c['id'] for c in character_mapper.getByPartyId(party_id)]

    return render_template(
        'list_characters.html',
        info=config['info'],
        characters=characters,
        users=users,
        party=party,
        members=members,
        search=search
        )

@character.route('/show/<int:character_id>')
def show(character_id):
    config = get_config()
    character_mapper = get_datamapper('character')

    c = character_mapper.getById(character_id)
    if c['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)

    return render_template(
        'show_character.html',
        info=config['info'],
        character=c
        )

@character.route('/edit/<int:character_id>', methods=['GET', 'POST'])
def edit(character_id):
    config = get_config()
    character_mapper = get_datamapper('character')

    c = character_mapper.getById(character_id)
    if c['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'character.show',
                character_id=character_id
                ))

        c = character_mapper.fromPost(request.form, c)

        machine = get_datamapper('machine')
        cr = machine.challengeByLevel(c['level'])
        c.update(cr)

        if request.form.get("button", "save") == "save":
            character_mapper.update(c)
            return redirect(url_for(
                'character.show',
                character_id=character_id
                ))

    return render_template(
        'edit_character.html',
        info=config['info'],
        data=config['data'],
        character=c
        )

@character.route('/del/<int:character_id>')
def delete(character_id):
    character_mapper = get_datamapper('character')

    c = character_mapper.getById(character_id)
    character_mapper.delete(c)

    return redirect(url_for(
        'character.list'
        ))

@character.route('/new', methods=['GET', 'POST'])
def new():
    config = get_config()
    character_mapper = get_datamapper('character')

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'character.list'
                ))

        c = character_mapper.fromPost(request.form)
        c['user_id'] = request.user['id']

        machine = get_datamapper('machine')
        cr = machine.challengeByLevel(c['level'])
        c.update(cr)

        if request.form.get("button", "save") == "save":
            c = character_mapper.insert(c)
            return redirect(url_for(
                'character.show',
                character_id=c['id']
                ))
    else:
        c = {}

    return render_template(
        'edit_character.html',
        info=config['info'],
        data=config['data'],
        character=c
        )
