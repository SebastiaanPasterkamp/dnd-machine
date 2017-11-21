import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import listDataActions from '../actions/listDataActions.jsx';
import DataStore from '../stores/dataStore.jsx';

function ItemStore(WrappedComponent, storeKeys, storeCategory='items') {

    return class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.store = DataStore;
            this.storeKeys = storeKeys;
        }

        componentDidMount() {
            storeKeys.map((item) => {
                if (item == 'search') {
                    return;
                }
                listDataActions.fetchItems(
                    item, storeCategory);
            });
        }

        render() {
            return <WrappedComponent
                {...this.props}
                {...this.state}
                />
        }
    };
}

export default ItemStore;
