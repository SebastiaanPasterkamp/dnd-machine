# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify

from ..config import get_config
from . import get_datamapper

user = Blueprint(
    'user', __name__, template_folder='templates')

@user.route('/')
@user.route('/list')
def list():
    if 'role' not in request.user \
            or 'admin' not in request.user['role']:
        abort(403)

    config = get_config()
    user_mapper = get_datamapper('user')

    search = request.args.get('search', '')
    users = user_mapper.getList(search)
    return render_template(
        'list_users.html',
        info=config['info'],
        users=users,
        search=search
        )

@user.route('/show/<int:user_id>')
def show(user_id):
    if user_id != request.user['id'] \
            and (
                'role' not in request.user
                or 'admin' not in request.user['role']
                ):
        abort(403)

    config = get_config()
    user_mapper = get_datamapper('user')

    u = user_mapper.getById(user_id)
    return render_template(
        'show_user.html',
        info=config['info'],
        user=u
        )

@user.route('/edit/<int:user_id>', methods=['GET', 'POST'])
def edit(user_id):
    if user_id != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)

    config = get_config()
    user_mapper = get_datamapper('user')

    u = user_mapper.getById(user_id)

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'user.show',
                user_id=user_id
                ))

        u = user_mapper.fromPost(request.form, u)

        if request.form.get("button", "save") == "save":
            user_mapper.update(u)
            return redirect(url_for(
                'user.show',
                user_id=user_id
                ))

    return render_template(
        'edit_user.html',
        info=config['info'],
        data=config['data'],
        user=u
        )
@user.route('/new', methods=['GET', 'POST'])
def new():
    if 'role' not in request.user \
            or 'admin' not in request.user['role']:
        abort(403)

    config = get_config()
    user_mapper = get_datamapper('user')

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'user.show',
                user_id=user_id
                ))

        u = user_mapper.fromPost(request.form)

        if request.form.get("button", "save") == "save":
            u = user_mapper.insert(u)
            return redirect(url_for(
                'user.show',
                user_id=u['id']
                ))
    else:
        u = {}

    return render_template(
        'edit_user.html',
        info=config['info'],
        data=config['data'],
        user=u
        )
