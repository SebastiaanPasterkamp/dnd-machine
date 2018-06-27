import React from 'react';
import Reflux from 'reflux';

import ListDataActions from '../actions/ListDataActions.jsx';
import LoadingActions from '../actions/LoadingActions.jsx';

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

    onFetchItems(type, category) {
        LoadingActions.start(type);
    }

    onFetchItemsCompleted(data, type)
    {
        LoadingActions.finish(type);
        this.setState(data);
    }

    onFetchItemsFailed(type, error)
    {
        LoadingActions.finish(type);
        this.setState({
            [type]: null
        });
    }
}

export default Reflux.initStore(ListDataStore);