import React from 'react';
import PropTypes from 'prop-types';
import MDReactComponent from 'markdown-react-js';

import RaceLinks from '../../../components/RaceLinks';

export const TableRow = function({ id, name, description }) {
    return (
        <tr data-name={id}>
            <th>
                { name }
                <RaceLinks
                    altStyle={true}
                    id={id}
                />
            </th>
            <td>
                <MDReactComponent
                    text={description || ''}
                />
            </td>
        </tr>
    );
};

TableRow.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
};

TableRow.defaultProps = {
    description: '',
};

export default TableRow;
