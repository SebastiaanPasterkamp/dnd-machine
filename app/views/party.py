# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, \
    abort, render_template, flash, jsonify

from .. import get_datamapper
from ..models.party import PartyObject

blueprint = Blueprint(
    'party', __name__, template_folder='templates')

def exposeAttributes(party):
    fields = ['id', 'user_id', 'name']
    if 'dm' in request.user.role \
            and party.user_id == request.user.id:
        fields = ['id', 'user_id', 'name', 'description', 'challenge']

    result = dict([
        (key, party[key])
        for key in fields
        ])
    result['members'] = [
        character.id
        for character in party.members
        ]

    return result


@blueprint.route('/list')
def overview():
    return render_template(
        'reactjs-layout.html'
        )


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
    if not request.is_xhr:
        return render_template(
            'reactjs-layout.html'
            )

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
    session['party_id'] = party_id or None
    if session['party_id'] is None:
        return jsonify(None)
    return redirect(url_for(
        'party.api_get',
        party_id=party_id
        ))

@blueprint.route('/<int:party_id>/<action>/<int:character_id>')
def modify_members(party_id, action, character_id=None):
    datamapper = get_datamapper()

    party = datamapper.party.getById(party_id)
    if party is None:
        return jsonify(None)

    character = datamapper.character.getById(character_id)
    if character is None:
        return jsonify(None)

    if action == 'add':
        datamapper.party.addCharacter(party_id, character_id)
    else:
        datamapper.party.delCharacter(party_id, character_id)

    datamapper.party.update(party)

    return redirect(url_for(
        'party.api_get',
        party_id=party_id
        ))

@blueprint.route('/<int:party_id>/award_xp/<int:encounter_id>')
def award_xp(party_id, encounter_id=None):
    datamapper = get_datamapper()

    party = datamapper.party.getById(party_id)
    if party is None:
        return jsonify(None)

    encounter = datamapper.encounter.getById(encounter_id)
    if encounter is None:
        return jsonify(None)

    party.members = datamapper.character.getByPartyId(party_id)

    encounter.party = party
    encounter.monsters = \
        datamapper.monster.getByEncounterId(encounter_id)

    for character in party.members:
        character.xp += int(encounter.xp / len(party.members))
        datamapper.character.update(character)

    party.members = datamapper.character.getByPartyId(party_id)
    datamapper.party.update(party)

    return redirect(url_for(
        'party.api_get',
        party_id=party_id
        ))


@blueprint.route('/api', methods=['GET'])
def api_list():
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

    for party in parties:
        party.members = datamapper.character.getByPartyId(party.id)

    return jsonify([
        exposeAttributes(party)
        for party in parties
        ])


@blueprint.route('/api/<int:party_id>', methods=['GET'])
def api_get(party_id):
    datamapper = get_datamapper()

    party = datamapper.party.getById(party_id)
    if not party:
        return jsonify(None)

    party.members = datamapper.character.getByPartyId(party_id)

    result = exposeAttributes(party)
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
    party.members = datamapper.character.getByPartyId(party_id)

    result = exposeAttributes(party)
    return jsonify(result)


@blueprint.route('/recompute/<int:party_id>', methods=['POST'])
def recompute(party_id=None):
    if not any([role in request.user.role for role in ['dm']]):
        abort(403)

    datamapper = get_datamapper()
    update = request.get_json()
    members = update['members']
    del update['members']

    if party_id is None:
        party = datamapper.party.create(request.get_json())
    else:
        party = datamapper.party.getById(party_id)
        party.update(update)

    party.members = [
        datamapper.character.getById(character_id)
        for character_id in members
        ]

    result = exposeAttributes(party)
    return jsonify(result)


@blueprint.route('/api/<int:party_id>', methods=['PATCH'])
def api_patch(party_id):
    if not any([role in request.user.role for role in ['dm']]):
        abort(403)


    update = request.get_json()
    members = update['members']
    del update['members']

    datamapper = get_datamapper()
    party = datamapper.party.getById(party_id)
    party.update(update)

    if 'id' not in party or party.id != party_id:
        abort(409, "Cannot change ID")

    party.members = [
        datamapper.character.getById(character_id)
        for character_id in members
        ]

    party = datamapper.party.update(party)
    party.members = datamapper.character.getByPartyId(party_id)

    result = exposeAttributes(party)
    return jsonify(result)
