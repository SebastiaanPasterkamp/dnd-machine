import React from 'react';
import Reflux from 'reflux';

import ListDataActions from '../actions/ListDataActions.jsx';

class ListDataStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            search: ''
        };
        this.listenables = ListDataActions;
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
        this.setState({
            [type]: null
        });
    }
}

export default Reflux.initStore(ListDataStore);