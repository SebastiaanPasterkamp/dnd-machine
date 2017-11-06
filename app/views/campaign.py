# -*- coding: utf-8 -*-
from flask import Blueprint, request, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify

import re

from .. import get_datamapper
from ..utils import markdownToToc, indent
from ..filters import filter_unique

campaign = Blueprint(
    'campaign', __name__, template_folder='templates')

@campaign.route('/')
@campaign.route('/list')
def overview(campaign_id=None):
    datamapper = get_datamapper()

    search = request.args.get('search', '')
    campaigns = datamapper.campaign.getList(search)
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
def show(campaign_id):
    datamapper = get_datamapper()

    c = datamapper.campaign.getById(campaign_id)
    user = datamapper.user.getById(c.user_id)

    replace = {}
    for match in re.finditer(ur"^/encounter/(\d+)\s*$", c.story, re.M):
        pattern, encounter_id = match.group(0), int(match.group(1))
        if pattern not in replace:
            encounter = datamapper.encounter.getById(encounter_id)
            if encounter is None:
                continue
            encounter.monsters = \
                datamapper.monster.getByEncounterId(encounter.id)

            replace[pattern] = "\n\n!!! encounter\n" + indent(
                    render_template(
                        'encounter/show.md',
                        encounter=encounter,
                        indent='##'
                        )
                    )

            skip = set()
            for monster in sorted(encounter.monsters,\
                    key=lambda m: m.challenge_rating,
                    reverse=True):
                if monster.id in skip:
                    continue
                skip.add(monster.id)

                replace[pattern] += "\n\n!!! monster\n" + indent(
                    render_template(
                        'monster/show.md',
                        monster=monster,
                        indent='###'
                        )
                    )
            replace[pattern] += "\n"

    for match in re.finditer(ur"^/npc/(\d+)\s*$", c.story, re.M):
        pattern, npc_id = match.group(0), int(match.group(1))
        if pattern not in replace:
            npc = datamapper.npc.getById(npc_id)
            if npc is None:
                continue

            replace[pattern] = "\n!!! npc\n" + indent(
                render_template(
                    'npc/show.md',
                    npc=npc,
                    indent='##'
                    )
                ) + "\n"

    c.story = reduce(
        lambda a, kv: a.replace(*kv),
        replace.iteritems(),
        c.story
        )

    c.toc = markdownToToc(c.story)

    return render_template(
        'campaign/show.html',
        campaign=c,
        user=user
        )

@campaign.route('/edit/<int:campaign_id>', methods=['GET', 'POST'])
def edit(campaign_id):
    datamapper = get_datamapper()

    c = datamapper.campaign.getById(campaign_id)
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
            datamapper.campaign.update(c)
            if request.party:
                return redirect(url_for(
                    'campaign.show',
                    campaign_id=campaign_id,
                    party_id=request.party.id
                    ))
            return redirect(url_for(
                'campaign.overview'))

        if request.form.get("button", "save") == "update":
            datamapper.campaign.update(c)
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
    datamapper = get_datamapper()

    c = datamapper.campaign.getById(campaign_id)
    if c['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)

    datamapper.campaign.delete(c)

    return redirect(url_for(
        'campaign.overview'
        ))

@campaign.route('/new', methods=['GET', 'POST'])
def new():
    datamapper = get_datamapper()

    if request.method == 'POST':
        if request.form["button"] == "cancel":
            return redirect(url_for(
                'campaign.overview'
                ))

        c.updateFromPost(request.form)
        c['user_id'] = request.user['id']

        if request.form.get("button", "save") == "save":
            c = datamapper.campaign.insert(c)
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
    datamapper = get_datamapper()

    c = datamapper.campaign.getById(campaign_id)
    if c['user_id'] != request.user['id'] \
            and 'admin' not in request.user['role']:
        abort(403)

    return jsonify(c)
