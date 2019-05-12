import React from 'react';
import PropTypes from 'prop-types';

import LazyComponent from '../LazyComponent.jsx';
import InputField from '../InputField.jsx';
import MarkdownTextField from '../MarkdownTextField.jsx';

import CharacterEditorWrapper from '../../hocs/CharacterEditorWrapper.jsx';

export const ManualInputSelect = function({
    onChange, current, placeholder, markup,
}) {
    if(markup) {
        return (
            <MarkdownTextField
                placeholder={placeholder}
                value={current}
                rows={5}
                setState={onChange}
            />
        );
    }

    return (
        <InputField
            placeholder={placeholder}
            value={current}
            setState={onChange}
        />
    );
};

ManualInputSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    current: PropTypes.string,
    placeholder: PropTypes.string,
    markup: PropTypes.bool,
};

ManualInputSelect.defaultProps = {
    current: '',
    placeholder: '',
    markup: false,
};

export default CharacterEditorWrapper(
    ManualInputSelect,
    {
        current: true,
    }
);
