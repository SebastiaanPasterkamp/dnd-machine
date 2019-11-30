import React from 'react';
import PropTypes from 'prop-types';

import utils from '../../../utils';

import XpRating from '../../../components/XpRating';

export const EncounterRating = ({ encounter, party }) => {
    if (!encounter || !party) {
        return null;
    }

    const {
        easy = 0,
        medium = 0,
        hard = 0,
        deadly = 0,
    } = party;

    const rating = utils.closest({
        irrelevant: 0,
        easy, medium, hard, deadly,
        insane: deadly + deadly - hard,
    }, encounter, 'irrelevant');

    if (rating === 'easy') {
        return (
            <span>
                Easy
                (<XpRating xpRating={easy} />)
            </span>
        );
    }
    if (rating === 'medium') {
        return (
            <span>
                Medium
                (<XpRating xpRating={medium} />)
            </span>
        );
    }
    if (rating === 'hard') {
        return (
            <span>
                Hard
                (<XpRating xpRating={hard} />)
            </span>
        );
    }
    if (rating === 'deadly') {
        return (
            <span>
                Deadly
                (<XpRating xpRating={deadly} />)
            </span>
        );
    }
    if (rating === 'insane') {
        return (
            <span>
                Insane
                (&gt; <XpRating xpRating={deadly} />)
            </span>
        );
    }
    return (
        <span>
            Irrelevant
            (&lt; <XpRating xpRating={easy} />)
        </span>
    );
};

EncounterRating.propTypes = {
    encounter: PropTypes.number,
    party: PropTypes.objectOf( PropTypes.number ),
};

EncounterRating.defaultProps = {
    encounter: 0,
    party: null,
};

export default EncounterRating;
