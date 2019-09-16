# -*- coding: utf-8 -*-
import os
from flask import request, session, redirect, url_for, \
    render_template, jsonify, flash
from flask_mail import Mail, Message
import uuid

from errors import ApiException

def register_paths(app, basemapper, config):
    @app.route('/')
    def home():
        if session.get('user_id') is None:
            return redirect(url_for('login'))
        return redirect(url_for('character.overview'))


    @app.route('/error', methods=["POST"])
    def error():
        data = request.get_json()
        print(data)
        return jsonify({"status": "Received"})

    @app.route('/authenticate')
    def authenticate():
        info = config.get('info', {})
        if config.get('MAIL_USERNAME'):
            info['recoverAction'] = '/recover'
        return jsonify(info)


    @app.route('/current_user')
    def current_user():
        if session.get('user_id') is None:
            return jsonify(None)

        return redirect(url_for(
            'user.api_get',
            obj_id=session.get('user_id')
            ))


    @app.route('/hosted_party')
    def hosted_party():
        return redirect(url_for(
            'party.hosting'
            ))


    @app.route('/navigation')
    def navigation():
        navigation = []

        if session.get('user_id') is None:
            raise ApiException(404, "Page not found")

        navigation.append({
            'label': 'Characters',
            'icon': 'user-secret',
            'path': url_for('character.overview'),
            })
        if request.user.dci:
            navigation.append({
                'label': 'AL logs',
                'icon': 'pencil-square-o', # 'd-and-d',
                'path': url_for('adventureleague.overview'),
                })

        navigation.append({
            'label': 'Parties',
            'icon': 'users',
            'path': url_for('party.overview'),
            })

        dm_group = {
            'label': 'Dungeon Master',
            'roles': ['dm'],
            'icon': 'gavel',
            'items': [],
            }

        dm_group['items'].append({
            'label': 'Monsters',
            'roles': ['dm'],
            'icon': 'paw',
            'path': url_for('monster.overview'),
            })

        dm_group['items'].append({
            'label': 'NPCs',
            'roles': ['dm'],
            'icon': 'commenting-o',
            'path': url_for('npc.overview'),
            })

        dm_group['items'].append({
            'label': 'Encounters',
            'roles': ['dm'],
            'icon': 'gamepad',
            'path': url_for('encounter.overview'),
            })

        dm_group['items'].append({
            'label': 'Campaigns',
            'roles': ['dm'],
            'icon': 'book',
            'path': url_for('campaign.overview'),
            })

        navigation.append(dm_group)

        items_group = {
            'label': 'Items',
            'icon': 'list',
            'items': [],
            }

        items_group['items'].append({
            'label': 'Spells',
            'icon': 'magic',
            'path': url_for('spell.overview'),
            })

        items_group['items'].append({
            'label': 'Languages',
            'icon': 'language',
            'path': url_for('items.overview', item='languages'),
            })

        items_group['items'].append({
            'label': 'Weapons',
            'icon': 'cutlery',
            'path': url_for('weapon.overview'),
            })

        items_group['items'].append({
            'label': 'Armor',
            'icon': 'shield',
            'path': url_for('armor.overview'),
            })

        navigation.append(items_group)

        admin_group = {
            'label': 'Admin',
            'roles': ['admin'],
            'icon': 'address-book',
            'items': [],
            }

        admin_group['items'].append({
            'label': 'Users',
            'roles': ['admin'],
            'icon': 'address-book-o',
            'path': url_for('user.overview'),
            })

        navigation.append(admin_group)

        user_group = {
            'label': request.user.username,
            'icon': 'user-circle',
            'items': [],
            }

        user_group['items'].append({
            'label': 'View profile',
            'icon': 'address-card-o',
            'path': url_for('user.show', obj_id=request.user.id),
            })

        user_group['items'].append({
            'label': "Logout %s" % request.user.username,
            'icon': 'sign-out',
            'path': url_for('logout'),
            })

        navigation.append(user_group)

        def authorized(item):
            if 'items' in item:
                item['items'] = [
                    nav
                    for nav in item['items']
                    if authorized(nav)
                    ]
            if 'items' in item and not len(item['items']):
                return False
            if 'roles' not in item:
                return True
            userRoles = request.user['role']
            if any([r in item['roles'] for r in userRoles]):
                return True
            return False

        navigation = [
            nav
            for nav in navigation
            if authorized(nav)
            ]

        return jsonify(navigation)


    @app.route('/login', methods=['GET'])
    def login():
        return render_template(
            'reactjs-layout.html'
            )


    @app.route('/recover', methods=['GET', 'POST'])
    def recover():
        if request.method != 'POST':
            return render_template(
                'recover.html'
                )

        flash(
            "If your input matched our information for your"
            " registered account, an email has been sent to the"
            " associated email address."
            )

        match = request.form.get("match")
        users = basemapper.user.getMultiple(
            where="username = :match OR email = :match",
            values={"match": match}
            )
        if len(users) != 1:
            return redirect(url_for('login'))
        user = users[0]

        key = str(
            uuid.uuid4().get_hex().upper()[:32]
            )
        user.setRecovery(key)
        basemapper.user.update(user)

        mail = Mail(app)
        msg = Message(
            subject="D&D Machine account recovery",
            sender="D&D Machine <%s>" % (
                app.config.get("MAIL_USERNAME")
                ),
            recipients=[
                "%s <%s>" % (
                    user.name,
                    user.email
                    ),
                ],
            body=render_template(
                'email-recover.txt',
                user=user,
                key=key,
                ),
            html=render_template(
                'email-recover.html',
                user=user,
                key=key,
                )
            )

        img_path = os.path.join(app.static_folder, 'img', 'd20.png')
        with open(img_path, 'rb') as img:
            msg.attach(
                'd20.png',
                'image/png',
                img.read(),
                'inline',
                headers=[['Content-ID','<d20>']],
                )

        mail.send(msg)
        return redirect(url_for('login'))


    @app.route('/recover/<int:id>/<string:key>', methods=['GET', 'POST'])
    def recovery(id, key):
        user = basemapper.user.getById(id)
        if user is None:
            return redirect(url_for('recover'))
        if not user.checkRecovery(key):
            return redirect(url_for('recover'))

        if request.method != 'POST':
            return render_template(
                'recovery.html',
                user=user,
                key=key,
                )

        pwd1, pwd2 = (
            request.form['pwd1'],
            request.form['pwd2'],
            )
        if pwd1 != pwd2:
            flash("The passwords didn't match")
            return redirect(url_for(
                'recovery',
                id=id,
                key=key,
                ))
        if len(pwd1) < 8:
            flash("The password is too short")
            return redirect(url_for(
                'recovery',
                id=id,
                key=key,
                ))

        user.setPassword(pwd1)
        del user.recovery
        users = basemapper.user.update(user)

        flash("credentials updated. You can log in now.")
        return redirect(url_for('login'))



    @app.route('/login', methods=['POST'])
    def doLogin():
        credentials = request.get_json()
        user = basemapper.user.getByCredentials(
            credentials.get('username'),
            credentials.get('password')
            )

        if user is None:
            response = jsonify({
                'message': 'Login failed'
                })
            response.status_code = 401
            return response
        else:
            session['user_id'] = user.id
            return redirect(url_for('current_user'))


    @app.route('/logout')
    def logout():
        session.pop('user_id', None)
        session.pop('user', None)
        session.pop('party_id', None)
        return jsonify(None)

def with_app(app, basemapper, config):
    register_paths(app, basemapper, config)
