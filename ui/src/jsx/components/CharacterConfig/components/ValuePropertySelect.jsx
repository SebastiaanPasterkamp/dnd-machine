import React from 'react';
import PropTypes from 'prop-types';
import MDReactComponent from 'markdown-react-js';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';

export const ValuePropertySelect = function({ value, hidden })
{
    if (hidden) {
        return null;
    }

    if (!value) {
        return null;
    }

    return (
        <MDReactComponent text={value} />
    );
};

ValuePropertySelect.propTypes = {
    type: PropTypes.oneOf(['value']).isRequired,
    uuid: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    hidden: PropTypes.bool,
};

ValuePropertySelect.defaultProps = {
    hidden: false,
};

export default CharacterEditorWrapper(ValuePropertySelect);
