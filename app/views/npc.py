# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, \
    send_file, current_app, abort, render_template, jsonify
import os
import re
import markdown

from .. import get_datamapper
from ..models.base import JsonObject
from ..models.npc import NpcObject
from ..config import get_config, get_npc_data, get_item_data
from ..filters import filter_bonus, filter_unique

npc = Blueprint(
    'npc', __name__, template_folder='templates')

def find_npc_field(npc_data, field, value):
    for data in npc_data[field]:
        for sub in data.get('sub', []):
            if sub['name'] == value:
                return data, sub
        if data['name'] == value:
            return data, None

@npc.route('/')
@npc.route('/list')
def overview():
    datamapper = get_datamapper()

    search = request.args.get('search', '')
    npcs = datamapper.npc.getList(search)

    return render_template(
        'npc/overview.html',
        npcs=npcs,
        search=search
        )

@npc.route('/show/<int:npc_id>')
def show(npc_id):
    items = get_item_data()
    datamapper = get_datamapper()

    n = datamapper.npc.getById(npc_id)

    return render_template(
        'npc/show.html',
        npc=n,
        items=items
        )

@npc.route('/raw/<int:npc_id>')
def raw(npc_id):
    datamapper = get_datamapper()

    n = datamapper.npc.getById(npc_id)

    if 'admin' not in request.user['role']:
        abort(403)
    return jsonify(n.config)

@npc.route('/edit/<int:npc_id>', methods=['GET', 'POST'])
def edit(npc_id):
    datamapper = get_datamapper()

    obj = datamapper.npc.getById(npc_id)

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'npc.show',
                npc_id=npc_id
                ))

        obj.updateFromPost(request.form)

        if request.form.get("button", "save") == "save":
            obj = datamapper.npc.save(obj)
            return redirect(url_for(
                'npc.show',
                npc_id=obj.id
                ))

    return render_template(
        'npc/edit.html',
        reactjs=True,
        npc=obj
        )

@npc.route('/del/<int:npc_id>')
def delete(npc_id):
    datamapper = get_datamapper()

    n = datamapper.npc.getById(npc_id)
    if 'admin' not in request.user['role']:
        abort(403)

    datamapper.npc.delete(n)

    return redirect(url_for(
        'npc.overview'
        ))

@npc.route('/new', methods=['GET', 'POST'])
@npc.route('/new/<int:npc_id>', methods=['GET', 'POST'])
def new(npc_id=None):
    npc_data = get_npc_data()
    datamapper = get_datamapper()

    obj = NpcObject({
        'user_id': request.user.id
        })

    if npc_id:
        obj.id = npc_id

    last = False
    if request.method == 'POST':
        if request.form["button"] == "cancel":
            if npc_id:
                return redirect(url_for(
                    'npc.show',
                    npc_id=npc_id
                    ))
            return redirect(url_for(
                'npc.overview'
                ))

        obj.updateFromPost(request.form)

        for step in ["race", "class"]:
            data, sub = find_npc_field(
                npc_data, step, obj[step]
                )
            obj.update(data.get('config', {}))
            if sub:
                obj.update(sub.get('config', {}))

        if request.form.get("button", "save") == "save":
            obj = datamapper.npc.save(obj)
            return redirect(url_for(
                'npc.edit',
                npc_id=obj.id
                ))

    return render_template(
        'npc/create.html',
        npc_data=npc_data,
        npc=obj
        )

@npc.route('/copy/<int:npc_id>')
@npc.route('/copy/<int:npc_id>/<int:target_id>')
def copy(npc_id, target_id=None):
    config = get_config()
    datamapper = get_datamapper()

    obj = datamapper.npc.getById(npc_id)
    obj = obj.clone()
    if target_id != None:
        target = datamapper.npc.getById(target_id)
        obj.id = target.id
    else:
        obj.name += " (copy)"

    obj = datamapper.npc.save(obj)

    return redirect(url_for(
        'npc.edit',
        npc_id=obj.id
        ))
