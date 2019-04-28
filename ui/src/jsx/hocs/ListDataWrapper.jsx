import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

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
            if (!_.isEqual(this.props, nextProps)) {
                return true;
            }

            if (!_.isEqual(this.state, nextState)) {
                return true;
            }

            return false;
        }

        render() {
            const data = _.reduce(storeKeys, (data, key) => {
                const { [key]: provided } = this.props;
                const { [key]: stored } = this.state;

                if (provided !== undefined) {
                    data[ mapping[key] || key ] = provided;
                } else if (stored !== undefined) {
                    data[ mapping[key] || key ] = stored;
                }

                return data;
            }, {});

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
