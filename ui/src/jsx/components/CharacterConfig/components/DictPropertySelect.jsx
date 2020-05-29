import React from 'react';
import PropTypes from 'prop-types';
import { sprintf } from 'sprintf-js';
import MDReactComponent from 'markdown-react-js';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';

export const DictPropertySelect = function({ hidden, current })
{
    if (hidden || !current) {
        return null;
    }

    let value = current.description;
    try {
        value = sprintf(
            current.description || '',
            current
        );
    } catch(err) {
        console.error(err);
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
