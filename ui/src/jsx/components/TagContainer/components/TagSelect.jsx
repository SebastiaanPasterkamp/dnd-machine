import React from 'react';
import PropTypes from 'prop-types';
import {
    filter,
    includes,
    map,
} from 'lodash/fp';

import SingleSelect from '../../SingleSelect';

const TagSelect = function({ onSelect, items, current, multiple }) {
    if (!items.length) return null;

    const mapped = map(
        ({id, code, name, label}) => ({
            code: id !== undefined ? id : (
                code !== undefined ? code : name
            ),
            label: label !== undefined ? label : name,
        })
    )(items);

    const filtered = multiple
        ? mapped
        : filter(item => !includes(item.code, current))(mapped);

    if (!filtered.length) return null;

    return (
        <SingleSelect
            emptyLabel="Add..."
            items={filtered}
            setState={onSelect}
        />
    );
};

TagSelect.propTypes = {
    onSelect: PropTypes.func.isRequired,
    current: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ])
    ),
    items: PropTypes.arrayOf(
        PropTypes.object
    ),
    multiple: PropTypes.bool,
};

TagSelect.defaultProps = {
    current: [],
    items: [],
    multiple: false,
};

export default TagSelect;
