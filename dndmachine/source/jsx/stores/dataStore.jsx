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
            weapons: [],
            languages: []
        };
        this.listenables = listDataActions;
    }

    onSetState(data)
    {
        this.setState(data);
    }

    onFetchLanguagesCompleted(data)
    {
        this.setState({languages: data.languages});
    }

    onFetchLanguagesFailed(error)
    {
        this.setState({languages: []});
    }

    onFetchWeaponsCompleted(data)
    {
        this.setState({weapons: data.weapons});
    }

    onFetchWeaponsFailed(error)
    {
        this.setState({weapons: []});
    }
}

export default DataStore;