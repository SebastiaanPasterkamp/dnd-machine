import React from 'react';
import PropTypes from 'prop-types';

import ControlGroup from '../../ControlGroup';
import FieldSet from '../../FieldSet';
import InputField from '../../InputField';

export class DictNumberField extends React.Component
{
    fieldType = 'number';

    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onNumberChange = this.onNumberChange.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        setState({ type: this.fieldType, field });
    }

    onNumberChange(number) {
        const { setState } = this.props;
        setState({ type: this.fieldType, number });
    }

    render() {
        const { field, number } = this.props;

        return (
            <FieldSet label="Numeric value">
                <ControlGroup labels={["Field", "Number"]}>
                    <InputField
                        placeholder="Field..."
                        value={field}
                        type="text"
                        setState={this.onFieldChange}
                    />
                    <InputField
                        value={number}
                        type="number"
                        setState={this.onNumberChange}
                    />
                </ControlGroup>
            </FieldSet>
        );
    }
};

DictNumberField.propTypes = {
    type: PropTypes.oneOf(['number']).isRequired,
    field: PropTypes.string,
    number: PropTypes.number,
};

DictNumberField.defaultProps = {
    type: 'number',
    field: '',
    number: 0,
};

export default DictNumberField;
