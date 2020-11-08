import React from 'react';
import PropTypes from 'prop-types';

import { SelectListComponent } from '../ListComponent';

import ConditionBetween from './components/ConditionBetween';
import ConditionContains from './components/ConditionContains';
import ConditionEQ from './components/ConditionEQ';
import ConditionGTE from './components/ConditionGTE';
import ConditionLTE from './components/ConditionLTE';
import ConditionNotContains from './components/ConditionNotContains';

export class ListConditions extends React.Component
{
    options = [
        {
            id: 'between',
            name: 'Between',
            component: ConditionBetween,
        },
        {
            id: 'contains',
            name: 'Contains',
            component: ConditionContains,
        },
        {
            id: 'eq',
            name: 'Equals',
            component: ConditionEQ,
        },
        {
            id: 'gte',
            name: 'GTE',
            component: ConditionGTE,
        },
        {
            id: 'lte',
            name: 'LTE',
            component: ConditionLTE,
        },
        {
            id: 'notcontains',
            name: 'Not contains',
            component: ConditionNotContains,
        },
    ];

    render() {
        const { conditions, setState } = this.props;

        return (
            <SelectListComponent
                list={conditions}
                options={this.options}
                setState={setState}
            />
        );
    }
}

ListConditions.propTypes = {
    conditions: PropTypes.array,
    setState: PropTypes.func.isRequired,
};

ListConditions.defaultProps = {
    conditions: [],
};

export default ListConditions;
