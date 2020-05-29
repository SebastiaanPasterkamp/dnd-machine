import React from 'react';
import PropTypes from 'prop-types';

import AutoCompleteInput from '../../AutoCompleteInput';

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
        const { current, placeholder, suggestions, markup } = this.props;

        return (
            <AutoCompleteInput
                value={current}
                placeholder={placeholder}
                items={suggestions}
                markup={markup}
                rows={5}
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
    suggestions: PropTypes.arrayOf(PropTypes.string),
    placeholder: PropTypes.string,
    markup: PropTypes.bool,
};

ManualInputSelect.defaultProps = {
    current: '',
    placeholder: '',
    suggestions: [],
    markup: false,
};

export default CharacterEditorWrapper(ManualInputSelect);
