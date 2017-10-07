# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify

import re

from ..utils import get_datamapper, markdownToToc
from ..filters import filter_unique

campaign = Blueprint(
    'campaign', __name__, template_folder='templates')

@campaign.route('/')
@campaign.route('/list')
def overview(campaign_id=None):
    campaign_mapper = get_datamapper('campaign')

    search = request.args.get('search', '')
    campaigns = campaign_mapper.getList(search)
    if 'admin' not in request.user.role:
        campaigns = [
            c
            for c in campaigns
            if c.user_id == request.user.id
            ]

    return render_template(
        'campaign/overview.html',
        campaigns=campaigns,
        search=search
        )

@campaign.route('/show/<int:campaign_id>')
@campaign.route('/show/<int:campaign_id>/<int:party_id>', methods=['GET', 'POST'])
def show(campaign_id, party_id=None):
    if party_id is None:
        if request.party:
            return redirect( url_for('campaign.show', campaign_id=campaign_id, party_id=request.party.id) )
        return redirect( url_for('party.overview', campaign_id=campaign_id) )

    campaign_mapper = get_datamapper('campaign')
    user_mapper = get_datamapper('user')
    character_mapper = get_datamapper('character')
    party_mapper = get_datamapper('party')
    encounter_mapper = get_datamapper('encounter')
    monster_mapper = get_datamapper('monster')

    c = campaign_mapper.getById(campaign_id)
    party = party_mapper.getById(party_id)
    user = user_mapper.getById(c.user_id)

    characters = character_mapper.getByPartyId(party_id)

    replace = {}
    for match in re.finditer(ur"^/encounter/(\d+)\s*$", c.story, re.M):
        pattern, encounter_id = match.group(0), int(match.group(1))
        if pattern not in replace:
            encounter = encounter_mapper.getById(encounter_id)
            if encounter is None:
                continue
            encounter.monsters = \
                monster_mapper.getByEncounterId(encounter.id)

            replace[pattern] = pattern
            replace[pattern] += "\n" + render_template(
                'encounter/show.md',
                encounter=encounter
                )

            skip = set()
            for monster in sorted(encounter.monsters,\
                    key=lambda m: m.challenge_rating):
                if monster.id in skip:
                    continue
                skip.add(monster.id)

                replace[pattern] += "\n\n" + render_template(
                    'monster/show.md',
                    monster=monster
                    )
            replace[pattern] += "\n"

    c.story = reduce(
        lambda a, kv: a.replace(*kv),
        replace.iteritems(),
        c.story
        )

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
            if request.party:
                return redirect(url_for(
                    'campaign.show',
                    campaign_id=campaign_id,
                    party_id=request.party.id
                    ))
            return redirect(url_for(
                'campaign.overview'))

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
