import React from 'react';
import PropTypes from 'prop-types';

import ControlGroup from '../../ControlGroup';
import FieldSet from '../../FieldSet';
import InputField from '../../InputField';
import { ListComponent } from '../../ListComponent';
import TagContainer from '../../TagContainer';

export class FilterTextField extends React.Component
{
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
            <FieldSet label="Filter textfield">
                <ControlGroup label="Field">
                    <InputField
                        placeholder="Field..."
                        value={field}
                        type="text"
                        setState={this.onFieldChange}
                    />
                </ControlGroup>
                <FieldSet label="Values">
                    <ListComponent
                        list={filter}
                        component={InputField}
                        newItem="auto"
                        setState={this.onFilterChange}
                    />
                </FieldSet>
            </FieldSet>
        );
    }
};

FilterTextField.propTypes = {
    field: PropTypes.string,
    filter: PropTypes.arrayOf(PropTypes.string),
};

FilterTextField.defaultProps = {
    field: '',
    filter: [],
};

export default FilterTextField;
