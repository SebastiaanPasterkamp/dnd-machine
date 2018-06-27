import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import LoadingActions from '../actions/LoadingActions.jsx';

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
            ...activity,
        } = this.state;

        this.setState({
            [action]: undefined,
            loading: !_.isEmpty(
                _.pickBy(activity)
            ),
        });
    }
}

export default Reflux.initStore(ActivityStore);