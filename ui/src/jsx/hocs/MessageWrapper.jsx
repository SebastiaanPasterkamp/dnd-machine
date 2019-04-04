import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ReportingActions from '../actions/ReportingActions.jsx';
import MessageStore from '../stores/MessageStore.jsx';

function MessageWrapper(WrappedComponent) {

    return class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.store = MessageStore;
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
            const {
                messages
            } = this.state;

            return <WrappedComponent
                messages={messages}
                onClose={(id) => ReportingActions.hideMessage(id)}
                />
        }
    };
}

export default MessageWrapper;
