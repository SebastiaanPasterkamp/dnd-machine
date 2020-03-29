import React from 'react';
import PropTypes from 'prop-types';
import {
    filter,
    includes,
    map,
} from 'lodash/fp';

import SingleSelect from '../../SingleSelect';

const isDisabled = () => false;

const TagSelect = function({ onSelect, items, current, multiple, ...props }) {
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
            isDisabled={isDisabled}
            {...props}
        />
    );
};

TagSelect.propTypes = {
    onSelect: PropTypes.func.isRequired,
    current: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.bool,
            PropTypes.shape({
                id: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]).isRequired,
                name: PropTypes.string.isRequired,
            }),
        ])
    ),
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]).isRequired,
            name: PropTypes.string.isRequired,
        }),
    ),
    multiple: PropTypes.bool,
    objects: PropTypes.bool,
};

TagSelect.defaultProps = {
    current: [],
    items: [],
    multiple: false,
    objects: false,
};

export default TagSelect;
