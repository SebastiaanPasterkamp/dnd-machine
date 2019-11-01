import React from 'react';
import PropTypes from 'prop-types';
import {
    isNil,
} from 'lodash/fp';

import utils from '../utils.jsx';

export const ChallengeRating = function({ challengeRating, precise })
{
    if (isNil(challengeRating)) {
        return (
            <div className="challenge-rating inline">
                CR&nbsp;&mdash;
            </div>
        );
    }

    if (precise) {
        return (
            <div className="challenge-rating inline">
                CR&nbsp;{challengeRating.toFixed(3)}
            </div>
        );
    }

    const value = utils.closest({
        '0': 0.0,
        '\u215B': 0.125,
        '\u00BC': 0.25,
        '\u00BD': 0.5,
        'round': 1.0,
    }, challengeRating, challengeRating);

    return (
        <div className="challenge-rating inline">
            CR&nbsp;{
                value == 'round'
                ? Math.round(challengeRating)
                : value
            }
        </div>
    );
};

ChallengeRating.propTypes = {
    challengeRating: PropTypes.number,
    precise: PropTypes.bool,
};

ChallengeRating.defaultProps = {
    challengeRating: null,
    precise: false,
};

export default ChallengeRating;
