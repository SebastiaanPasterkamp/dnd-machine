import React from 'react';
import PropTypes from 'prop-types';

import utils, { memoize } from '../../../utils';

export const Tab = function({
    name, label, icon, color, active, disabled, onSelect,
}) {
    const tabStyle = utils.makeStyle({
        [color]: (color && !disabled),
        muted: disabled,
        current: active,
    }, ['tab-component__tab']);

    const linkStyle = utils.makeStyle({
        icon: icon,
        [icon]: icon,
        'cursor-not-allowed': disabled,
        'cursor-pointer': !disabled,
    });

    return (
        <li className={tabStyle}>
            <a
                className={linkStyle}
                onClick={!(active || disabled)
                    ? onSelect
                    : null
                }
            >
                {name !== undefined ? name : label}
            </a>
        </li>
    );
};

Tab.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    icon: PropTypes.string,
    color: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
};

Tab.defaultProps = {
    label: undefined,
    name: undefined,
    icon: null,
    color: null,
    active: false,
    disabled: false,
};

export default Tab;
