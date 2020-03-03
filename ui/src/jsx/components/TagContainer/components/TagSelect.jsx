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

    const filtered = multiple
        ? items
        : filter(item => !includes(item.id, current))(items);

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
