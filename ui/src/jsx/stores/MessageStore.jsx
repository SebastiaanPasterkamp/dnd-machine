import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ReportingActions from '../actions/ReportingActions.jsx';

export class MessageStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            messages: []
        };
        this.listenables = ReportingActions;
    }

    onShowMessage(type, message, title=null, timeout=0)
    {
        const msg = {
            id: _.uniqueId('message_'),
            type,
            message,
            title,
            timeout,
        };
        const messages = _.concat(this.state.messages, [msg]);
        this.setState({messages});

        ReportingActions.showMessage.completed();

        if (!msg.timeout) {
            return;
        }
        _.delay(
            ReportingActions.hideMessage,
            msg.timeout * 1000,
            msg.id
        );
    }

    onHideMessage(id)
    {
        const messages = _.reject(
            this.state.messages,
            {id}
        );
        this.setState({messages});

        ReportingActions.hideMessage.completed();
    }
}

export default Reflux.initStore(MessageStore);