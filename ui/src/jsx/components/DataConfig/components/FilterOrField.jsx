import React from 'react';
import PropTypes from 'prop-types';

import FieldSet from '../../FieldSet';

import ListFilter from './ListFilter';

export class FilterOrField extends React.Component
{
    filterType = 'or';
    filterMethod = 'or';

    constructor(props) {
        super(props);
        this.onFiltersChange = this.onFiltersChange.bind(this);
    }

    onFiltersChange(filters) {
        const { setState } = this.props;
        setState({
            type: this.filterType,
            method: this.filterMethod,
            filters,
        });
    }

    render() {
        const { filters, ...props } = this.props;

        return (
            <FieldSet label="Or filter">
                <ListFilter
                    {...props}
                    filter={filters}
                    setState={this.onFiltersChange}
                />
            </FieldSet>
        );
    }
};

FilterOrField.propTypes = {
    type: PropTypes.oneOf(['or']),
    method: PropTypes.oneOf(['or']),
    filters: PropTypes.arrayOf(PropTypes.object),
};

FilterOrField.defaultProps = {
    field: 'or',
    method: 'or',
    filters: [],
};

export default FilterOrField;
