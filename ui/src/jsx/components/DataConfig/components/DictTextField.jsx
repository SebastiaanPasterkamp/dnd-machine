import React from 'react';
import PropTypes from 'prop-types';

import ControlGroup from '../../ControlGroup';
import FieldSet from '../../FieldSet';
import InputField from '../../InputField';
import MarkdownTextField from '../../MarkdownTextField';

export class DictTextField extends React.Component
{
    fieldType = 'text';

    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        setState({ type: this.fieldType, field });
    }

    onTextChange(text) {
        const { field, setState } = this.props;
        setState({ type: this.fieldType, text });
    }

    render() {
        const { field, text } = this.props;

        return (
            <FieldSet label="Text value">
                <ControlGroup label="Field">
                    <InputField
                        placeholder="Field..."
                        value={field}
                        type="text"
                        setState={this.onFieldChange}
                    />
                </ControlGroup>
                <MarkdownTextField
                    placeholder="Value..."
                    value={text}
                    className="small"
                    setState={this.onTextChange}
                />
            </FieldSet>
        );
    }
};

DictTextField.propTypes = {
    type: PropTypes.oneOf(['text']).isRequired,
    field: PropTypes.string,
    text: PropTypes.string,
};

DictTextField.defaultProps = {
    type: 'text',
    field: '',
    text: '',
};

export default DictTextField;
