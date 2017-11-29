import React from 'react';
import Reflux from 'reflux';

import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

class ObjectDataStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {};
        this.listenables = ObjectDataActions;
    }

    updateObject(type, id, data) {
        if (_.isEqual(data, _.get(this.state, [type, id]))) {
            return;
        }
        let update = {};

        update[type] = {};
        update[type][id] = data;
        update[type] = _.merge(
            {},
            this.state[type],
            update[type]
        );

        this.setState(update);
    };

    onListObjectsCompleted(type, objects) {
        let update = {};

        update[type] = _.reduce(objects, (mapped, object) => {
            let old_object = _.get(this.state, [type, object.id]);
            if (_.isEqual(object, old_object)) {
                mapped[object.id] = old_object;
            } else {
                mapped[object.id] = object;
            }
            return mapped;
        }, {});

        if (_.isEqual(update, _.get(this.state, type))) {
            return;
        }

        this.setState(update);
    }

    onGetObjectCompleted(type, id, object) {
        this.updateObject(type, id, object);
    }

    onPatchObjectCompleted(type, id, object) {
        this.updateObject(type, id, object);
    }

    onPostObjectCompleted(type, id, object) {
        this.updateObject(type, id, object);
    }

    onDeleteObjectCompleted(type, id) {
        let update = {};
        update[type] = _.copy(this.state[type]);
        delete update[type][id];
        this.setState(update);
    }
}

ObjectDataStore.initial = {
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

ObjectDataStore.getInitial = (type) => {
    if (!(type in ObjectDataStore.initial)) {
        return {
            id: null
        }
    }
    return ObjectDataStore.initial[type];
};

export default ObjectDataStore;
