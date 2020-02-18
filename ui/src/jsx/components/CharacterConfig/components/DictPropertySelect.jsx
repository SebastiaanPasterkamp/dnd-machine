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

    const value = sprintf(
        current.description || '',
        current
    );

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
