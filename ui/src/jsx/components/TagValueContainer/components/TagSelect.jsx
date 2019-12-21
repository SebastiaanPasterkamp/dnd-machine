import React from 'react';
import PropTypes from 'prop-types';
import {
    filter,
    includes,
    map,
} from 'lodash/fp';

import SingleSelect from '../../SingleSelect';

const TagSelect = function({ onSelect, items, current }) {
    if (!items.length) return null;

    const mapped = map(
        ({id, code, name, label}) => ({
            code: id !== undefined ? id : (
                code !== undefined ? code : name
            ),
            label: label !== undefined ? label : name,
        })
    )(items);

    const filtered = filter(item => !(item.code in current))(mapped);

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
    current: PropTypes.objectOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ])
    ),
    items: PropTypes.arrayOf(
        PropTypes.object
    ),
};

TagSelect.defaultProps = {
    current: {},
    items: [],
};

export default TagSelect;
