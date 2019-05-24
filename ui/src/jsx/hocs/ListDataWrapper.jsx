import React from 'react';
import Reflux from 'reflux';
import {
    isEqual,
    get,
    reduce,
} from 'lodash/fp';

import ListDataActions from '../actions/ListDataActions.jsx';
import ListDataStore from '../stores/ListDataStore.jsx';

function ListDataWrapper(
    WrappedComponent, storeKeys, storeCategory=null, mapping={}
) {

    const component = class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.state = {
                search: '',
            };
            this.store = ListDataStore;
            this.storeKeys = storeKeys;
        }

        componentDidMount() {
            storeKeys.map((key) => {
                if (key == 'search') {
                    return;
                }

                const { [key]: provided } = this.props;
                if (provided !== undefined) {
                    return;
                }

                const { [key]: stored } = this.state;
                if (stored !== undefined) {
                    return;
                }

                ListDataActions.fetchItems(key, storeCategory);
            });
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (!isEqual(this.props, nextProps)) {
                return true;
            }

            if (!isEqual(this.state, nextState)) {
                return true;
            }

            return false;
        }

        render() {
            const data = reduce((data, key) => {
                const { [key]: provided } = this.props;
                const { [key]: stored } = this.state;
                const prop = get(key, mapping) || key;

                if (provided !== undefined) {
                    data[ prop ] = provided;
                } else if (stored !== undefined) {
                    data[ prop ] = stored;
                }

                return data;
            }, {})(storeKeys);

            return (
                <WrappedComponent
                    {...this.props}
                    {...data}
                />
            );
        }
    };

    component.WrappedComponent = WrappedComponent;

    component.displayName = `ListData${
        WrappedComponent.displayName
        || WrappedComponent.name
    }`;

    return component;
}

export default ListDataWrapper;
