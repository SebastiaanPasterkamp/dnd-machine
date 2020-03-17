import React from 'react';
import PropTypes from 'prop-types';
import {
    contains,
    filter,
} from 'lodash/fp';

import './sass/_subraces-table.scss';

import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper';

import ResponsiveTable from '../../components/ResponsiveTable';

import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import TableFooter from './components/TableFooter';

const SubRacesTable = function({ subraces }) {
    return (
        <div className="subraces-table">
            <h2 className="icon fa-cubes">Subraces list</h2>
            <ResponsiveTable
                headerComponent={TableHeader}
                rowComponent={TableRow}
                footerComponent={TableFooter}
                items={subraces}
            />
        </div>
    );
};

SubRacesTable.propTypes = {
    subraces: PropTypes.objectOf( PropTypes.shape({
        id: PropTypes.number.isRequired,
    }) ),
};

SubRacesTable.defaultProps = {
    subraces: {},
}

export default ObjectDataListWrapper(
    SubRacesTable,
    {subraces: {type: 'subrace', group: 'data'}}
);
