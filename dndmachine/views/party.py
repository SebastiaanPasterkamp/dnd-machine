# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash

from ..models.party import PartyObject
from ..utils import get_datamapper

party = Blueprint(
    'party', __name__, template_folder='templates')

@party.route('/')
@party.route('/list')
def overview():
    party_mapper = get_datamapper('party')
    character_mapper = get_datamapper('character')

    search = request.args.get('search', '')
    parties = party_mapper.getList(search)

    if 'admin' not in request.user.role:
        visibleParties = set()
        if 'player' in request.user.role:
            visibleParties |= set([
                party.id
                for party in party_mapper.getByUserId(request.user.id)
                ])
            print 'player', visibleParties
        if 'dm' in request.user.role:
            visibleParties |= set([
                party.id
                for party in party_mapper.getByDmUserId(request.user.id)
                ])
            print 'dm', visibleParties
        parties = [
            party
            for party in parties
            if party.id in visibleParties
            ]

    for party in parties:
        party.members = character_mapper.getByPartyId(party.id)

    return render_template(
        'party/overview.html',
        parties=parties,
        search=search
        )

@party.route('/show/<int:party_id>')
def show(party_id):
    party_mapper = get_datamapper('party')
    user_mapper = get_datamapper('user')
    character_mapper = get_datamapper('character')
    encounter_mapper = get_datamapper('encounter')
    machine = get_datamapper('machine')

    p = party_mapper.getById(party_id)
    p.members = character_mapper.getByPartyId(party_id)

    user = user_mapper.getById(p['user_id'])

    return render_template(
        'party/show.html',
        party=p,
        user=user,
        characters=p.members
        )

@party.route('/edit/<int:party_id>', methods=['GET', 'POST'])
def edit(party_id):
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

        p.updateFromPost(request.form)

        if request.form.get("button", "save") == "save":
            party_mapper.update(p)
            return redirect(url_for(
                'party.show',
                party_id=party_id
                ))

    return render_template(
        'party/edit.html',
        party=p
        )

@party.route('/del/<int:party_id>')
def delete(party_id):
    party_mapper = get_datamapper('party')

    p = party_mapper.getById(party_id)
    party_mapper.delete(p)

    return redirect(url_for(
        'party.overview'
        ))

@party.route('/new', methods=['GET', 'POST'])
def new():
    party_mapper = get_datamapper('party')

    p = PartyObject({
        'user_id': request.user['id']
        })

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'party.overview'
                ))

        p.updateFromPost(request.form)

        if request.form.get("button", "save") == "save":
            p = party_mapper.insert(p)
            return redirect(url_for(
                'party.show',
                party_id=p['id']
                ))

    return render_template(
        'party/edit.html',
        party=p
        )

@party.route('/host/<int:party_id>')
def host(party_id):
    session['party_id'] = party_id
    return redirect(request.referrer)

@party.route('/<int:party_id>/<action>_character/<int:character_id>')
@party.route('/<int:party_id>/award_<action>/<int:encounter_id>')
def modify(party_id, action, character_id=None, encounter_id=None):
    party_mapper = get_datamapper('party')
    character_mapper = get_datamapper('character')

    print 'modify', party_id, action, character_id, encounter_id

    p = party_mapper.getById(party_id)
    character = character_mapper.getById(character_id)

    if action == 'add' and character_id:
        party_mapper.addCharacter(party_id, character_id)
        flash(
            "The Character '%s' was added to Party '%s'." % (
                character.name,
                p.name
                ),
            'info'
            )
    elif action == 'del' and character_id:
        party_mapper.delCharacter(party_id, character_id)
        flash(
            "The Character '%s' was removed from Party '%s'." % (
                character.name,
                p.name
                ),
            'info'
            )
    elif action == 'xp' and encounter_id:
        encounter_mapper = get_datamapper('encounter')
        monster_mapper = get_datamapper('monster')

        p.members = character_mapper.getByPartyId(party_id)

        encounter = encounter_mapper.getById(encounter_id)
        encounter.party = p
        encounter.monsters = monster_mapper.getByEncounterId(encounter_id)

        for character in p.members:
            character.xp += int(encounter.xp / len(p.members))
            character_mapper.update(character)

        flash(
            "The Characters have been rewarded %d XP (%d / %d)." % (
                int(encounter.xp / len(p.members)),
                encounter.xp, len(p.members)
                ),
            'info'
            )
    else:
        flash("Unknown action '%s' or missing parameter(s)." % action, 'error')

    p.members = character_mapper.getByPartyId(party_id)

    party_mapper.update(p)

    return redirect(request.referrer)
