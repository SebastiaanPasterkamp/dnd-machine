import React from 'react';
import PropTypes from 'prop-types';

import utils from '../../../utils';

export const SelectItem = function({
    id, label, selected, disabled, onClick
}) {
    if (id === undefined) {
        return null;
    }
    const style = utils.makeStyle({
        info: selected,
        disabled,
    });

    return (
        <li
            className={style}
            data-value={id}
            onClick={disabled ? null : onClick}
        >
            <a>{label}</a>
        </li>
    );
};

SelectItem.propTypes = {
    onClick: PropTypes.func.isRequired,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.bool,
    ]),
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
};

SelectItem.defaultProps = {
    id: null,
    selected: false,
    disabled: false,
};

export default SelectItem;
