# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash

from ..config import get_config
from . import get_datamapper

encounter = Blueprint(
    'encounter', __name__, template_folder='templates')

@encounter.route('/')
@encounter.route('/list')
def list(encounter_id=None):
    config = get_config()
    encounter_mapper = get_datamapper('encounter')

    search = None
    if 'admin' in request.user['role']:
        search = request.args.get('search', '')
        encounters = encounter_mapper.getList(search)
    else:
        encounters = encounter_mapper.getByDmUserId(request.user['id'])

    return render_template(
        'list_encounters.html',
        info=config['info'],
        encounters=encounters,
        search=search
        )

@encounter.route('/show/<int:encounter_id>')
@encounter.route('/show/<int:encounter_id>/<int:party_id>')
def show(encounter_id, party_id=None):
    if party_id is None:
        return redirect( url_for('party.list', encounter_id=encounter_id) )

    config = get_config()
    encounter_mapper = get_datamapper('encounter')
    user_mapper = get_datamapper('user')
    party_mapper = get_datamapper('party')
    monster_mapper = get_datamapper('monster')
    machine = get_datamapper('machine')

    e = encounter_mapper.getById(encounter_id)
    user = user_mapper.getById(e['user_id'])
    party = party_mapper.getById(party_id)

    monsters = monster_mapper.getByEncounterId(encounter_id)
    for monster in monsters:
        monster = machine.computeMonsterStatistics(monster)

    e = encounter_mapper.computeChallenge(e, monsters, party)

    return render_template(
        'show_encounter.html',
        info=config['info'],
        encounter=e,
        user=user,
        party=party,
        monsters=monsters
        )

@encounter.route('/edit/<int:encounter_id>', methods=['GET', 'POST'])
def edit(encounter_id):
    config = get_config()
    encounter_mapper = get_datamapper('encounter')
    monster_mapper = get_datamapper('monster')
    machine = get_datamapper('machine')

    e = encounter_mapper.getById(encounter_id)
    if e['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                '@encounter.show',
                encounter_id=encounter_id
                ))

        e = encounter_mapper.fromPost(request.form, e)

        if request.form.get("button", "save") == "save":
            encounter_mapper.update(e)
            return redirect(url_for(
                'encounter.show',
                encounter_id=encounter_id
                ))

    monsters = monster_mapper.getByEncounterId(encounter_id)
    for monster in monsters:
        monster = machine.computeMonsterStatistics(monster)

    e = encounter_mapper.computeChallenge(e, monsters)

    return render_template(
        'edit_encounter.html',
        info=config['info'],
        encounter=e,
        monsters=monsters
        )

@encounter.route('/del/<int:encounter_id>')
def delete(encounter_id):
    encounter_mapper = get_datamapper('encounter')

    e = encounter_mapper.getById(encounter_id)
    encounter_mapper.delete(e)

    return redirect(url_for(
        'encounter.list'
        ))

@encounter.route('/new', methods=['GET', 'POST'])
def new():
    config = get_config()
    encounter_mapper = get_datamapper('encounter')

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'encounter.list'
                ))

        e = encounter_mapper.fromPost(request.form)
        e['user_id'] = request.user['id']

        e = encounter_mapper.computeChallenge(e)

        if request.form.get("button", "save") == "save":
            e = encounter_mapper.insert(e)
            return redirect(url_for(
                'encounter.show',
                encounter_id=e['id']
                ))
    else:
        e = {}

    return render_template(
        'edit_encounter.html',
        info=config['info'],
        encounter=e
        )

@encounter.route('/<int:encounter_id>/<action>/<int:monster_id>')
def modify(encounter_id, action, monster_id):
    encounter_mapper = get_datamapper('encounter')
    monster_mapper = get_datamapper('monster')
    machine = get_datamapper('machine')

    e = encounter_mapper.getById(encounter_id)
    monster = monster_mapper.getById(monster_id)

    if action == 'add':
        encounter_mapper.addMonster(encounter_id, monster_id)
        flash(
            "The Monster '%s' was added to Encounter '%s'." % (
                monster['name'],
                e['name']
                ),
            'info'
            )
    elif action == 'del':
        encounter_mapper.delMonster(encounter_id, monster_id)
        flash(
            "The Monster '%s' was removed from Encounter '%s'." % (
                monster['name'],
                e['name']
                ),
            'info'
            )
    else:
        flash("Unknown action '%s'." % action, 'error')

    monsters = monster_mapper.getByEncounterId(encounter_id)
    for monster in monsters:
        monster = machine.computeMonsterStatistics(monster)
    e = encounter_mapper.computeChallenge(e, monsters)

    encounter_mapper.update(e)

    return redirect(request.referrer)
