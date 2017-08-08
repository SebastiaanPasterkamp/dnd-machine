# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash

from ..config import get_config
from . import get_datamapper

party = Blueprint(
    'party', __name__, template_folder='templates')

@party.route('/')
@party.route('/list')
@party.route('/list/<int:encounter_id>')
def list(encounter_id=None):
    config = get_config()
    party_mapper = get_datamapper('party')
    character_mapper = get_datamapper('character')
    encounter = None

    search = None
    if 'admin' in request.user['role']:
        search = request.args.get('search', '')
        parties = party_mapper.getList(search)
    else:
        parties = party_mapper.getByUserId(request.user['id'])
        if 'dm' in request.user['role']:
            partyIds = set([p['id'] for p in parties])
            for party in party_mapper.getByDmUserId(request.user['id']):
                if party['id'] not in partyIds:
                    parties.append(party)
                    partyIds.add(party['id'])

    characters = dict([
        (p['id'], character_mapper.getByPartyId(p['id']))
        for p in parties
        ])

    if encounter_id is not None:
        encounter_mapper = get_datamapper('encounter')
        encounter = encounter_mapper.getById(encounter_id)

    return render_template(
        'list_parties.html',
        info=config['info'],
        parties=parties,
        characters=characters,
        encounter=encounter,
        search=search
        )

@party.route('/show/<int:party_id>')
def show(party_id):
    config = get_config()
    party_mapper = get_datamapper('party')
    user_mapper = get_datamapper('user')
    character_mapper = get_datamapper('character')
    encounter_mapper = get_datamapper('encounter')

    p = party_mapper.getById(party_id)

    user = user_mapper.getById(p['user_id'])

    characters = character_mapper.getByPartyId(party_id)
    p['size'] = len(characters)
    p['modifier'] = encounter_mapper.modifierByPartySize(p['size'])
    for cr in ['easy', 'medium', 'hard', 'deadly']:
        p[cr] = sum([c[cr] for c in characters])

    return render_template(
        'show_party.html',
        info=config['info'],
        party=p,
        user=user,
        characters=characters
        )

@party.route('/edit/<int:party_id>', methods=['GET', 'POST'])
def edit(party_id):
    config = get_config()
    party_mapper = get_datamapper('party')

    p = party_mapper.getById(party_id)
    if p['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'party.show',
                party_id=party_id
                ))

        p = party_mapper.fromPost(request.form, p)

        if request.form.get("button", "save") == "save":
            party_mapper.update(p)
            return redirect(url_for(
                'party.show',
                party_id=party_id
                ))

    return render_template(
        'edit_party.html',
        info=config['info'],
        data=config['data'],
        party=p
        )

@party.route('/del/<int:party_id>')
def delete(party_id):
    party_mapper = get_datamapper('party')

    p = party_mapper.getById(party_id)
    party_mapper.delete(p)

    return redirect(url_for(
        'party.list'
        ))

@party.route('/new', methods=['GET', 'POST'])
def new():
    config = get_config()
    party_mapper = get_datamapper('party')

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'party.list'
                ))

        p = party_mapper.fromPost(request.form)
        p['user_id'] = request.user['id']

        if request.form.get("button", "save") == "save":
            p = party_mapper.insert(p)
            return redirect(url_for(
                'party.show',
                party_id=p['id']
                ))
    else:
        p = {}

    return render_template(
        'edit_party.html',
        info=config['info'],
        data=config['data'],
        party=p
        )

@party.route('/<int:party_id>/<action>/<int:character_id>')
def modify(party_id, action, character_id):
    party_mapper = get_datamapper('party')
    character_mapper = get_datamapper('character')
    encounter_mapper = get_datamapper('encounter')

    p = party_mapper.getById(party_id)
    character = character_mapper.getById(character_id)

    if action == 'add':
        party_mapper.addCharacter(party_id, character_id)
        flash(
            "The Character '%s' was added to Party '%s'." % (
                character['name'],
                p['name']
                ),
            'info'
            )
    elif action == 'del':
        party_mapper.delCharacter(party_id, character_id)
        flash(
            "The Character '%s' was removed from Party '%s'." % (
                character['name'],
                p['name']
                ),
            'info'
            )
    else:
        flash("Unknown action '%s'." % action, 'error')

    characters = character_mapper.getByPartyId(party_id)
    p['size'] = len(characters)
    p['modifier'] = encounter_mapper.modifierByPartySize(p['size'])
    for cr in ['easy', 'medium', 'hard', 'deadly']:
        p[cr] = sum([c[cr] for c in characters])

    party_mapper.update(p)

    return redirect(request.referrer)
