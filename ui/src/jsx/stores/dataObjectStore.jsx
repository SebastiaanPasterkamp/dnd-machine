import React from 'react';
import Reflux from 'reflux';

import _ from 'lodash';

import dataObjectActions from '../actions/dataObjectActions.jsx';

class dataObjectStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            armor: {},
            characters: {},
            npc: {},
            weapons: {},
        };
        this.listenables = dataObjectActions;
    }

    updateObject(type, id, data) {
        let update = {};
        update[type] = {};
        update[type][id] = data;
        let state = _.merge(
            {},
            this.state,
            update
        );
        this.setState(state);
    };

    onGetObjectCompleted(type, id, result) {
        this.updateObject(type, id, result);
    }

    onPatchObjectCompleted(type, id, result) {
        this.updateObject(type, id, result);
    }

    onPostObjectCompleted(type, id, result) {
        this.updateObject(type, id, result);
    }

    onDeleteObjectCompleted(type, id) {
        let update = {};
        update[type] = _.copy(this.state[type]);
        delete update[type][id];
        this.setState(update);
    }
}

dataObjectStore.initial = {
    armor: {
        id: null,
        type: 'light armor',
        name: '',
        cost: {},
        requirements: {},
    },
    characters: {
        id: null,
        name: '',
        'class': '',
        race: '',
        alignment: 'true neutral',
        level: 1,
        xp: 0,
        xp_progress: 0,
        xp_level: 0,
    },
    navigation: [],
    npc: {
        id: null,
        name: "",
        location: "",
        organization: "",
        gender: "",
        alignment: "",
        size: "",
        level: 1,
        description: "",
        statistics: _.reduce(
            [
                'strength', 'dexterity', 'constitution',
                'intelligence', 'wisdom', 'charisma'
            ], (stats, stat) => {
                stats['bare'][stat] = 8;
                stats['bonus'][stat] = [];
                stats['base'][stat] = 8;
                stats['modifiers'] = -1;
                return stats;
            },
            {
                bare: {},
                bonus: {},
                base: {},
                modifiers: {}
            }
        )
    },
    party: {
        id: null,
        name: '',
        members: [],
    },
    weapons: {
        id: null,
        type: 'simple melee weapon',
        name: '',
        cost: {},
        damage: {
            dice_count: 1,
            dice_size: 4,
            type: 'bludgeoning'
        },
        property: []
    },
};

dataObjectStore.getInitial = (type) => {
    if (!(type in dataObjectStore.initial)) {
        return {
            id: null
        }
    }
    return dataObjectStore.initial[type];
};

export default dataObjectStore;
