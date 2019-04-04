import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import LazyComponent from '../LazyComponent.jsx';
import InputField from '../InputField.jsx';
import MarkdownTextField from '../MarkdownTextField.jsx';

import CharacterEditorWrapper from '../../hocs/CharacterEditorWrapper.jsx';

export class ManualInputSelect extends LazyComponent
{
    render() {
        const {
            onChange,
            current = '',
            placeholder = '',
            markup = false,
        } = this.props;

        return (markup
            ? <MarkdownTextField
                placeholder={placeholder}
                value={current}
                rows={5}
                setState={onChange}
                />
            : <InputField
                placeholder={placeholder}
                value={current}
                setState={onChange}
                />
        );
    }

};

ManualInputSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    markup: PropTypes.bool,
};

export default CharacterEditorWrapper(ManualInputSelect);
