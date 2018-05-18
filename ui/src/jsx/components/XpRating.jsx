import React from 'react';
import PropTypes from 'prop-types';

import LazyComponent from '../components/LazyComponent.jsx';

class XpRating extends LazyComponent
{
    render() {
        const { xpRating } = this.props;
        if (_.isNil(xpRating)) {
            return <div className="challenge-rating inline">
                CR&nbsp;&mdash;
            </div>;
        }

        const value = Math.round(xpRating);

        return <div className="xp-rating inline">
            {value}&nbsp;XP
        </div>;
    }
}

XpRating.propTypes = {
    xpRating: PropTypes.number,
}

export default XpRating;