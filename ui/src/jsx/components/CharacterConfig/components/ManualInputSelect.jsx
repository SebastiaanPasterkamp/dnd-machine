import React from 'react';
import PropTypes from 'prop-types';

import InputField from '../../InputField';
import MarkdownTextField from '../../MarkdownTextField';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';

export class ManualInputSelect extends React.Component
{
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        const { current, onChange } = this.props;
        onChange( current );
    }

    onChange(current) {
        const { onChange, setState } = this.props;
        setState({ current });
        onChange(current);
    };

    render() {
        const { current, markup, placeholder } = this.props;

        if(markup) {
            return (
                <MarkdownTextField
                    placeholder={placeholder}
                    value={current}
                    rows={5}
                    setState={this.onChange}
                />
            );
        }

        return (
            <InputField
                placeholder={placeholder}
                value={current}
                setState={this.onChange}
            />
        );
    }
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
