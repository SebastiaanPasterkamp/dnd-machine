import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

const initial = {
    armor: {
        id: null,
        type: 'light armor',
        name: '',
        cost: {},
        requirements: {},
    },
    character: {
        id: null,
        name: '',
        'class': null,
        race: null,
        background: null,
        statistics: {
            bare: {
                strength: 8,
                dexterity: 8,
                constitution: 8,
                intelligence: 8,
                wisdom: 8,
                charisma: 8,
            }
        },
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
        member_ids: [],
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

export function ObjectDataStoreFactory(id, listenables = null)
{

    class ObjectDataStore extends Reflux.Store
    {
        constructor()
        {
            super();
            this.state = {
                timestamp: {}
            };
            this.listenables = listenables || ObjectDataActions;
        }

        updateObject(type, id, data, callback=null) {
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

            this.setState(update, callback);
        };

        onListObjectsCompleted(type, objects, callback=null) {
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

            this.setState(update, callback);
        }

        onGetObjectCompleted(type, id, object, callback=null) {
            this.updateObject(type, id, object, callback);
        }

        onPatchObjectCompleted(type, id, object, callback=null) {
            this.updateObject(type, id, object, callback);
        }

        onPostObjectCompleted(type, id, object, callback=null) {
            this.updateObject(type, id, object, callback);
        }

        onRecomputeObjectCompleted(type, id, object, callback=null) {
            this.updateObject(type, id, object, callback);
        }

        onDeleteObjectCompleted(type, id, callback=null) {
            let update = {};
            update[type] = _.copy(this.state[type]);
            delete update[type][id];
            this.setState(update, callback);
        }
    }

    ObjectDataStore.getInitial = (type) => {
        if (!(type in initial)) {
            return {
                id: null
            }
        }
        return initial[type];
    };

    ObjectDataStore.id = id;

    return ObjectDataStore;
};

export default ObjectDataStoreFactory('default');
