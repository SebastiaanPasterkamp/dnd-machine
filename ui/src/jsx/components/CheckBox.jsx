import React from 'react';
import PropTypes from 'prop-types';

import utils from '../utils.jsx';

const CheckBox = function({ isChecked }) {
    const style = utils.makeStyle({
        'fa-check-square-o': isChecked,
        'fa-square-o': !isChecked,
    }, ['icon']);

    return (
        <span className={style}>&nbsp;</span>
    );
};

CheckBox.propTypes = {
    isChecked: PropTypes.bool.isRequired,
};

export default CheckBox;
