import React from 'react';
import PropTypes from 'prop-types';
import {
    contains,
    filter,
} from 'lodash/fp';

import './sass/_classes-table.scss';

import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper';

import ResponsiveTable from '../../components/ResponsiveTable';

import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import TableFooter from './components/TableFooter';

const ClassesTable = function({ classes }) {
    return (
        <div className="options-table">
            <h2 className="icon fa-user">Classes list</h2>
            <ResponsiveTable
                headerComponent={TableHeader}
                rowComponent={TableRow}
                footerComponent={TableFooter}
                items={classes}
            />
        </div>
    );
};

ClassesTable.propTypes = {
    classes: PropTypes.objectOf( PropTypes.shape({
        id: PropTypes.number.isRequired,
    }) ),
};

ClassesTable.defaultProps = {
    classes: {},
}

export default ObjectDataListWrapper(
    ClassesTable,
    {classes: {type: 'class', group: 'data'}}
);
