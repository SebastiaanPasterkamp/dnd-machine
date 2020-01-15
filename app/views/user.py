# -*- coding: utf-8 -*-
from flask import request, redirect, url_for, abort
from oauthlib.oauth2 import WebApplicationClient
import json
import requests

from views.baseapi import BaseApiBlueprint, BaseApiCallback

class UserBlueprint(BaseApiBlueprint):

    def __init__(self, name, *args, **kwargs):
        super(UserBlueprint, self).__init__(name, *args, **kwargs)

        self.add_url_rule(
            '/google', 'link_google',
            self.link_google, methods=['GET'])
        self.add_url_rule(
            '/google/callback', 'link_google_callback',
            self.link_google_callback, methods=['GET'])

    @property
    def datamapper(self):
        return self.basemapper.user

    def _exposeAttributes(self, obj):
        exposed = set(['id', 'name', 'dci'])
        if obj.id == request.user.id \
                or self.checkRole(['admin']):
            exposed |= set(['username', 'email', 'role'])
        retval = dict([
            (key, value)
            for key, value in list(obj.config.items())
            if key in exposed
            ])
        return retval

    def _mutableAttributes(self, config, obj=None):
        mutable = set()
        if self.checkRole(['admin']):
            mutable |= set([
                'username', 'password', 'role', 'email',
                'name', 'dci',
                ])
        if obj is not None and obj.id == request.user.id:
            mutable |= set([
                'password', 'email', 'name', 'dci',
                ])
        return dict([
            (key, value)
            for key, value in list(config.items())
            if key in mutable
            ])

    @BaseApiCallback('index')
    @BaseApiCallback('overview')
    @BaseApiCallback('new')
    @BaseApiCallback('raw')
    @BaseApiCallback('api_list')
    @BaseApiCallback('api_post')
    @BaseApiCallback('api_copy')
    @BaseApiCallback('api_delete')
    def adminOnly(self, *args, **kwargs):
        if not self.checkRole(['admin']):
            abort(403)

    @BaseApiCallback('api_copy.object')
    def updateName(self, obj, *args, **kwargs):
        obj.name += ' (copy)'

    @BaseApiCallback('show')
    @BaseApiCallback('edit')
    def adminOrOwnedID(self, obj_id, *args, **kwargs):
        if obj_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403)

    @BaseApiCallback('api_patch.object')
    @BaseApiCallback('api_recompute.object')
    def adminOrOwned(self, obj, *args, **kwargs):
        if obj.id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403)

    @BaseApiCallback('api_post.object')
    def hashPassword(self, obj, *args, **kwargs):
        obj.setPassword(obj.password)

    @BaseApiCallback('api_patch.object')
    def hashOrPreservePassword(self, obj, *args, **kwargs):
        old = self.datamapper.getById(obj.id)
        if not len(obj.password):
            obj.password = old.password
        elif obj.password != old.password:
            obj.setPassword(obj.password)


    def link_google(self):
        client = WebApplicationClient(self.config.get('GOOGLE_CLIENT_ID'))
        google_provider_cfg = requests.get(self.config.get('GOOGLE_DISCOVERY_URL')).json()

        print(google_provider_cfg)

        authorization_endpoint = google_provider_cfg["authorization_endpoint"]

        # Use library to construct the request for Google login and provide
        # scopes that let you retrieve user's profile from Google
        request_uri = client.prepare_request_uri(
            authorization_endpoint,
            redirect_uri=url_for('user.link_google_callback', _external=True),
            scope=["profile"],
            )
        return redirect(request_uri)


    def link_google_callback(self):
        if self.config.get('GOOGLE_CLIENT_ID') \
                and not request.is_secure \
                and request.headers.get('X-Forwarded-Proto', 'http') == 'https':
            os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

        client = WebApplicationClient(self.config.get('GOOGLE_CLIENT_ID'))
        google_provider_cfg = requests.get(self.config.get('GOOGLE_DISCOVERY_URL')).json()
        code = request.args.get("code")

        token_endpoint = google_provider_cfg["token_endpoint"]

        token_url, headers, body = client.prepare_token_request(
            token_endpoint,
            authorization_response=url_for('user.link_google_callback', _external=True),
            redirect_url=url_for('home', _external=True),
            code=code,
        )
        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(
                self.config.get('GOOGLE_CLIENT_ID'),
                self.config.get('GOOGLE_CLIENT_SECRET'),
                ),
            ).json()

        client.parse_request_body_response(json.dumps(token_response))

        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body).json()

        user = self.datamapper.getById(request.user.id)
        user.google_id = userinfo_response["sub"]
        self.datamapper.update(user)

        return redirect(url_for('user.edit', obj_id=user.id))


def get_blueprint(basemapper, config):
    return '/user', UserBlueprint(
        'user',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
