import React from 'react';
import PropTypes from 'prop-types';
import {
    isNil,
} from 'lodash/fp';

export const XpRating = function({ xpRating })
{
    if (isNil(xpRating)) {
        return (
            <div className="xp-rating inline">
            &mdash;&nbsp;XP
            </div>
        );
    }

    const value = Math.round(xpRating);

    return (
        <div className="xp-rating inline">
            {value}&nbsp;XP
        </div>
    );
};

XpRating.propTypes = {
    xpRating: PropTypes.number,
};

XpRating.defaultProps = {
    xpRating: null,
};

export default XpRating;
