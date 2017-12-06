# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify

from .. import get_datamapper
from ..models.monster import MonsterObject
from ..config import get_config

blueprint = Blueprint(
    'monster', __name__, template_folder='templates')

def exposeAttributes(monster):
    fields = ['id', 'name', 'challenge_rating', 'xp', 'xp_rating']

    result = dict([
        (key, monster[key])
        for key in fields
        ])

    return result


@blueprint.route('/list')
def overview(encounter_id=None):
    if not request.is_xhr:
        return render_template(
            'reactjs-layout.html'
            )

    datamapper = get_datamapper()

    monsters = datamapper.monster.getMultiple()

    return jsonify([
        exposeAttributes(monster)
        for monster in monsters
        ])

@blueprint.route('/show/<int:monster_id>')
def show(monster_id):
    datamapper = get_datamapper()

    m = datamapper.monster.getById(monster_id)
    return render_template(
        'monster/show.html',
        monster=m
        )

@blueprint.route('/raw/<int:monster_id>')
def raw(monster_id):
    datamapper = get_datamapper()

    m = datamapper.monster.getById(monster_id)
    return jsonify(m.config)

@blueprint.route('/edit/<int:monster_id>', methods=['GET', 'POST'])
def edit(monster_id):
    config = get_config()
    datamapper = get_datamapper()

    m = datamapper.monster.getById(monster_id)

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'monster.show',
                monster_id=monster_id
                ))

        m.updateFromPost(request.form)

        if request.form.get("button", "save") == "save":
            m = datamapper.monster.update(m)
            return redirect(url_for(
                'monster.show',
                monster_id=monster_id
                ))

        if request.form.get("button", "save") == "update":
            datamapper.monster.update(m)

    return render_template(
        'monster/edit.html',
        languages=datamapper.items.getList(
            'languages.common,languages.exotic'
            ),
        machine=config['machine'],
        monster=m
        )

@blueprint.route('/del/<int:monster_id>')
def delete(monster_id):
    datamapper = get_datamapper()

    m = datamapper.monster.getById(monster_id)

    datamapper.monster.delete(m)

    return redirect(url_for(
        'monster.overview'
        ))

@blueprint.route('/new', methods=['GET', 'POST'])
@blueprint.route('/copy/<int:monster_id>')
def new(monster_id=None):
    config = get_config()
    datamapper = get_datamapper()

    if monster_id is None:
        m = MonsterObject()
    else:
        m = datamapper.monster.getById(monster_id)
        m = m.clone()

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'monster.overview'
                ))

        m.updateFromPost(request.form)

        if request.form.get("button", "save") == "save":
            m = datamapper.monster.insert(m)
            return redirect(url_for(
                'monster.show',
                monster_id=m['id']
                ))

    return render_template(
        'monster/edit.html',
        languages=datamapper.items.getList(
            'languages.common,languages.exotic'
            ),
        machine=config['machine'],
        monster=m
        )


@blueprint.route('/api/<int:monster_id>', methods=['GET'])
def api_get(monster_id):
    datamapper = get_datamapper()

    monster = datamapper.monster.getById(monster_id)
    if not monster:
        return jsonify(None)

    result = exposeAttributes(monster)
    return jsonify(result)


@blueprint.route('/api', methods=['POST'])
def api_post():
    if not any([role in request.user.role for role in ['dm']]):
        abort(403)

    datamapper = get_datamapper()
    monster = datamapper.monster.create(request.get_json())

    if 'id' in monster and monster.id:
        abort(409, "Cannot create with existing ID")

    monster = datamapper.monster.insert(monster)

    result = exposeAttributes(monster)
    return jsonify(result)


@blueprint.route('/recompute/<int:monster_id>', methods=['POST'])
def recompute(monster_id=None):
    if not any([role in request.user.role for role in ['dm']]):
        abort(403)

    datamapper = get_datamapper()

    if monster_id is None:
        monster = datamapper.monster.create(request.get_json())
    else:
        monster = datamapper.monster.getById(monster_id)
        monster.update(request.get_json())

    result = exposeAttributes(monster)
    return jsonify(result)


@blueprint.route('/api/<int:monster_id>', methods=['PATCH'])
def api_patch(monster_id):
    if not any([role in request.user.role for role in ['dm']]):
        abort(403)


    update = request.get_json()
    members = update['members']
    del update['members']

    datamapper = get_datamapper()
    monster = datamapper.monster.getById(monster_id)
    monster.update(update)

    if 'id' not in monster or monster.id != monster_id:
        abort(409, "Cannot change ID")

    monster = datamapper.monster.update(monster)

    result = exposeAttributes(monster)
    return jsonify(result)
