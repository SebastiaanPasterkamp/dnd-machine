# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash
import re

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
@encounter.route('/show/<int:encounter_id>/<int:party_id>', methods=['GET', 'POST'])
def show(encounter_id, party_id=None):
    if party_id is None:
        return redirect( url_for('party.list', encounter_id=encounter_id) )

    config = get_config()
    encounter_mapper = get_datamapper('encounter')
    user_mapper = get_datamapper('user')
    party_mapper = get_datamapper('party')
    character_mapper = get_datamapper('character')
    monster_mapper = get_datamapper('monster')
    machine = get_datamapper('machine')

    e = encounter_mapper.getById(encounter_id)
    user = user_mapper.getById(e['user_id'])
    party = party_mapper.getById(party_id)

    characters = character_mapper.getByPartyId(party['id'])
    monsters = monster_mapper.getByEncounterId(encounter_id)

    combatants = [
        {
            'index': i,
            'initiative': 0,
            'name': c['name'],
            'hit_points': c.get('hit_points', 1),
            'current_hit_points': c.get('hit_points', 1)
            }
            for i, c in enumerate(characters)
        ]
    offset = len(characters)
    combatants.extend([
        {
            'index': offset + i,
            'initiative': 0,
            'name': m['name'],
            'hit_points': m['hit_points'],
            'current_hit_points': m['hit_points']
            }
            for i, m in enumerate(monsters)
        ])

    if request.method == 'POST':
        for c in combatants:
            c['initiative'] = int(request.form.get(
                'initiative-%d' % c['index'], c['initiative']
                ))
            c['current_hit_points'] = c['hit_points']
            c['damage_taken'] = request.form.get(
                'damage-taken-%d' % c['index'], '')
            for m in re.finditer(ur'[+-]?\d+', c['damage_taken']):
                damage = m.group(0)
                try:
                    print c['current_hit_points'], '+=', damage
                    c['current_hit_points'] += int(damage)
                    if c['current_hit_points'] < 0:
                        c['current_hit_points'] = 0
                except:
                    # Can't resolve; oh well
                    pass
        combatants = sorted(
            combatants,
            key=lambda c: c['initiative'],
            reverse=True
            )
    mode = request.form.get('mode', 'initiative')

    info = {}
    for monster in monsters:
        monster = machine.computeMonsterStatistics(monster)
        if monster['id'] not in info:
            info[monster['id']] = {
                'count': 1,
                'monster': monster
                }
        else:
            info[monster['id']]['count'] += 1
    e = encounter_mapper.computeChallenge(e, monsters, party)

    return render_template(
        'show_encounter.html',
        info=config['info'],
        encounter=e,
        mode=mode,
        user=user,
        party=party,
        combatants=combatants,
        monsters=info.values()
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
                'encounter.list'
                ))

        if request.form.get("button", "save") == "update":
            encounter_mapper.update(e)
            return redirect(url_for(
                'encounter.edit',
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
                'encounter.edit',
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
