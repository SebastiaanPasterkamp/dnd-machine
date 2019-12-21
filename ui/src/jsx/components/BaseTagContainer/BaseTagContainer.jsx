import React from 'react';
import PropTypes from 'prop-types';

import utils from '../../utils';

import './sass/_base-tag-container.scss';

export const BaseTagContainer = function({ className, children }) {
    const style = utils.makeStyle({}, [
        "base-tag-container",
        "nice-tags-container",
        className
    ]);

    return (
        <div className={style}>
            {children}
        </div>
    );
}

BaseTagContainer.propTypes = {
    className: PropTypes.string,
};

export default BaseTagContainer;
