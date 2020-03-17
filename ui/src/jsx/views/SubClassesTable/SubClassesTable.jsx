import React from 'react';
import PropTypes from 'prop-types';
import {
    contains,
    filter,
} from 'lodash/fp';

import './sass/_subclasses-table.scss';

import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper';

import ResponsiveTable from '../../components/ResponsiveTable';

import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import TableFooter from './components/TableFooter';

const SubClassesTable = function({ subclasses }) {
    return (
        <div className="subclasses-table">
            <h2 className="icon fa-users">Subclasses list</h2>
            <ResponsiveTable
                headerComponent={TableHeader}
                rowComponent={TableRow}
                footerComponent={TableFooter}
                items={subclasses}
            />
        </div>
    );
};

SubClassesTable.propTypes = {
    subclasses: PropTypes.objectOf( PropTypes.shape({
        id: PropTypes.number.isRequired,
    }) ),
};

SubClassesTable.defaultProps = {
    subclasses: {},
}

export default ObjectDataListWrapper(
    SubClassesTable,
    {subclasses: {type: 'subclass', group: 'data'}}
);
