import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ListDataActions from '../actions/ListDataActions.jsx';
import ListDataStore from '../stores/ListDataStore.jsx';

function ListDataWrapper(
    WrappedComponent, storeKeys, storeCategory=null, mapping={}
) {

    return class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.state = {
                search: ''
            };
            this.store = ListDataStore;
            this.storeKeys = storeKeys;
        }

        componentDidMount() {
            storeKeys.map((item) => {
                if (item == 'search') {
                    return;
                }

                if (item in this.state && this.state[item] != null) {
                    return;
                }

                ListDataActions.fetchItems(
                    item, storeCategory);
            });
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (!_.isEqual(this.props, nextProps)) {
                return true;
            }

            if (!_.isEqual(this.state, nextState)) {
                return true;
            }

            return false;
        }

        render() {
            const data = _.reduce(this.state, (data, value, key) => {
                data[ mapping[key] || key ] = value;
                return data;
            }, {});
            return <WrappedComponent
                {...this.props}
                {...data}
                />
        }
    };
}

export default ListDataWrapper;
