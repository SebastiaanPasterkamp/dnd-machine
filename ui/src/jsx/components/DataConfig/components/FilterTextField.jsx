import React from 'react';
import PropTypes from 'prop-types';

import ControlGroup from '../../ControlGroup';
import FieldSet from '../../FieldSet';
import InputField from '../../InputField';
import { ListComponent } from '../../ListComponent';
import TagContainer from '../../TagContainer';

export class FilterTextField extends React.Component
{
    filterType = 'textfield';

    constructor(props) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onOptionsChange = this.onOptionsChange.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        setState({
            type: this.filterType,
            field,
        });
    }

    onOptionsChange(options) {
        const { setState } = this.props;
        setState({
            type: this.filterType,
            method: this.filterMethod,
            options,
        });
    }

    render() {
        const { field, options } = this.props;

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
                <FieldSet label="Options">
                    <ListComponent
                        list={options}
                        component={InputField}
                        newItem="auto"
                        setState={this.onOptionsChange}
                    />
                </FieldSet>
            </FieldSet>
        );
    }
};

FilterTextField.propTypes = {
    type: PropTypes.oneOf(['textfield']),
    field: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
};

FilterTextField.defaultProps = {
    type: 'textfield',
    field: '',
    options: [],
};

export default FilterTextField;
