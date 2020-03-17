import React from 'react';
import PropTypes from 'prop-types';
import {
    contains,
    filter,
} from 'lodash/fp';

import './sass/_races-table.scss';

import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper';

import ResponsiveTable from '../../components/ResponsiveTable';

import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import TableFooter from './components/TableFooter';

const RacesTable = function({ races }) {
    return (
        <div className="races-table">
            <h2 className="icon fa-cube">Races list</h2>
            <ResponsiveTable
                headerComponent={TableHeader}
                rowComponent={TableRow}
                footerComponent={TableFooter}
                items={races}
            />
        </div>
    );
};

RacesTable.propTypes = {
    races: PropTypes.objectOf( PropTypes.shape({
        id: PropTypes.number.isRequired,
    }) ),
};

RacesTable.defaultProps = {
    races: {},
}

export default ObjectDataListWrapper(
    RacesTable,
    {races: {type: 'race', group: 'data'}}
);
