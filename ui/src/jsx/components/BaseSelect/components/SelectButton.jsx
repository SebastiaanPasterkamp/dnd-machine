import React from 'react';
import PropTypes from 'prop-types';

export const SelectButton = function({ label, onToggle, ...props })
{
    return (
        <button
            className="nice-btn"
            onClick={onToggle}
            {...props}
        >
            {label}
            <i className="icon fa-angle-down" />
        </button>
    );
};

SelectButton.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default SelectButton;
