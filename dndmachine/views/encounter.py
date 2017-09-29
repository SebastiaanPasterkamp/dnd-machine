# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, \
    abort, render_template, jsonify, flash
import re

from ..models.encounter import EncounterObject
from ..utils import get_datamapper

encounter = Blueprint(
    'encounter', __name__, template_folder='templates')

@encounter.route('/')
@encounter.route('/list')
def overview(encounter_id=None):
    encounter_mapper = get_datamapper('encounter')

    search = request.args.get('search', '')
    encounters = encounter_mapper.getList(search)
    monster_mapper = get_datamapper('monster')

    if 'admin' not in request.user['role']:
        encounters = [
            e
            for e in encounters
            if e.user_id == request.user.id
            ]

    for e in encounters:
        e.monsters = monster_mapper.getByEncounterId(e.id)
    if request.party:
        for e in encounters:
            e.party = request.party

    return render_template(
        'encounter/overview.html',
        encounters=encounters,
        search=search
        )

@encounter.route('/show/<int:encounter_id>')
@encounter.route('/show/<int:encounter_id>/<int:party_id>', methods=['GET', 'POST'])
def show(encounter_id, party_id=None):
    if party_id is None:
        if request.party:
            return redirect( url_for('encounter.show', encounter_id=encounter_id, party_id=request.party.id) )
        return redirect( url_for('party.overview', encounter_id=encounter_id) )

    encounter_mapper = get_datamapper('encounter')
    user_mapper = get_datamapper('user')
    party_mapper = get_datamapper('party')
    character_mapper = get_datamapper('character')
    monster_mapper = get_datamapper('monster')

    e = encounter_mapper.getById(encounter_id)
    user = user_mapper.getById(e.user_id)

    party = party_mapper.getById(party_id)
    party.members = character_mapper.getByPartyId(party_id)
    e.party = party

    e.monsters = monster_mapper.getByEncounterId(encounter_id)

    combatants = [
        {
            'index': i,
            'type': 'pc',
            'initiative': 0,
            'name': c.name,
            'hit_points': c.hit_points,
            'current_hit_points': c.hit_points,
            'damage_taken': u'',
            'notes': u''
            }
            for i, c in enumerate(e.party.members)
        ]
    offset = len(e.party.members)
    combatants.extend([
        {
            'index': offset + i,
            'type': 'npc',
            'initiative': 0,
            'name': m.name,
            'hit_points': m.hit_points,
            'current_hit_points': m.hit_points,
            'damage_taken': u'',
            'notes': u''
            }
            for i, m in enumerate(e.monsters)
        ])

    initiative_dm = 0

    if request.method == 'POST':
        initiative_dm = int(request.form.get('initiative-dm', 0))
        for c in combatants:
            if c['type'] == 'pc':
                c['initiative'] = int(request.form.get(
                    'initiative-%d' % c['index'], c['initiative']
                    ))
            else:
                c['initiative'] = initiative_dm
            c['current_hit_points'] = int(c['hit_points'])
            c['notes'] = request.form.get('notes-%d' % c['index'], u'')
            c['damage_taken'] = request.form.get(
                'damage-taken-%d' % c['index'], '')
            for m in re.finditer(ur'[+-]?\d+', c['damage_taken']):
                damage = m.group(0)
                try:
                    c['current_hit_points'] -= int(damage)
                    if c['current_hit_points'] < 0:
                        c['current_hit_points'] = 0
                except:
                    # Can't resolve; oh well
                    pass
        combatants = sorted(
            combatants,
            key=lambda c: (c['current_hit_points'] > 0, c['initiative']),
            reverse=True
            )
    mode = request.form.get('mode', 'initiative')

    info = {}
    for monster in e.monsters:
        if monster.id not in info:
            info[monster.id] = {
                'count': 1,
                'monster': monster
                }
        else:
            info[monster.id]['count'] += 1

    return render_template(
        'encounter/show.html',
        encounter=e,
        mode=mode,
        user=user,
        party=e.party,
        initiative_dm=initiative_dm,
        combatants=combatants,
        monsters=info.values()
        )

@encounter.route('/edit/<int:encounter_id>', methods=['GET', 'POST'])
def edit(encounter_id):
    encounter_mapper = get_datamapper('encounter')
    monster_mapper = get_datamapper('monster')
    machine = get_datamapper('machine')

    e = encounter_mapper.getById(encounter_id)
    if e.user_id != request.user.id \
            and 'admin' not in request.user.role:
        abort(403)
    e.monsters = monster_mapper.getByEncounterId(encounter_id)

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'encounter.show',
                encounter_id=encounter_id
                ))

        e.updateFromPost(request.form)

        if request.form.get("button", "save") == "save":
            encounter_mapper.update(e)
            return redirect(url_for(
                'encounter.show',
                encounter_id=encounter_id
                ))

        if request.form.get("button", "save") == "update":
            encounter_mapper.update(e)
            return redirect(url_for(
                'encounter.edit',
                encounter_id=encounter_id
                ))

    e.monsters = monster_mapper.getByEncounterId(encounter_id)

    return render_template(
        'encounter/edit.html',
        encounter=e,
        monsters=e.monsters
        )

@encounter.route('/del/<int:encounter_id>')
def delete(encounter_id):
    encounter_mapper = get_datamapper('encounter')

    e = encounter_mapper.getById(encounter_id)
    if e.user_id != request.user.id \
            and 'admin' not in request.user.role:
        abort(403)

    encounter_mapper.delete(e)

    return redirect(url_for(
        'encounter.overview'
        ))

@encounter.route('/new', methods=['GET', 'POST'])
def new():
    encounter_mapper = get_datamapper('encounter')

    e = EncounterObject({
        'user_id': request.user.id
        })

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'encounter.overview'
                ))

        e.updateFromPost(request.form)

        if request.form.get("button", "save") == "save":
            e = encounter_mapper.insert(e)
            return redirect(url_for(
                'encounter.edit',
                encounter_id=e.id
                ))

    return render_template(
        'encounter/edit.html',
        encounter=e
        )

@encounter.route('/<int:encounter_id>/<action>/<int:monster_id>')
def modify(encounter_id, action, monster_id):
    encounter_mapper = get_datamapper('encounter')
    monster_mapper = get_datamapper('monster')

    e = encounter_mapper.getById(encounter_id)
    monster = monster_mapper.getById(monster_id)

    if action == 'add':
        encounter_mapper.addMonster(encounter_id, monster_id)
        flash(
            "The Monster '%s' was added to Encounter '%s'." % (
                monster.name,
                e.name
                ),
            'info'
            )
    elif action == 'del':
        encounter_mapper.delMonster(encounter_id, monster_id)
        flash(
            "The Monster '%s' was removed from Encounter '%s'." % (
                monster.name,
                e.name
                ),
            'info'
            )
    else:
        flash("Unknown action '%s'." % action, 'error')

    e.monsters = monster_mapper.getByEncounterId(encounter_id)
    encounter_mapper.update(e)

    return redirect(request.referrer)
