import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    keys,
    reduce,
} from 'lodash/fp';

import { SelectListComponent } from '../../ListComponent';

import FilterBooleanField from './FilterBooleanField';
import FilterFormulaField from './FilterFormulaField';
import FilterOrField from './FilterOrField';
import FilterTextField from './FilterTextField';

export class ListFilter extends React.Component
{
    options = [
        {
            id: 'or',
            label: 'Or',
            component: FilterOrField,
            initialItem: {
                field: 'or',
                filter: [],
            },
        },
        {
            id: 'boolean',
            label: 'Boolean',
            component: FilterBooleanField,
            initialItem: {
                field: '',
                filter: true,
            },
        },
        {
            id: 'textfield',
            label: 'Textfield',
            component: FilterTextField,
            initialItem: {
                field: '',
                filter: [],
            },
        },
        {
            id: 'formula',
            label: 'Formula',
            component: FilterFormulaField,
            initialItem: {
                field: '_formula',
                filter: '',
            },
        },
    ];

    constructor(props) {
        super(props);
        this.mapField = this.mapField.bind(this);
        this.onSetState = this.onSetState.bind(this);
    }

    mapField(field) {
        const { filter: { [field]: filter } } = this.props;
        if (field === 'or') {
            return { type: 'or', field, filter };
        }
        if (filter === true || filter === false) {
            return { type: 'boolean', field, filter };
        }
        if (field.match(/_formula$/)) {
            return { type: 'formula', field, filter };
        }
        return { type: 'textfield', field, filter };
    }

    onSetState(filter) {
        const { setState } = this.props;
        setState(reduce(
            (result, {field, filter}) => ({...result, [field]: filter}),
            {}
        )(filter));
    }

    render() {
        const { filter, setState } = this.props;

        return (
            <SelectListComponent
                list={map(this.mapField)(keys(filter))}
                options={this.options}
                setState={this.onSetState}
            />
        );
    }
}

ListFilter.propTypes = {
    filter: PropTypes.object,
    setState: PropTypes.func.isRequired,
};

ListFilter.defaultProps = {
    filter: {},
};

export default ListFilter;
