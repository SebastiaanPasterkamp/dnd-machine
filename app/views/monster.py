# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify

from .. import get_datamapper
from ..models.monster import MonsterObject
from ..config import get_config

monster = Blueprint(
    'monster', __name__, template_folder='templates')

@monster.route('/')
@monster.route('/list')
@monster.route('/list/<int:encounter_id>')
def overview(encounter_id=None):
    datamapper = get_datamapper()

    encounter = None
    members = []
    if encounter_id is not None:
        encounter = datamapper.encounter.getById(encounter_id)
        members = [
            m.id
            for m in datamapper.monster.getByEncounterId(encounter_id)
            ]

    search = request.args.get('search', '')
    monsters = datamapper.monster.getList(search)

    return render_template(
        'monster/overview.html',
        monsters=monsters,
        encounter=encounter,
        members=members,
        search=search
        )

@monster.route('/show/<int:monster_id>')
def show(monster_id):
    datamapper = get_datamapper()

    m = datamapper.monster.getById(monster_id)
    return render_template(
        'monster/show.html',
        monster=m
        )

@monster.route('/raw/<int:monster_id>')
def raw(monster_id):
    datamapper = get_datamapper()

    m = datamapper.monster.getById(monster_id)
    return jsonify(m.config)

@monster.route('/edit/<int:monster_id>', methods=['GET', 'POST'])
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

@monster.route('/del/<int:monster_id>')
def delete(monster_id):
    datamapper = get_datamapper()

    m = datamapper.monster.getById(monster_id)

    datamapper.monster.delete(m)

    return redirect(url_for(
        'monster.overview'
        ))

@monster.route('/new', methods=['GET', 'POST'])
@monster.route('/copy/<int:monster_id>')
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
