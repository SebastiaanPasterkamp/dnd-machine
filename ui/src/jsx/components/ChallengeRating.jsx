import React from 'react';
import PropTypes from 'prop-types';

import utils from '../utils.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

class ChallengeRating extends LazyComponent
{
    render() {
        const { challengeRating, precise = false } = this.props;
        let value = challengeRating.toFixed(3);

        if (!precise) {
            value = utils.closest({
                0: 0.0,
                '\u215B': 0.125,
                '\u00BC': 0.25,
                '\u00BD': 0.5,
                [Math.round(value)]: 1.0,
            }, value, value);
        }

        return <div className="challenge-rating inline">
            CR&nbsp;{value}
        </div>;
    }
}

ChallengeRating.propTypes = {
    challengeRating: PropTypes.number.isRequired,
    precise: PropTypes.bool,
}

export default ChallengeRating;