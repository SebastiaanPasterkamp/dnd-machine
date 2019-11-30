# -*- coding: utf-8 -*-
import os
from flask import request, session, redirect, url_for, \
    render_template, jsonify, flash, get_flashed_messages
from flask_mail import Mail, Message
import uuid
from oauthlib.oauth2 import WebApplicationClient
import json
import requests

from errors import ApiException

def register_paths(app):
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
        info = app.config.get('info', {})
        info['footer'] = app.config.get('footer', [])
        if app.config.get('MAIL_USERNAME'):
            info['recoverAction'] = '/recover'
        if app.config.get('GOOGLE_CLIENT_ID'):
            info['googleAuth'] = True
        return jsonify(info)


    @app.route('/current_user')
    def current_user():
        if session.get('user_id') is None:
            return jsonify(None)

        return redirect(url_for(
            'user.api_get',
            obj_id=session.get('user_id')
            ))


    @app.route('/messages')
    def messages():
        return jsonify(get_flashed_messages(True))


    @app.route('/hosted_party')
    def hosted_party():
        return redirect(url_for(
            'party.hosting'
            ))


    @app.route('/current_campaign')
    def current_campaign():
        return redirect(url_for(
            'campaign.get_current'
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
        users = app.datamapper.user.getMultiple(
            where="username = :match OR email = :match",
            values={"match": match}
            )
        if len(users) != 1:
            return redirect(url_for('login'))
        user = users[0]

        key = str(
            uuid.uuid4().hex.upper()[:32]
            )
        user.setRecovery(key)
        app.datamapper.user.update(user)

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
        user = app.datamapper.user.getById(id)
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
            flash("The passwords didn't match", 'error')
            return redirect(url_for(
                'recovery',
                id=id,
                key=key,
                ))
        if len(pwd1) < 8:
            flash("The password is too short", 'error')
            return redirect(url_for(
                'recovery',
                id=id,
                key=key,
                ))

        user.setPassword(pwd1)
        del user.recovery
        users = app.datamapper.user.update(user)

        flash("Credentials updated. You can log in now.", 'success')
        return redirect(url_for('login'))


    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method != 'POST':
            return render_template(
                'reactjs-layout.html'
                )

        credentials = request.get_json()
        user = app.datamapper.user.getByCredentials(
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


    @app.route('/login/google', methods=['GET'])
    def login_with_google():
        client = WebApplicationClient(app.config.get('GOOGLE_CLIENT_ID'))
        google_provider_cfg = requests.get(app.config.get('GOOGLE_DISCOVERY_URL')).json()

        authorization_endpoint = google_provider_cfg["authorization_endpoint"]

        # Use library to construct the request for Google login and provide
        # scopes that let you retrieve user's profile from Google
        request_uri = client.prepare_request_uri(
            authorization_endpoint,
            redirect_uri=url_for('login_with_google_callback', _external=True),
            scope=["profile"],
            )
        return redirect(request_uri)


    @app.route('/login/google/callback', methods=['GET'])
    def login_with_google_callback():
        if app.config.get('GOOGLE_CLIENT_ID') \
                and not request.is_secure \
                and request.headers.get('X-Forwarded-Proto', 'http') == 'https':
            os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

        client = WebApplicationClient(app.config.get('GOOGLE_CLIENT_ID'))
        google_provider_cfg = requests.get(app.config.get('GOOGLE_DISCOVERY_URL')).json()
        code = request.args.get("code")

        token_endpoint = google_provider_cfg["token_endpoint"]

        token_url, headers, body = client.prepare_token_request(
            token_endpoint,
            authorization_response=url_for('login_with_google_callback', _external=True),
            redirect_url=url_for('home', _external=True),
            code=code,
        )
        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(
                app.config.get('GOOGLE_CLIENT_ID'),
                app.config.get('GOOGLE_CLIENT_SECRET'),
                ),
            ).json()

        client.parse_request_body_response(json.dumps(token_response))

        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body).json()

        user = app.datamapper.user.getByGoogleId(userinfo_response["sub"])

        if user is None:
            response = redirect(url_for('login'))
            flash("Login failed", 'error')
            return response

        else:
            session['user_id'] = user.id
            flash("Welcome %s" % userinfo_response.get('name', user.name), 'success')
            return redirect(url_for('home'))


    @app.route('/logout')
    def logout():
        session.pop('user_id', None)
        session.pop('user', None)
        session.pop('party_id', None)
        return jsonify(None)


    @app.route('/privacy-policy', methods=['GET'])
    def privacy_policy():
        return render_template(
            'privacy-policy.html'
            )


def with_app(app):
    register_paths(app)
