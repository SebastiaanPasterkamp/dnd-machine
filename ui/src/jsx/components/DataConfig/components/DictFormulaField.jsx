import React from 'react';
import PropTypes from 'prop-types';

import ControlGroup from '../../ControlGroup';
import FieldSet from '../../FieldSet';
import InputField from '../../InputField';
import MarkdownTextField from '../../MarkdownTextField';

export class DictFormulaField extends React.Component
{
    fieldType = 'formula';

    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onFormulaChange = this.onFormulaChange.bind(this);
        this.onAltTextChange = this.onAltTextChange.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        setState({ type: this.fieldType, field });
    }

    onFormulaChange(formula) {
        const { setState } = this.props;
        setState({ type: this.fieldType, formula });
    }

    onAltTextChange(alttext) {
        const { setState } = this.props;
        setState({ type: this.fieldType, alttext });
    }

    render() {
        const { field, formula, alttext } = this.props;

        return (
            <FieldSet label="Formula value">
                <ControlGroup labels={["Field", "Formula"]}>
                    <InputField
                        placeholder="Field..."
                        value={field}
                        type="text"
                        setState={this.onFieldChange}
                    />
                    <InputField
                        placeholder="Formula..."
                        value={formula}
                        type="text"
                        setState={this.onFormulaChange}
                    />
                </ControlGroup>
                <MarkdownTextField
                    placeholder="Alternative text..."
                    value={alttext}
                    className="small"
                    setState={this.onAltTextChange}
                />
            </FieldSet>
        );
    }
};

DictFormulaField.propTypes = {
    type: PropTypes.oneOf(['formula']).isRequired,
    setState: PropTypes.func.isRequired,
    field: PropTypes.string,
    formula: PropTypes.string,
    alttext: PropTypes.string,
};

DictFormulaField.defaultProps = {
    type: 'formula',
    field: '',
    formula: '',
    alttext: '',
};

export default DictFormulaField;
