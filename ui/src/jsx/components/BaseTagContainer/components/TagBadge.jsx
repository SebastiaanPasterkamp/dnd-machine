import React from 'react';
import PropTypes from 'prop-types';

export const TagBadge = function({ icon, children }) {
    return (
        <span className="nice-tag-badge">
            {icon ? (
                <i className={`icon ${icon}`} />
            ) : null}
            {children}
        </span>
    );
};

TagBadge.propTypes = {
    icon: PropTypes.string,
    children: PropTypes.node,
};

TagBadge.defaultProps = {
    icon: null,
};

export default TagBadge;
