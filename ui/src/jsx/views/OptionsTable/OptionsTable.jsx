import React from 'react';
import PropTypes from 'prop-types';
import {
    contains,
    filter,
} from 'lodash/fp';

import './sass/_options-table.scss';

import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper';

import ResponsiveTable from '../../components/ResponsiveTable';

import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import TableFooter from './components/TableFooter';

const OptionsTable = function({ options }) {
    return (
        <div className="options-table">
            <h2 className="icon fa-gear">Option list</h2>
            <ResponsiveTable
                headerComponent={TableHeader}
                rowComponent={TableRow}
                footerComponent={TableFooter}
                items={options}
            />
        </div>
    );
};

OptionsTable.propTypes = {
    options: PropTypes.objectOf( PropTypes.shape({
        id: PropTypes.number.isRequired,
    }) ),
};

OptionsTable.defaultProps = {
    options: {},
}

export default ObjectDataListWrapper(
    OptionsTable,
    {options: {type: 'options', group: 'data'}}
);
