import React from 'react';
import PropTypes from 'prop-types';

import '../../sass/_user-label.scss';

import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

class UserLabel extends LazyComponent
{
    render() {
        const { user, showDCI } = this.props;

        if (!user) {
            return null;
        }

        return <div className="user-label inline">
            {user.name}
            {showDCI && user.dci
                ? <span className="user-label__dci">
                DCI #{user.dci}
                </span>
                : null
            }
        </div>;
    }
}

UserLabel.propTypes = {
    user_id: PropTypes.number.isRequired,
    showDCI: PropTypes.bool,
    user: PropTypes.object,
};

export default ObjectDataWrapper(
    UserLabel, [
        {type: 'user', id: 'user_id'}
    ]
);