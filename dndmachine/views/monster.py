# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify

from ..models.monster import MonsterObject
from ..config import get_config
from ..utils import get_datamapper

monster = Blueprint(
    'monster', __name__, template_folder='templates')

@monster.route('/')
@monster.route('/list')
@monster.route('/list/<int:encounter_id>')
def overview(encounter_id=None):
    monster_mapper = get_datamapper('monster')

    encounter = None
    members = []
    if encounter_id is not None:
        encounter_mapper = get_datamapper('encounter')
        encounter = encounter_mapper.getById(encounter_id)
        members = [
            m['id']
            for m in monster_mapper.getByEncounterId(encounter_id)
            ]

    search = request.args.get('search', '')
    monsters = monster_mapper.getList(search)

    return render_template(
        'monster/overview.html',
        monsters=monsters,
        encounter=encounter,
        members=members,
        search=search
        )

@monster.route('/<int:monster_id>')
def show(monster_id):
    monster_mapper = get_datamapper('monster')

    m = monster_mapper.getById(monster_id)
    return render_template(
        'monster/show.html',
        monster=m
        )

@monster.route('/edit/<int:monster_id>', methods=['GET', 'POST'])
def edit(monster_id):
    config = get_config()
    machine = get_datamapper('machine')
    monster_mapper = get_datamapper('monster')

    m = monster_mapper.getById(monster_id)

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'monster.show',
                monster_id=monster_id
                ))

        m.updateFromPost(request.form)

        if request.form.get("button", "save") == "save":
            m = monster_mapper.update(m)
            return redirect(url_for(
                'monster.show',
                monster_id=monster_id
                ))

        if request.form.get("button", "save") == "update":
            monster_mapper.update(m)

    return render_template(
        'monster/edit.html',
        data=config['data'],
        machine=config['machine'],
        monster=m
        )

@monster.route('/del/<int:monster_id>')
def delete(monster_id):
    monster_mapper = get_datamapper('monster')

    m = monster_mapper.getById(monster_id)

    monster_mapper.delete(m)

    return redirect(url_for(
        'monster.overview'
        ))

@monster.route('/new', methods=['GET', 'POST'])
@monster.route('/copy/<int:monster_id>')
def new(monster_id=None):
    config = get_config()
    machine = get_datamapper('machine')
    monster_mapper = get_datamapper('monster')

    if monster_id is None:
        m = MonsterObject()
    else:
        m = monster_mapper.getById(monster_id)
        m.id = None

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'monster.overview'
                ))

        m.updateFromPost(request.form)

        if request.form.get("button", "save") == "save":
            m = monster_mapper.insert(m)
            return redirect(url_for(
                'monster.show',
                monster_id=m['id']
                ))

    return render_template(
        'monster/edit.html',
        data=config['data'],
        machine=config['machine'],
        monster=m
        )
