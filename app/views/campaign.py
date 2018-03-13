# -*- coding: utf-8 -*-
from flask import request, abort, render_template, url_for, redirect

import re

from .baseapi import BaseApiBlueprint
from ..utils import markdownToToc, indent
from ..filters import filter_unique

class CampaignBlueprint(BaseApiBlueprint):

    @property
    def datamapper(self):
        return self.basemapper.campaign

    @property
    def encountermapper(self):
        return self.basemapper.encounter

    @property
    def monstermapper(self):
        return self.basemapper.monster

    @property
    def npcmapper(self):
        return self.basemapper.npc

    @property
    def usermapper(self):
        return self.basemapper.user

    def _api_list_filter(self, campaigns):
        if not self.checkRole(['admin', 'dm']):
            abort(403)

        if not self.checkRole(['admin']):
            campaigns = [
                campaign
                for campaign in campaigns
                if campaign.user_id == request.user.id
                ]

        return campaigns

    def show(self, obj_id):
        campaign = self.datamapper.getById(obj_id)
        user = self.usermapper.getById(campaign.user_id)

        replace = {}
        for match in re.finditer(
                ur"^/encounter/(\d+)\b", campaign.story, re.M):

            pattern, encounter_id = \
                match.group(0), int(match.group(1))
            if pattern in replace:
                continue

            encounter = self.encountermapper.getById(encounter_id)
            if encounter is None:
                continue

            encounter.monsters = \
                self.monstermapper.getByEncounterId(encounter.id)

            replace[pattern] = "\n\n!!! encounter\n" + indent(
                    render_template(
                        'encounter/show.md',
                        encounter=encounter,
                        indent='##'
                        )
                    )

            skip = set()
            monsters = sorted(
                encounter.monsters,
                key=lambda m: m.challenge_rating,
                reverse=True
                )
            for monster in monsters:
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

        for match in re.finditer(
                ur"^/npc/(\d+)\b", campaign.story, re.M):

            pattern, npc_id = \
                match.group(0), int(match.group(1))
            if pattern in replace:
                continue

            npc = self.npcmapper.getById(npc_id)
            if npc is None:
                continue

            replace[pattern] = "\n!!! npc\n" + indent(
                render_template(
                    'npc/show.md',
                    npc=npc,
                    indent='##'
                    )
                ) + "\n"

        campaign.story = reduce(
            lambda subject, kv: re.sub(
                r"%s\b" % kv[0], kv[1], subject
                ),
            replace.iteritems(),
            campaign.story
            )

        campaign.toc = markdownToToc(campaign.story)

        return render_template(
            'campaign/show.html',
            campaign=campaign,
            user=user
            )

def get_blueprint(basemapper):
    return CampaignBlueprint(
        'campaign',
        __name__,
        basemapper=basemapper,
        template_folder='templates'
        )
