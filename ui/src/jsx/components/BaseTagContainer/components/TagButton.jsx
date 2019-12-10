import React from 'react';
import PropTypes from 'prop-types';

export const TagButton = function({ onClick, icon, label }) {
    return (
        <button className="nice-tag-btn" onClick={onClick}>
            {icon ? <i className={`icon ${icon}`} /> : null}
            {label}
        </button>
    );
};

TagButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

TagButton.defaultProps = {
    icon: null,
    label: null,
};

export default TagButton;
