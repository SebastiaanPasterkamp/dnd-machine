import React from 'react';
import PropTypes from 'prop-types';

import LazyComponent from '../../LazyComponent';
import InputField from '../../InputField';
import MarkdownTextField from '../../MarkdownTextField';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';

export const ManualInputSelect = function({
    onChange, setState, current, placeholder, markup,
}) {
    this.onSetState = this.onSetState || function(current) {
        setState({ current });
        onChange(current);
    }.bind(this);

    if(markup) {
        return (
            <MarkdownTextField
                placeholder={placeholder}
                value={current}
                rows={5}
                setState={this.onSetState}
            />
        );
    }

    return (
        <InputField
            placeholder={placeholder}
            value={current}
            setState={this.onSetState}
        />
    );
};

ManualInputSelect.propTypes = {
    type: PropTypes.oneOf(['manual']).isRequired,
    uuid: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    setState: PropTypes.func.isRequired,
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
