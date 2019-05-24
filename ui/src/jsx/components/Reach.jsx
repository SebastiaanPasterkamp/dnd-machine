import React from 'react';
import PropTypes from 'prop-types';
import {
    isNumber,
} from 'lodash/fp';

const Reach = function(props) {
    const { distance, min, max } = props;
    const { feet, inch } = isNumber(distance) ? {
        feet: Math.floor(distance),
        inch: Math.floor((distance % 1) * 12),
    } : props;

    if (distance !== null && !isNumber(distance)) {
        return (
            <div className="reach inline">
                {distance}
            </div>
        );
    }

    if (min !== null) {
        if (min >= max) {
            return (
                <div className="reach inline">
                    {min} ft.
                </div>
            )
        }

        return (
            <div className="reach inline">
                {min} ft. / {max} ft.
            </div>
        );
    }

    if (feet === null && inch === null) {
        return null;
    }

    return (
        <div className="reach inline">
            {feet ? (<span>{ feet } ft.</span>) : null}
            {inch ? (<span>{ inch } inch</span>) : null}
        </div>
    );
}

Reach.propTypes = {
    distance: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    feet: PropTypes.number,
    inch: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
};

Reach.defaultProps = {
    distance: null,
    feet: null,
    inch: null,
    min: null,
    max: null,
};

export default Reach;
