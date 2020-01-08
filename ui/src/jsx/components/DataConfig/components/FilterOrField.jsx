import React from 'react';
import PropTypes from 'prop-types';

import FieldSet from '../../FieldSet';
import { ListComponent } from '../../ListComponent';

import ListFilter from './ListFilter';

export class FilterOrField extends React.Component
{
    filterField = 'or';

    component = ({setState, onChange, ...props}) => (
        <ListFilter
            setState={setState}
            onChange={onChange}
            filter={props}
        />
    );

    constructor(props) {
        super(props);
        this.onFilterChange = this.onFilterChange.bind(this);
    }

    onFilterChange(filter) {
        const { setState } = this.props;
        setState({ field: this.filterField, filter });
    }

    render() {
        const { filter } = this.props;

        return (
            <FieldSet label="Or filter">
                <ListComponent
                    list={filter}
                    component={this.component}
                    newItem="auto"
                    setState={this.onFilterChange}
                />
            </FieldSet>
        );
    }
};

FilterOrField.propTypes = {
    field: PropTypes.oneOf(['or']),
    filter: PropTypes.arrayOf(PropTypes.object),
};

FilterOrField.defaultProps = {
    field: 'or',
    filter: [],
};

export default FilterOrField;
