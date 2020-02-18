import React from 'react';
import PropTypes from 'prop-types';

import InputField from '../../InputField';
import MarkdownTextField from '../../MarkdownTextField';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';

export class ManualInputSelect extends React.Component
{
    constructor(props) {
        super(props);
        this.onSetState = this.onSetState.bind(this);
    }

    onSetState(current) {
        const { setState } = this.props;
        setState({ current });
    };

    render() {
        const { current, markup, placeholder } = this.props;

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
    }
};

ManualInputSelect.propTypes = {
    type: PropTypes.oneOf(['manual']).isRequired,
    uuid: PropTypes.string.isRequired,
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

export default CharacterEditorWrapper(ManualInputSelect);
