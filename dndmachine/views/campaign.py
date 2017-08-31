# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify

from ..utils import get_datamapper, markdownToToc

campaign = Blueprint(
    'campaign', __name__, template_folder='templates')

@campaign.route('/')
@campaign.route('/list')
def overview(campaign_id=None):
    campaign_mapper = get_datamapper('campaign')

    search = None
    if 'admin' in request.user.role:
        search = request.args.get('search', '')
        campaigns = campaign_mapper.getList(search)
    else:
        campaigns = campaign_mapper.getByDmUserId(request.user.id)

    return render_template(
        'campaign/overview.html',
        campaigns=campaigns,
        search=search
        )

@campaign.route('/show/<int:campaign_id>')
@campaign.route('/show/<int:campaign_id>/<int:party_id>', methods=['GET', 'POST'])
def show(campaign_id, party_id=None):
    if party_id is None:
        return redirect( url_for('party.overview', campaign_id=campaign_id) )

    campaign_mapper = get_datamapper('campaign')
    user_mapper = get_datamapper('user')
    character_mapper = get_datamapper('character')
    party_mapper = get_datamapper('party')

    c = campaign_mapper.getById(campaign_id)
    party = party_mapper.getById(party_id)
    user = user_mapper.getById(c.user_id)

    characters = character_mapper.getByPartyId(party_id)

    c.toc = markdownToToc(c.story)

    return render_template(
        'campaign/show.html',
        campaign=c,
        party=party,
        characters=characters,
        user=user
        )

@campaign.route('/edit/<int:campaign_id>', methods=['GET', 'POST'])
def edit(campaign_id):
    campaign_mapper = get_datamapper('campaign')

    c = campaign_mapper.getById(campaign_id)
    if c['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'campaign.show',
                campaign_id=campaign_id
                ))

        c.updateFromPost(request.form)
        c['toc'] = markdownToToc(c['story'])

        if request.form.get("button", "save") == "save":
            campaign_mapper.update(c)
            return redirect(url_for(
                'campaign.overview'
                ))

        if request.form.get("button", "save") == "update":
            campaign_mapper.update(c)
            return redirect(url_for(
                'campaign.edit',
                campaign_id=campaign_id
                ))

    return render_template(
        'campaign/edit.html',
        campaign=c
        )

@campaign.route('/del/<int:campaign_id>')
def delete(campaign_id):
    campaign_mapper = get_datamapper('campaign')

    c = campaign_mapper.getById(campaign_id)
    if c['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)

    campaign_mapper.delete(c)

    return redirect(url_for(
        'campaign.overview'
        ))

@campaign.route('/new', methods=['GET', 'POST'])
def new():
    campaign_mapper = get_datamapper('campaign')

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'campaign.overview'
                ))

        c.updateFromPost(request.form)
        c['user_id'] = request.user['id']

        if request.form.get("button", "save") == "save":
            c = campaign_mapper.insert(c)
            return redirect(url_for(
                'campaign.edit',
                campaign_id=c['id']
                ))
    else:
        c = {}

    return render_template(
        'campaign/edit.html',
        campaign=c
        )

@campaign.route('/raw/<int:campaign_id>')
def raw(campaign_id):
    campaign_mapper = get_datamapper('campaign')

    c = campaign_mapper.getById(campaign_id)
    if c['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)

    return jsonify(c)
