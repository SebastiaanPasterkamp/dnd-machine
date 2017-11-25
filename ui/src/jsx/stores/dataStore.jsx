import React from 'react';
import Reflux from 'reflux';

import listDataActions from '../actions/listDataActions.jsx';

class DataStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            search: '',
            armor: [],
            character: [],
            current_user: [],
            languages: [],
            navigation: [],
            party: [],
            spells: [],
            statistics: [],
            weapons: []
        };
        this.listenables = listDataActions;
    }

    onSetState(data)
    {
        this.setState(data);
    }

    onFetchItemsCompleted(data)
    {
        this.setState(data);
    }

    onFetchItemsFailed(type, error)
    {
        let update = [];
        update[type] = [];
        this.setState(update);
    }
}

export default DataStore;