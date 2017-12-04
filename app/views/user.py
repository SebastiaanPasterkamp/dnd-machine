# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, \
    abort, render_template, flash, jsonify

from .. import get_datamapper
from ..models.user import UserObject
from ..config import get_config

blueprint = Blueprint(
    'user', __name__, template_folder='templates')

def exposeAttributes(user):
    fields = ['id', 'name', 'role']
    if 'admin' in request.user.role \
            or user.id == request.user.id:
        fields = ['id', 'username', 'name', 'email', 'role']

    result = dict([
        (key, user[key])
        for key in fields
        ])

    return result

@blueprint.route('/')
@blueprint.route('/list')
def overview():
    if 'admin' not in request.user['role']:
        abort(403)

    config = get_config()
    datamapper = get_datamapper()

    search = request.args.get('search', '')
    users = datamapper.user.getList(search)
    return render_template(
        'user/overview.html',
        data=config['data'],
        users=users,
        search=search
        )

@blueprint.route('/show/<int:user_id>')
def show(user_id):
    if user_id != request.user['id'] \
            and (
                'role' not in request.user
                or 'admin' not in request.user['role']
                ):
        abort(403)

    config = get_config()
    datamapper = get_datamapper()

    u = datamapper.user.getById(user_id)
    return render_template(
        'user/show.html',
        data=config['data'],
        user=u
        )

@blueprint.route('/edit/<int:user_id>', methods=['GET', 'POST'])
def edit(user_id):
    if user_id != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)

    config = get_config()
    datamapper = get_datamapper()

    u = datamapper.user.getById(user_id)

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'user.show',
                user_id=user_id
                ))

        u.updateFromPost(request.form)

        if request.form.get("button", "save") == "save":
            datamapper.user.update(u)
            return redirect(url_for(
                'user.show',
                user_id=user_id
                ))

    return render_template(
        'user/edit.html',
        data=config['data'],
        user=u
        )


@blueprint.route('/new', methods=['GET', 'POST'])
def new():
    if 'role' not in request.user \
            or 'admin' not in request.user['role']:
        abort(403)

    config = get_config()
    datamapper = get_datamapper()

    u = UserObject()

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'user.show',
                user_id=user_id
                ))

        u.updateFromPost(request.form)

        if request.form.get("button", "save") == "save":
            u = datamapper.user.insert(u)
            return redirect(url_for(
                'user.show',
                user_id=u.id
                ))

    return render_template(
        'user/edit.html',
        data=config['data'],
        user=u
        )


@blueprint.route('/api/<int:user_id>', methods=['GET'])
def api_get(user_id):
    datamapper = get_datamapper()

    user = datamapper.user.getById(user_id)
    if not user:
        return jsonify(user)

    result = exposeAttributes(user)

    return jsonify(result)


@blueprint.route('/api', methods=['POST'])
def api_post():
    if 'admin' not in request.user['role']:
        abort(403)

    datamapper = get_datamapper()
    user = datamapper.user.create(request.get_json())

    if 'id' in user and user.id:
        abort(409, "Cannot create with existing ID")

    user = datamapper.user.insert(user)

    return jsonify(user.config)


@blueprint.route('/api/<int:user_id>', methods=['PATCH'])
def api_patch(user_id):
    datamapper = get_datamapper()
    user = datamapper.user.getById(user_id)
    user.update(request.get_json())

    if 'id' not in user or user.id != user_id:
        abort(409, "Cannot change ID")

    if 'admin' not in request.user.role \
            and user.id != request.user.id:
        abort(409, "User must be owned by User")

    user = datamapper.user.update(user)

    return jsonify(user.config)
