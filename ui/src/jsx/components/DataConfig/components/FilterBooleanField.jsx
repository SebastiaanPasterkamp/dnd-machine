import React from 'react';
import PropTypes from 'prop-types';

import ControlGroup from '../../ControlGroup';
import InputField from '../../InputField';
import SingleSelect from '../../SingleSelect';

export class FilterBooleanField extends React.Component
{
    filterType = 'boolean';
    filterMethod = 'absolute';

    items = [
        { id: true, name: "True" },
        { id: false, name: "False" },
    ];

    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onConditionChange = this.onConditionChange.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        setState({
            type: this.filterType,
            method: this.filterMethod,
            field,
        });
    }

    onConditionChange(condition) {
        const { setState } = this.props;
        setState({
            type: this.filterType,
            method: this.filterMethod,
            condition,
        });
    }

    render() {
        const { field, condition } = this.props;

        return (
            <ControlGroup labels={["Field", "Boolean"]}>
                <InputField
                    placeholder="Field..."
                    value={field}
                    type="text"
                    setState={this.onFieldChange}
                />
                <SingleSelect
                    selected={condition}
                    items={this.items}
                    setState={this.onConditionChange}
                />
            </ControlGroup>
        );
    }
};

FilterBooleanField.propTypes = {
    type: PropTypes.oneOf(['boolean']),
    method: PropTypes.oneOf(['absolute']),
    field: PropTypes.string,
    condition: PropTypes.bool,
};

FilterBooleanField.defaultProps = {
    field: 'boolean',
    method: 'absolute',
    field: '',
    condition: false,
};

export default FilterBooleanField;
