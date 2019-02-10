import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ListDataActions from '../actions/ListDataActions.jsx';
import ListDataStore from '../stores/ListDataStore.jsx';

function InlineDataWrapper(WrappedComponent, storeKey, storeCategory=null) {

    const component = class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.state = {}
            this.store = ListDataStore;
            this.storeKeys = [storeKey];
        }

        componentDidMount() {
            if (storeKey in this.state && this.state[storeKey] != null) {
                return;
            }

            ListDataActions.fetchItems(
                storeKey, storeCategory);
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
            if (!(storeKey in this.state)) {
                return null;
            }
            return <WrappedComponent
                {...this.props}
                {...this.state[storeKey]}
                />
        }
    };

    component.WrappedComponent = WrappedComponent;

    component.displayName = `InlineData${
        WrappedComponent.displayName
        || WrappedComponent.name
    }`;

    return component;
}

export default InlineDataWrapper;
