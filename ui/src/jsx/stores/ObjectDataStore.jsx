import React from 'react';
import Reflux from 'reflux';

import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

class ObjectDataStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            timestamp: {}
        };
        this.listenables = ObjectDataActions;
    }

    updateObject(type, id, data) {
        if (_.isEqual(data, _.get(this.state, [type, id]))) {
            return;
        }

        let update = {
            timestamp: _.assign(
                {},
                this.state.timestamp,
                {[type]: _.assign(
                    {},
                    this.state.timestamp[type],
                    {[id]: Date.now()}
                )}
            ),
            [type]: _.assign(
                {},
                this.state[type],
                {[id]: data}
            )
        };

        this.setState(update);
    };

    onListObjectsCompleted(type, objects) {
        let update = {
            timestamp: {}
        };

        update = _.reduce(objects, (mapped, object) => {
            let old_object = _.get(
                    this.state,
                    [type, object.id]
                ),
                old_timestamp = _.get(
                    this.state.timestamp,
                    [type, object.id]
                );

            if (old_object && _.isEqual(object, old_object)) {
                mapped[type][object.id] = old_object;
                mapped.timestamp[type][object.id] = old_timestamp;
            } else {
                mapped[type][object.id] = object;
                mapped.timestamp[type][object.id] = Date.now();
            }

            return mapped;
        }, {
            timestamp: {[type]: {}},
            [type]: {}
        });

        if (_.isEqual(update[type], _.get(this.state, type))) {
            return;
        }

        update.timestamp = _.assign(
            {},
            this.state.timestamp,
            update.timestamp
        );

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

    onRecomputeObjectCompleted(type, id, object) {
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
        challenge: {},
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