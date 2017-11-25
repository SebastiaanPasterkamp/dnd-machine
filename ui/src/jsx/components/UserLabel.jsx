import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import ObjectLoader from '../mixins/ObjectLoader.jsx';

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

export default ObjectLoader(UserLabel, [
    {type: 'user', id: 'user_id'}
]);