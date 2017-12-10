# -*- coding: utf-8 -*-
from flask import request, abort, render_template, url_for, redirect

from .baseapi import BaseApiBlueprint
from .. import get_datamapper

class EncounterBlueprint(BaseApiBlueprint):

    def __init__(self, name, *args, **kwargs):
        super(EncounterBlueprint, self).__init__(name, *args, **kwargs)

        self.add_url_rule(
            '/show/<int:obj_id>/<int:party_id>', 'show',
            self.show)
        self.add_url_rule(
            '/<int:obj_id>/<action>/<int:monster_id>', 'modify',
            self.modify)

    @property
    def datamapper(self):
        if not self._datamapper:
            datamapper = get_datamapper()
            self._datamapper = datamapper.encounter
        return self._datamapper

    @property
    def usermapper(self):
        if '_usermapper' not in self.__dict__:
            datamapper = get_datamapper()
            self._usermapper = datamapper.user
        return self._usermapper

    @property
    def charactermapper(self):
        if '_charactermapper' not in self.__dict__:
            datamapper = get_datamapper()
            self._charactermapper = datamapper.character
        return self._charactermapper

    @property
    def monstermapper(self):
        if '_monstermapper' not in self.__dict__:
            datamapper = get_datamapper()
            self._monstermapper = datamapper.monster
        return self._monstermapper

    @property
    def partymapper(self):
        if '_partymapper' not in self.__dict__:
            datamapper = get_datamapper()
            self._partymapper = datamapper.party
        return self._partymapper

    def _exposeAttributes(self, encounter):
        return encounter.config
        fields = ['id', 'name', 'challenge_rating', 'xp', 'xp_rating']

        result = dict([
            (key, monster[key])
            for key in fields
            ])

        return result

    def _api_list_filter(self, encounters):
        if not self.checkRole(['admin', 'dm']):
            abort(403)

        if not self.checkRole(['admin']):
            encounters = [
                encounter
                for encounter in encounters
                if encounter.user_id == request.user.id
                ]

        if request.party:
            for encounter in encounters:
                encounter.party = request.party

        for encounter in encounters:
            for encounter in encounters:
                encounter.monsters = self.monstermapper.getByEncounterId(encounter.id)

        return encounters

    def _raw_filter(self, encounter):

        if request.party:
            encounter.party = request.party

        encounter.monsters = self.monstermapper.getByEncounterId(encounter.id)

        return encounter

    def show(self, obj_id, party_id=None):
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

        datamapper = get_datamapper()

        encounter = self.datamapper.getById(obj_id)
        user = datamapper.user.getById(encounter.user_id)

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

    def edit(self, obj_id):
        encounter = self.datamapper.getById(obj_id)

        if encounter.user_id != request.user.id \
                and not self.checkRole(['admin']):
            abort(403)

        encounter.monsters = self.monstermapper.getByEncounterId(obj_id)

        if request.method == 'POST':
            if request.form["button"] == "cancel":
                return redirect(url_for(
                    'encounter.show',
                    obj_id=obj_id
                    ))

            encounter.updateFromPost(request.form)

            if request.form.get("button", "save") == "save":
                self.datamapper.update(encounter)
                return redirect(url_for(
                    'encounter.show',
                    obj_id=obj_id
                    ))

            if request.form.get("button", "save") == "update":
                self.datamapper.update(encounter)
                return redirect(url_for(
                    'encounter.edit',
                    obj_id=obj_id
                    ))

        return render_template(
            'encounter/edit.html',
            encounter=encounter,
            monsters=encounter.monsters
            )

    def new(self):
        encounter = self.datamapper.create({
            'user_id': request.user.id
            })

        if request.method == 'POST':
            if request.form["button"] == "cancel":
                return redirect(url_for(
                    'encounter.overview'
                    ))

            encounter.updateFromPost(request.form)

            if request.form.get("button", "save") == "save":
                encounter = self.datamapper.insert(encounter)
                return redirect(url_for(
                    'encounter.edit',
                    obj_id=e.id
                    ))

        return render_template(
            'encounter/edit.html',
            encounter=encounter
            )

    def modify(self, obj_id, action, monster_id):
        encounter = self.datamapper.getById(obj_id)
        monster = self.monstermapper.getById(monster_id)

        if action == 'add':
            self.datamapper.addMonster(obj_id, monster_id)
            flash(
                "The Monster '%s' was added to Encounter '%s'." % (
                    monster.name,
                    encounter.name
                    ),
                'info'
                )
        elif action == 'del':
            self.datamapper.delMonster(obj_id, monster_id)
            flash(
                "The Monster '%s' was removed from Encounter '%s'." % (
                    monster.name,
                    encounter.name
                    ),
                'info'
                )
        else:
            flash("Unknown action '%s'." % action, 'error')

        encounter.monsters = self.monstermapper.getByEncounterId(obj_id)
        self.datamapper.update(encounter)

        return redirect(request.referrer)

encounter = EncounterBlueprint(
    'encounter', __name__, template_folder='templates')
