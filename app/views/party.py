# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, \
    abort, render_template, flash, jsonify

from .. import get_datamapper
from ..models.party import PartyObject

blueprint = Blueprint(
    'party', __name__, template_folder='templates')

@blueprint.route('/')
def overview():
    if not request.is_xhr:
        return render_template(
            'reactjs-layout.html'
            )

    datamapper = get_datamapper()
    parties = datamapper.party.getMultiple()

    if 'admin' not in request.user.role:
        visibleParties = set()
        if 'player' in request.user.role:
            visibleParties |= set([
                party.id
                for party in datamapper.party.getByUserId(request.user.id)
                ])

        if 'dm' in request.user.role:
            visibleParties |= set([
                party.id
                for party in datamapper.party.getByDmUserId(request.user.id)
                ])

        parties = [
            party
            for party in parties
            if party.id in visibleParties
            ]

    members = {}
    for party in parties:
        members[party.id] = datamapper.party.getMemberIds(party.id)

    fields = [
        'id', 'name', 'challenge'
        ]

    return jsonify([
        dict(
            [('members', members[party.id])]
            + [(key, party[key]) for key in fields]
            )
        for party in parties
        ])


@blueprint.route('/show/<int:party_id>')
def show(party_id):
    datamapper = get_datamapper()

    p = datamapper.party.getById(party_id)
    p.members = datamapper.character.getByPartyId(party_id)

    user = datamapper.user.getById(p['user_id'])

    return render_template(
        'party/show.html',
        party=p,
        user=user,
        characters=p.members
        )

@blueprint.route('/edit/<int:party_id>', methods=['GET', 'POST'])
def edit(party_id):
    datamapper = get_datamapper()

    p = datamapper.party.getById(party_id)
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
            datamapper.party.update(p)
            return redirect(url_for(
                'party.show',
                party_id=party_id
                ))

    return render_template(
        'party/edit.html',
        party=p
        )

@blueprint.route('/del/<int:party_id>')
def delete(party_id):
    datamapper = get_datamapper()

    p = datamapper.party.getById(party_id)
    datamapper.party.delete(p)

    return redirect(url_for(
        'party.overview'
        ))

@blueprint.route('/new', methods=['GET', 'POST'])
def new():
    datamapper = get_datamapper()

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
            p = datamapper.party.insert(p)
            return redirect(url_for(
                'party.show',
                party_id=p['id']
                ))

    return render_template(
        'party/edit.html',
        party=p
        )

@blueprint.route('/host/<int:party_id>')
def host(party_id):
    session['party_id'] = party_id
    return redirect(request.referrer)

@blueprint.route('/<int:party_id>/<action>_character/<int:character_id>')
@blueprint.route('/<int:party_id>/award_<action>/<int:encounter_id>')
def modify(party_id, action, character_id=None, encounter_id=None):
    datamapper = get_datamapper()

    p = datamapper.party.getById(party_id)
    character = datamapper.character.getById(character_id)

    if action == 'add' and character_id:
        datamapper.party.addCharacter(party_id, character_id)
        flash(
            "The Character '%s' was added to Party '%s'." % (
                character.name,
                p.name
                ),
            'info'
            )
    elif action == 'del' and character_id:
        datamapper.party.delCharacter(party_id, character_id)
        flash(
            "The Character '%s' was removed from Party '%s'." % (
                character.name,
                p.name
                ),
            'info'
            )
    elif action == 'xp' and encounter_id:
        p.members = datamapper.character.getByPartyId(party_id)

        encounter = datamapper.encounter.getById(encounter_id)
        encounter.party = p
        encounter.monsters = datamapper.monster.getByEncounterId(encounter_id)

        for character in p.members:
            character.xp += int(encounter.xp / len(p.members))
            datamapper.character.update(character)

        flash(
            "The Characters have been rewarded %d XP (%d / %d)." % (
                int(encounter.xp / len(p.members)),
                encounter.xp, len(p.members)
                ),
            'info'
            )
    else:
        flash("Unknown action '%s' or missing parameter(s)." % action, 'error')

    p.members = datamapper.character.getByPartyId(party_id)

    datamapper.party.update(p)

    return redirect(request.referrer)


@blueprint.route('/api/<int:party_id>', methods=['GET'])
def api_get(party_id):
    datamapper = get_datamapper()

    party = datamapper.party.getById(party_id)
    party.members = datamapper.character.getByPartyId(party_id)

    fields = ['id', 'user_id', 'name', 'challenge']
    if 'dm' not in request.user.role \
            or party.user_id != request.user.id:
        fields = ['id', 'user_id', 'name']

    result = dict([
        (key, party[key])
        for key in fields
        ])
    result['members'] = [
        character.id
        for character in party.members
        ]

    return jsonify(result)


@blueprint.route('/api', methods=['POST'])
def api_post():
    if not any([role in request.user.role for role in ['dm']]):
        abort(403)

    datamapper = get_datamapper()
    party = datamapper.party.create(request.get_json())

    if 'id' in party and party.id:
        abort(409, "Cannot create with existing ID")

    party = datamapper.party.insert(party)

    return jsonify(party.config)


@blueprint.route('/api/<int:party_id>', methods=['PATCH'])
def api_patch(party_id):
    if not any([role in request.user.role for role in ['dm']]):
        abort(403)

    datamapper = get_datamapper()
    party = datamapper.party.create(request.get_json())

    if 'id' not in party or party.id != party_id:
        abort(409, "Cannot change ID")

    party = datamapper.party.update(party)

    return jsonify(party.config)
