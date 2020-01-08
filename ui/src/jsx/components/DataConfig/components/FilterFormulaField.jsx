import React from 'react';
import PropTypes from 'prop-types';

import ControlGroup from '../../ControlGroup';
import InputField from '../../InputField';

export class FilterFormulaField extends React.Component
{
    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        setState({ field: `${field}_formula` });
    }

    onFilterChange(filter) {
        const { setState } = this.props;
        setState({ filter });
    }

    render() {
        const { field, filter } = this.props;

        return (
            <ControlGroup labels={["Field", "Formula"]}>
                <InputField
                    placeholder="Field..."
                    value={field.replace(/_formula$/, '')}
                    type="text"
                    setState={this.onFieldChange}
                />
                <InputField
                    placeholder="Formula..."
                    value={filter}
                    type="text"
                    setState={this.onFilterChange}
                />
            </ControlGroup>
        );
    }
};

FilterFormulaField.propTypes = {
    field: PropTypes.string,
    filter: PropTypes.string,
};

FilterFormulaField.defaultProps = {
    field: '_formula',
    filter: '',
};

export default FilterFormulaField;
