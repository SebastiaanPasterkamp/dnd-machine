import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    keys,
    reduce,
} from 'lodash/fp';

import { SelectListComponent } from '../../ListComponent';

import FilterAttributeField from './FilterAttributeField';
import FilterBooleanField from './FilterBooleanField';
import FilterFormulaField from './FilterFormulaField';
import FilterOrField from './FilterOrField';
import FilterProficiencies from './FilterProficiencies';
import FilterTextField from './FilterTextField';

export class ListFilter extends React.Component
{
    options = [
        {
            id: 'attribute',
            name: 'Attribute',
            component: FilterAttributeField,
            componentProps: () => {
                const { items } = this.props;
                return { items };
            },
        },
        {
            id: 'boolean',
            name: 'Boolean',
            component: FilterBooleanField,
            initialItem: {
                method: 'absolute',
                condition: false,
            },
        },
        {
            id: 'formula',
            name: 'Formula',
            component: FilterFormulaField,
        },
        {
            id: 'or',
            name: 'Or',
            component: FilterOrField,
            initialItem: {
                method: 'or',
            },
            componentProps: () => {
                const { items } = this.props;
                return { items };
            },
        },
        {
            id: 'proficiencies',
            name: 'Proficiencies',
            component: FilterProficiencies,
            initialItem: {
                method: 'proficiency',
            },
            componentProps: () => {
                const { items } = this.props;
                return { items };
            },
        },
        {
            id: 'textfield',
            name: 'Textfield',
            component: FilterTextField,
        },
    ];

    render() {
        const { filter, setState } = this.props;

        return (
            <SelectListComponent
                list={filter}
                options={this.options}
                setState={setState}
            />
        );
    }
}

ListFilter.propTypes = {
    filter: PropTypes.arrayOf(
        PropTypes.object
    ),
    items: PropTypes.arrayOf(
        PropTypes.object
    ),
    setState: PropTypes.func.isRequired,
};

ListFilter.defaultProps = {
    filter: [],
    items: [],
};

export default ListFilter;
