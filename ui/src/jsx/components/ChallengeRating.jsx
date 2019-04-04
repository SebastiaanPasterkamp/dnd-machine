import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import utils from '../utils.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

class ChallengeRating extends LazyComponent
{
    render() {
        const {
            challengeRating, precise = false
        } = this.props;

        if (_.isNil(challengeRating)) {
            return <div className="challenge-rating inline">
                CR&nbsp;&mdash;
            </div>;
        }

        if (precise) {
            return <div className="challenge-rating inline">
                CR&nbsp;{challengeRating.toFixed(3)}
            </div>;
        }

        const value = utils.closest({
            '0': 0.0,
            '\u215B': 0.125,
            '\u00BC': 0.25,
            '\u00BD': 0.5,
            'round': 1.0,
        }, challengeRating, challengeRating);

        return <div className="challenge-rating inline">
            CR&nbsp;{
                value == 'round'
                ? Math.round(challengeRating)
                : value
            }
        </div>;
    }
}

ChallengeRating.propTypes = {
    challengeRating: PropTypes.number,
    precise: PropTypes.bool,
}

export default ChallengeRating;