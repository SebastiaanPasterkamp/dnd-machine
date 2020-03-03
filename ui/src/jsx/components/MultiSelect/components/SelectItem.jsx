import React from 'react';
import PropTypes from 'prop-types';

import utils from '../../../utils';

export const SelectItem = function({
    id, name, checked, disabled, onSelect, onDeselect,
}) {
    if (id === undefined) {
        return null;
    }
    const style = utils.makeStyle({
        info: checked,
        disabled,
    });

    return (
        <li
            data-value={id}
            className={style}
        >
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={disabled
                        ? null
                        : (checked ? onDeselect : onSelect)
                    }
                />
                {name}
            </label>
        </li>
    );
};

SelectItem.propTypes = {
    onSelect: PropTypes.func.isRequired,
    onDeselect: PropTypes.func.isRequired,
    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.bool,
    ]),
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
};

SelectItem.defaultProps = {
    id: null,
    selected: false,
    disabled: false,
};

export default SelectItem;
