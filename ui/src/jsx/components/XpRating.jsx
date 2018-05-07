import React from 'react';
import PropTypes from 'prop-types';

import LazyComponent from '../components/LazyComponent.jsx';

class XpRating extends LazyComponent
{
    render() {
        const { xpRating } = this.props;
        const value = Math.round(xpRating);

        return <div className="xp-rating inline">
            {value}&nbsp;XP
        </div>;
    }
}

XpRating.propTypes = {
    xpRating: PropTypes.number.isRequired,
}

export default XpRating;