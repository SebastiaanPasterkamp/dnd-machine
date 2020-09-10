import React from 'react';
import PropTypes from 'prop-types';
import { sprintf } from 'sprintf-js';
import MDReactComponent from 'markdown-react-js';
import {
    keys,
    reduce,
} from 'lodash/fp';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';

export const DictPropertySelect = function({ hidden, current })
{
    if (hidden || !current) {
        return null;
    }

    let value = current.description;
    const defaulted = reduce(
        (defaulted, key) => {
            if (!key.match(/_default$/)) {
                return defaulted;
            }
            const field = key.replace(/_default$/, '');
            return {
                [field]: current[key],
                ...defaulted,
            };
        },
        {}
    )(keys(current));
    try {
        value = sprintf(
            current.description || '',
            { ...defaulted, ...current }
        );
    } catch(err) {
        console.error(err, current);
    }

    return (
        <MDReactComponent text={value} />
    );
};

DictPropertySelect.propTypes = {
    type: PropTypes.oneOf(['dict']).isRequired,
    uuid: PropTypes.string.isRequired,
    current: PropTypes.object,
    dict: PropTypes.object,
    hidden: PropTypes.bool,
};

export default CharacterEditorWrapper(DictPropertySelect);
