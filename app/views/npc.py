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

blueprint = Blueprint(
    'npc', __name__, template_folder='templates')

def find_npc_field(npc_data, field, value):
    for data in npc_data[field]:
        for sub in data.get('sub', []):
            if sub['name'] == value:
                return data, sub
        if data['name'] == value:
            return data, None

@blueprint.route('/')
@blueprint.route('/list')
def overview():
    datamapper = get_datamapper()

    search = request.args.get('search', '')
    npcs = datamapper.npc.getList(search)

    return render_template(
        'npc/overview.html',
        npcs=npcs,
        search=search
        )

@blueprint.route('/show/<int:npc_id>')
def show(npc_id):
    items = get_item_data()
    datamapper = get_datamapper()

    npc = datamapper.npc.getById(npc_id)

    return render_template(
        'npc/show.html',
        npc=npc,
        items=items
        )

@blueprint.route('/raw/<int:npc_id>')
def raw(npc_id):
    datamapper = get_datamapper()

    npc = datamapper.npc.getById(npc_id)

    if 'admin' not in request.user['role']:
        abort(403)
    return jsonify(npc.config)


@blueprint.route('/edit/<int:npc_id>')
def edit(npc_id):
    return render_template(
        'reactjs-layout.html'
        )

@blueprint.route('/del/<int:npc_id>')
def delete(npc_id):
    if 'admin' not in request.user['role']:
        abort(403)

    datamapper = get_datamapper()
    npc = datamapper.npc.getById(npc_id)
    datamapper.npc.delete(npc)

    return redirect(url_for(
        'npc.overview'
        ))

@blueprint.route('/new', methods=['GET', 'POST'])
@blueprint.route('/new/<int:npc_id>', methods=['GET', 'POST'])
def new(npc_id=None):
    npc_data = get_npc_data()
    datamapper = get_datamapper()

    npc = NpcObject({
        'user_id': request.user.id
        })

    if npc_id:
        npc.id = npc_id

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

        npc.updateFromPost(request.form)

        for step in ["race", "class"]:
            data, sub = find_npc_field(
                npc_data, step, npc[step]
                )
            npc.update(data.get('config', {}))
            if sub:
                npc.update(sub.get('config', {}))

        if request.form.get("button", "save") == "save":
            npc = datamapper.npc.save(npc)
            return redirect(url_for(
                'npc.edit',
                npc_id=npc.id
                ))

    return render_template(
        'npc/create.html',
        npc_data=npc_data,
        npc=npc
        )

@blueprint.route('/copy/<int:npc_id>')
@blueprint.route('/copy/<int:npc_id>/<int:target_id>')
def copy(npc_id, target_id=None):
    config = get_config()
    datamapper = get_datamapper()

    npc = datamapper.npc.getById(npc_id)
    npc = npc.clone()
    if target_id != None:
        target = datamapper.npc.getById(target_id)
        npc.id = target.id
    else:
        npc.name += " (copy)"

    npc = datamapper.npc.save(npc)

    return redirect(url_for(
        'npc.edit',
        npc_id=npc.id
        ))


@blueprint.route('/api/<int:npc_id>', methods=['GET'])
def api_get(npc_id):
    if 'dm' not in request.user['role']:
        abort(403)

    datamapper = get_datamapper()
    npc = datamapper.npc.getById(npc_id)
    return jsonify(npc.config)


@blueprint.route('/api', methods=['POST'])
def api_post():
    if 'dm' not in request.user['role']:
        abort(403)

    datamapper = get_datamapper()

    npc = datamapper.npc.create(request.get_json())
    if 'id' in npc and npc.id:
        abort(409, "Cannot create with existing ID")
    npc = datamapper.npc.insert(npc)

    return jsonify(npc.config)


@blueprint.route('/api/<int:npc_id>', methods=['PATCH'])
def api_patch(npc_id):
    if 'dm' not in request.user['role']:
        abort(403)

    datamapper = get_datamapper()

    npc = datamapper.npc.create(request.get_json())
    if 'id' not in npc or npc.id != npc_id:
        abort(409, "Cannot change ID")
    npc = datamapper.npc.update(npc)

    return jsonify(npc.config)
