# -*- coding: utf-8 -*-
from flask import request, abort, render_template, url_for, redirect

from .baseapi import BaseApiBlueprint

class EncounterBlueprint(BaseApiBlueprint):

    def __init__(self, name, *args, **kwargs):
        super(EncounterBlueprint, self).__init__(name, *args, **kwargs)

        self.add_url_rule(
            '/show/<int:obj_id>/<int:party_id>', 'show',
            self.show)

    @property
    def datamapper(self):
        return self.basemapper.encounter

    @property
    def usermapper(self):
        return self.basemapper.user

    @property
    def charactermapper(self):
        return self.basemapper.character

    @property
    def monstermapper(self):
        return self.basemapper.monster

    @property
    def partymapper(self):
        return self.basemapper.party

    def _api_list_filter(self, objs):
        if not self.checkRole(['admin', 'dm']):
            abort(403)

        if not self.checkRole(['admin']):
            objs = [
                obj
                for obj in objs
                if obj.user_id == request.user.id
                ]

        for obj in objs:
            obj.monsters = [
                self.monstermapper.getById(monster['id'])
                for monster in obj.monster_ids
                ]
            if request.party:
                obj.party = request.party
        return objs

    def _raw_filter(self, obj):
        obj.monsters = [
            self.monstermapper.getById(monster['id'])
            for monster in obj.monster_ids
            ]
        if request.party:
            obj.party = request.party
        return obj

    def _api_get_filter(self, obj):
        obj.monsters = [
            self.monstermapper.getById(monster['id'])
            for monster in obj.monster_ids
            ]
        if request.party:
            obj.party = request.party
        return obj

    def _api_post_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        obj.user_id = request.user.id
        obj.monsters = [
            self.monstermapper.getById(monster['id'])
            for monster in obj.monster_ids
            ]
        return obj

    def _api_patch_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        if obj.user_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403, "Not owned")
        obj.monsters = [
            self.monstermapper.getById(monster['id'])
            for monster in obj.monster_ids
            ]
        return obj

    def _api_recompute_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        obj.monsters = [
            self.monstermapper.getById(monster['id'])
            for monster in obj.monster_ids
            ]
        if request.party:
            obj.party = request.party
        return obj

    def _api_delete_filter(self, obj):
        if not self.checkRole(['admin', 'dm']):
            abort(403)
        if obj.user_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403, "Not owned")
        return obj

    def xshow(self, obj_id, party_id=None):
        if party_id is None:
            if request.party:
                return redirect( url_for(
                    'encounter.show',
                    obj_id=obj_id,
                    party_id=request.party.id
                    ))
            return redirect( url_for(
                'party.overview'
                ) )

        encounter = self.datamapper.getById(obj_id)
        user = self.usermapper.getById(encounter.user_id)

        party = self.partymapper.getById(party_id)
        party.members = self.charactermapper.getByPartyId(party_id)
        encounter.party = party

        encounter.monsters = self.monstermapper.getByEncounterId(obj_id)

        combatants = [
            {
                'index': i,
                'type': 'pc',
                'initiative': 0,
                'name': c.name,
                'hit_points': c.hit_points,
                'current_hit_points': c.hit_points,
                'damage_taken': u'',
                'notes': u''
                }
                for i, c in enumerate(encounter.party.members)
            ]
        offset = len(encounter.party.members)
        combatants.extend([
            {
                'index': offset + i,
                'type': 'npc',
                'initiative': 0,
                'name': m.name,
                'hit_points': m.hit_points,
                'current_hit_points': m.hit_points,
                'damage_taken': u'',
                'notes': u''
                }
                for i, m in enumerate(encounter.monsters)
            ])

        initiative_dm = 0

        if request.method == 'POST':
            initiative_dm = int(request.form.get('initiative-dm', 0))
            for c in combatants:
                if c['type'] == 'pc':
                    c['initiative'] = int(request.form.get(
                        'initiative-%d' % c['index'], c['initiative']
                        ))
                else:
                    c['initiative'] = initiative_dm
                c['current_hit_points'] = int(c['hit_points'])
                c['notes'] = request.form.get('notes-%d' % c['index'], u'')
                c['damage_taken'] = request.form.get(
                    'damage-taken-%d' % c['index'], '')
                for m in re.finditer(ur'[+-]?\d+', c['damage_taken']):
                    damage = m.group(0)
                    try:
                        c['current_hit_points'] -= int(damage)
                        if c['current_hit_points'] < 0:
                            c['current_hit_points'] = 0
                    except:
                        # Can't resolve; oh well
                        pass
            combatants = sorted(
                combatants,
                key=lambda c: (c['current_hit_points'] > 0, c['initiative']),
                reverse=True
                )
        mode = request.form.get('mode', 'initiative')

        info = {}
        for monster in encounter.monsters:
            if monster.id not in info:
                info[monster.id] = {
                    'count': 1,
                    'monster': monster
                    }
            else:
                info[monster.id]['count'] += 1

        return render_template(
            'encounter/show.html',
            encounter=encounter,
            mode=mode,
            user=user,
            party=encounter.party,
            initiative_dm=initiative_dm,
            combatants=combatants,
            monsters=info.values()
            )

def get_blueprint(basemapper):
    return EncounterBlueprint(
        'encounter',
        __name__,
        basemapper=basemapper,
        template_folder='templates'
        )
