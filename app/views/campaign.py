# -*- coding: utf-8 -*-
from flask import request, abort, render_template, url_for, redirect

import re

from .baseapi import BaseApiBlueprint, BaseApiCallback
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

    @BaseApiCallback('index')
    @BaseApiCallback('overview')
    @BaseApiCallback('show')
    @BaseApiCallback('new')
    @BaseApiCallback('edit')
    @BaseApiCallback('api_list')
    @BaseApiCallback('api_get')
    @BaseApiCallback('api_post')
    @BaseApiCallback('api_patch')
    @BaseApiCallback('api_delete')
    @BaseApiCallback('api_recompute')
    def adminOrDmOnly(self, *args, **kwargs):
        if not self.checkRole(['admin', 'dm']):
            abort(403)

    @BaseApiCallback('raw')
    def adminOnly(self):
        if not self.checkRole(['admin']):
            abort(403)

    @BaseApiCallback('api_list.objects')
    def adminOrOwnedMultiple(self, objs):
        if self.checkRole(['admin']):
            return
        objs[:] = [
            obj
            for obj in objs
            if obj.user_id == request.user.id
            ]

    @BaseApiCallback('show.object')
    @BaseApiCallback('edit.object')
    @BaseApiCallback('api_get.object')
    @BaseApiCallback('api_patch.original')
    @BaseApiCallback('api_delete.object')
    def adminOrOwnedSingle(self, obj):
        if obj.id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403)

    @BaseApiCallback('api_post.object')
    def setOwner(self, obj):
        obj.id = request.user.id

    def show(self, obj_id):
        self.doCallback('show', obj_id, *args, **kwargs)

        obj = self.datamapper.getById(obj_id)
        user = self.usermapper.getById(obj.user_id)

        self.doCallback('show.object', obj)

        replace = {}
        for match in re.finditer(
                ur"^/encounter/(\d+)\b", obj.story, re.M):

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
                ur"^/npc/(\d+)\b", obj.story, re.M):

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

        obj.story = reduce(
            lambda subject, kv: re.sub(
                r"%s\b" % kv[0], kv[1], subject
                ),
            replace.iteritems(),
            obj.story
            )

        obj.toc = markdownToToc(obj.story)

        return render_template(
            'campaign/show.html',
            campaign=obj,
            user=user
            )

def get_blueprint(basemapper, config):
    return '/campaign', CampaignBlueprint(
        'campaign',
        __name__,
        basemapper,
        config,
        template_folder='templates'
        )
