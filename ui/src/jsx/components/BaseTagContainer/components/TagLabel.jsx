import React from 'react';
import PropTypes from 'prop-types';

export const TagLabel = function({ children }) {
    return (
        <span className="nice-tag-label">
            {children}
        </span>
    );
};

TagLabel.propTypes = {
    children: PropTypes.node,
};

export default TagLabel;
