# -*- coding: utf-8 -*-
from flask import request, abort, render_template, url_for, redirect

import re

from .baseapi import BaseApiBlueprint
from .. import get_datamapper
from ..utils import markdownToToc, indent
from ..filters import filter_unique

class CampaignBlueprint(BaseApiBlueprint):

    @property
    def datamapper(self):
        if not self._datamapper:
            datamapper = get_datamapper()
            self._datamapper = datamapper.campaign
        return self._datamapper

    @property
    def encountermapper(self):
        if '_encountermapper' not in self.__dict__:
            datamapper = get_datamapper()
            self._encountermapper = datamapper.encounter
        return self._encountermapper

    @property
    def monstermapper(self):
        if '_monstermapper' not in self.__dict__:
            datamapper = get_datamapper()
            self._monstermapper = datamapper.monster
        return self._monstermapper

    @property
    def npcmapper(self):
        if '_npcmapper' not in self.__dict__:
            datamapper = get_datamapper()
            self._npcmapper = datamapper.npc
        return self._npcmapper

    @property
    def usermapper(self):
        if '_usermapper' not in self.__dict__:
            datamapper = get_datamapper()
            self._usermapper = datamapper.user
        return self._usermapper

    def _exposeAttributes(self, campaign):
        return campaign.config

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
                ur"^/encounter/(\d+)\s*$", campaign.story, re.M):

            pattern, encounter_id = match.group(0), int(match.group(1))
            if pattern not in replace:
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

        for match in re.finditer(
                ur"^/npc/(\d+)\s*$", campaign.story, re.M):

            pattern, npc_id = match.group(0), int(match.group(1))
            if pattern not in replace:
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
            lambda a, kv: a.replace(*kv),
            replace.iteritems(),
            campaign.story
            )

        campaign.toc = markdownToToc(campaign.story)

        return render_template(
            'campaign/show.html',
            campaign=campaign,
            user=user
            )

blueprint = CampaignBlueprint(
    'campaign', __name__, template_folder='templates')
