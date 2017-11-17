import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import listDataActions from '../actions/listDataActions.jsx';
import DataStore from '../stores/dataStore.jsx';

class ItemStore extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.store = DataStore;
        this.storeKeys = this.props.itemStoreProps;
    }

    componentDidMount() {
        this.props.itemStoreProps.map((item) => {
            if (item == 'search') {
                return;
            }
            listDataActions.fetchItems(item);
        });
    }

    render() {
        return <this.props.component
            {...this.state}
            {...this.props}
            />
    }
}

export default ItemStore;