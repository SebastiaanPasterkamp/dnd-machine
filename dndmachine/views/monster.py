# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash, current_app

from ..config import get_config
from . import get_datamapper

monster = Blueprint(
    'monster', __name__, template_folder='templates')

@monster.route('/')
@monster.route('/list')
@monster.route('/list/<int:encounter_id>')
def list(encounter_id=None):
    config = get_config()
    machine = get_datamapper('machine')
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
    for m in monsters:
        m = machine.computeMonsterStatistics(m)

    return render_template(
        'list_monsters.html',
        info=config['info'],
        monsters=monsters,
        encounter=encounter,
        members=members,
        search=search
        )

@monster.route('/<int:monster_id>')
def show(monster_id):
    config = get_config()
    machine = get_datamapper('machine')
    monster_mapper = get_datamapper('monster')

    m = monster_mapper.getById(monster_id)
    m = machine.computeMonsterStatistics(m)
    return render_template(
        'show_monster.html',
        info=config['info'],
        monster=m
        )

@monster.route('/edit/<int:monster_id>', methods=['GET', 'POST'])
def edit(monster_id):
    config = get_config()
    machine = get_datamapper('machine')
    monster_mapper = get_datamapper('monster')

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'monster.show',
                monster_id=monster_id
                ))

        m = monster_mapper.fromPost(request.form)
        m = machine.computeMonsterStatistics(m)
        m['id'] = monster_id

        if request.form.get("button", "save") == "save":
            monster_mapper.update(m)
            return redirect(url_for(
                'monster.show',
                monster_id=monster_id
                ))

        if request.form.get("button", "save") == "update":
            monster_mapper.update(m)
            return redirect(url_for(
                'monster.edit',
                monster_id=monster_id
                ))
    else:
        m = monster_mapper.getById(monster_id)
        m = machine.computeMonsterStatistics(m)

    return render_template(
        'edit_monster.html',
        info=config['info'],
        data=config['data'],
        machine=config['machine'],
        monster=m
        )

@monster.route('/new', methods=['GET', 'POST'])
def new():
    config = get_config()
    machine = get_datamapper('machine')
    monster_mapper = get_datamapper('monster')

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'monster.list'
                ))

        m = monster_mapper.fromPost(request.form)
        m = machine.computeMonsterStatistics(m)

        if request.form.get("button", "save") == "save":
            m = monster_mapper.insert(m)
            return redirect(url_for(
                'monster.show',
                monster_id=m['id']
                ))
    else:
        m = monster_mapper.setDefaults({})
        m = machine.computeMonsterStatistics(m)

    return render_template(
        'edit_monster.html',
        info=config['info'],
        data=config['data'],
        machine=config['machine'],
        monster=m
        )
