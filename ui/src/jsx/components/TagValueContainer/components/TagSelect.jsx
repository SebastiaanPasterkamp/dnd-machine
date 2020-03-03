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

    const filtered = filter(item => !(item.id in current))(items);

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
