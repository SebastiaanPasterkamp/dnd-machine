import React from 'react';
import PropTypes from 'prop-types';
import {
    contains,
    filter,
} from 'lodash/fp';

import './sass/_backgrounds-table.scss';

import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper';

import ResponsiveTable from '../../components/ResponsiveTable';

import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import TableFooter from './components/TableFooter';

const BackgroundsTable = function({ backgrounds }) {
    return (
        <div className="backgrounds-table">
            <h2 className="icon fa-history">Backgrounds list</h2>
            <ResponsiveTable
                headerComponent={TableHeader}
                rowComponent={TableRow}
                footerComponent={TableFooter}
                items={backgrounds}
            />
        </div>
    );
};

BackgroundsTable.propTypes = {
    backgrounds: PropTypes.objectOf( PropTypes.shape({
        id: PropTypes.number.isRequired,
    }) ),
};

BackgroundsTable.defaultProps = {
    backgrounds: {},
}

export default ObjectDataListWrapper(
    BackgroundsTable,
    {backgrounds: {type: 'background', group: 'data'}}
);
