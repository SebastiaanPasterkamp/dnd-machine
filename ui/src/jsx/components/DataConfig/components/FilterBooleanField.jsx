import React from 'react';
import PropTypes from 'prop-types';

import ControlGroup from '../../ControlGroup';
import InputField from '../../InputField';
import SingleSelect from '../../SingleSelect';

export class FilterBooleanField extends React.Component
{
    items = [
        { id: true, label: "True" },
        { id: false, label: "False" },
    ];

    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        setState({ field });
    }

    onFilterChange(filter) {
        const { setState } = this.props;
        setState({ filter });
    }

    render() {
        const { field, filter } = this.props;

        return (
            <ControlGroup labels={["Field", "Boolean"]}>
                <InputField
                    placeholder="Field..."
                    value={field}
                    type="text"
                    setState={this.onFieldChange}
                />
                <SingleSelect
                    selected={filter}
                    items={this.items}
                    setState={this.onFilterChange}
                />
            </ControlGroup>
        );
    }
};

FilterBooleanField.propTypes = {
    field: PropTypes.string,
    filter: PropTypes.bool,
};

FilterBooleanField.defaultProps = {
    field: '',
    filter: false,
};

export default FilterBooleanField;
