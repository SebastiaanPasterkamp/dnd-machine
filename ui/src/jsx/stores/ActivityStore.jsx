import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import LoadingActions from '../actions/LoadingActions.jsx';
import ReportingActions from '../actions/ReportingActions.jsx';

export class ActivityStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            loading: false,
        };
        this.listenables = LoadingActions;
    }

    onStart(action)
    {
        const {
            loading,
            ...activity
        } = this.state;

        this.setState({
            [action]: true,
            loading: true,
        });
    }

    onFinish(action)
    {
        const {
            loading,
            [action]: finished,
            ...activity
        } = this.state;

        this.setState({
            [action]: undefined,
            loading: !_.isEmpty(
                _.pickBy(activity)
            ),
        });

        ReportingActions.getMessages();
    }
}

export default Reflux.initStore(ActivityStore);
