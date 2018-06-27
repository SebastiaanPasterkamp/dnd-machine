import React from 'react';
import Reflux from 'reflux';

import LoadingActions from '../actions/LoadingActions.jsx';
import ActivityStore from '../stores/ActivityStore.jsx';

function ActivityWrapper(WrappedComponent) {

    return class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.store = ActivityStore;
        }

        shouldComponentUpdate(nextProps, nextState) {
            return (this.state.loading != nextState.loading);
        }

        render() {
            const {
                loading,
            } = this.state;

            return <WrappedComponent
                loading={loading}
                {...this.props}
                />
        }
    };
}

export default ActivityWrapper;
