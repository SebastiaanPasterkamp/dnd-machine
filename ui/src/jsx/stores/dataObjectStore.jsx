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
            npc: {}
        };
        this.listenables = dataObjectActions;
    }

    onGetObjectCompleted(type, id, result)
    {
        let update = {};
        update[type] = {};
        update[type][id] = result;
        this.setState(update);
    }

    onPatchObjectCompleted(type, id, result)
    {
        let update = {};
        update[type] = {};
        update[type][id] = result;
        this.setState(update);
    }

    onDeleteObjectCompleted(type, id)
    {
        let update = {};
        update[type] = _.copy(this.state[type]);
        delete update[type][id];
        this.setState(update);
    }
}

dataObjectStore.initial = {
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
    }
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