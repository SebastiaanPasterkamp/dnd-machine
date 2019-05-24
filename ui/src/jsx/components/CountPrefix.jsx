import React from 'react';
import PropTypes from 'prop-types';

const CountPrefix = function({ count, alwaysCount, children }) {
    if ( count === 1 && !alwaysCount ) {
        return children;
    }

    return (
        <React.Fragment>
            {count} &times; {children}
        </React.Fragment>
    );
}

CountPrefix.propTypes = {
    count: PropTypes.number,
    alwaysCount: PropTypes.bool,
    children: PropTypes.any.isRequired,
};

CountPrefix.defaultProps = {
    count: 1,
    alwaysCount: false,
};

export default CountPrefix;
