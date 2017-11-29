import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class UserLabel extends LazyComponent
{
    render() {
        if (!this.props.user) {
            return '';
        }
        return <div className="user inline">
            {this.props.user.name}
        </div>;
    }
}

export default ObjectDataWrapper(UserLabel, [
    {type: 'user', id: 'user_id'}
]);