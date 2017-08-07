# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash, current_app

from ..config import get_config
from ..models import datamapper_factory

monster = Blueprint(
    'monster', __name__, template_folder='templates')
monster.config = get_config()

def get_datamapper(datamapper):
    """Returns a datamapper for a type.
    """
    if not hasattr(g, 'datamappers'):
        g.datamappers = {}
    if datamapper not in g.datamappers:
        g.datamappers[datamapper] = datamapper_factory(datamapper)
    return g.datamappers[datamapper]

@monster.route('/')
def home():
    if session.get('userid') is None:
        return redirect(url_for('app.login'))
    return redirect(url_for('monster.list'))

@monster.route('/list')
@monster.route('/list/<int:encounter_id>')
def list(encounter_id=None):
    machine = get_datamapper('machine')
    monster_mapper = get_datamapper('monster')

    encounter = None
    members = []
    if encounter_id is not None:
        encounter_mapper = get_datamapper('encounter')
        encounter = encounter_mapper.getById(encounter_id)
        members = [
            m['id']
            for m in monster_mapper.getByEncounter(encounter_id)
            ]

    search = request.args.get('search', '')
    monsters = monster_mapper.getList(search)
    for m in monsters:
        m = machine.computeMonsterStatistics(m)

    return render_template(
        'list_monsters.html',
        info=monster.config['info'],
        monsters=monsters,
        encounter=encounter,
        members=members,
        search=search
        )

@monster.route('/<int:monster_id>')
def show(monster_id):
    machine = get_datamapper('machine')
    monster_mapper = get_datamapper('monster')

    m = monster_mapper.getById(monster_id)
    m = machine.computeMonsterStatistics(m)
    return render_template(
        'show_monster.html',
        info=monster.config['info'],
        monster=m
        )

@monster.route('/edit/<int:monster_id>', methods=['GET', 'POST'])
def edit(monster_id):
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
    else:
        m = monster_mapper.getById(monster_id)
        m = machine.computeMonsterStatistics(m)

    return render_template(
        'edit_monster.html',
        info=monster.config['info'],
        data=monster.config['data'],
        machine=monster.config['machine'],
        monster=m
        )

@monster.route('/new', methods=['GET', 'POST'])
def new():
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
        info=monster.config['info'],
        data=monster.config['data'],
        machine=monster.config['machine'],
        monster=m
        )
