# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, \
    abort, render_template, flash, jsonify

from .. import get_datamapper
from ..models.user import UserObject
from ..config import get_config

user = Blueprint(
    'user', __name__, template_folder='templates')

@user.route('/')
@user.route('/list')
def overview():
    if 'role' not in request.user \
            or 'admin' not in request.user['role']:
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

@user.route('/show/<int:user_id>')
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

@user.route('/edit/<int:user_id>', methods=['GET', 'POST'])
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
@user.route('/new', methods=['GET', 'POST'])
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
