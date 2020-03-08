import React from 'react';
import PropTypes from 'prop-types';

import ControlGroup from '../../ControlGroup';
import InputField from '../../InputField';

export class FilterFormulaField extends React.Component
{
    filterType = 'formula';

    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onOptionsChange = this.onOptionsChange.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        setState({
            type: this.filterType,
            field: `${field}_formula`,
        });
    }

    onOptionsChange(options) {
        const { setState } = this.props;
        setState({
            type: this.filterType,
            options,
        });
    }

    render() {
        const { field, options } = this.props;

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
                    value={options}
                    type="text"
                    setState={this.onOptionsChange}
                />
            </ControlGroup>
        );
    }
};

FilterFormulaField.propTypes = {
    type: PropTypes.oneOf(['formula']),
    field: PropTypes.string,
    options: PropTypes.string,
};

FilterFormulaField.defaultProps = {
    type: 'formula',
    field: '_formula',
    options: '',
};

export default FilterFormulaField;
