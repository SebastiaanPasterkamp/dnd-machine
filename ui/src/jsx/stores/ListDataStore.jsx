import React from 'react';
import Reflux from 'reflux';
import {
    filter,
} from 'lodash/fp';

import ListDataActions from '../actions/ListDataActions.jsx';
import LoadingActions from '../actions/LoadingActions.jsx';

class ListDataStore extends Reflux.Store
{
    constructor() {
        super();
        this.state = {
            search: '',
            loading: {},
        };
        this.listenables = ListDataActions;
    }

    onSetState(data) {
        this.setState(data);
    }

    onFetchItems(type, category=null) {
        const { loading } = this.state;
        if (loading[type]) {
            return;
        }

        this.setState({
            loading: {
                ...loading,
                [type]: true,
            },
        });

        const path = '/' + filter(null, [
            category, type, category ? 'api' : null
        ]).join('/');

        fetch(path, {
            credentials: 'same-origin',
            'headers': {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw response.statusText;
        })
        .then((response) => {
            LoadingActions.finish(type);
            ListDataActions.fetchItems.completed({
                [type]: response
            }, type);
        })
        .catch((error) => {
            LoadingActions.finish(type);
            console.log({type, error});
            ListDataActions.fetchItems.failed(type, error);
        });
    }

    onFetchItemsCompleted(data, type) {
        const { loading } = this.state;
        this.setState({
            ...data,
            loading: {
                ...loading,
                [type]: false,
            },
        });
    }

    onFetchItemsFailed(type, error) {
        const { loading } = this.state;
        this.setState({
            [type]: undefined,
            loading: {
                ...loading,
                [type]: false,
            },
        });
    }
}

export default Reflux.initStore(ListDataStore);
