import React from 'react';
import PropTypes from 'prop-types';

const WeightLabel = function({ lb }) {
    if (lb === null && oz === null) {
        return null;
    }
    return (
        <div className="weight inline">
            {lb && (<span>{ lb }lb</span>)
            {oz && (<span>{ oz }oz</span>)
        </div>
    );
}

WeightLabel.propTypes = {
    lb: PropTypes.number,
    oz: PropTypes.number,
};

WeightLabel.defaultProps = {
    lb: null,
    oz: null,
};

export default WeightLabel;
