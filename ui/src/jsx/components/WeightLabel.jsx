import React from 'react';
import PropTypes from 'prop-types';

const WeightLabel = function(props) {
    const { weight } = props;
    const { lb, oz } = weight === null ? props : {
        lb: Math.floor(weight),
        oz: Math.floor((weight % 1) * 16)
    };

    if (lb === null && oz === null) {
        return null;
    }
    return (
        <div className="weight inline">
            {lb ? (<span>{ lb }lb</span>) : null}
            {oz ? (<span>{ oz }oz</span>) : null}
        </div>
    );
}

WeightLabel.propTypes = {
    weight: PropTypes.number,
    lb: PropTypes.number,
    oz: PropTypes.number,
};

WeightLabel.defaultProps = {
    weight: null,
    lb: null,
    oz: null,
};

export default WeightLabel;
