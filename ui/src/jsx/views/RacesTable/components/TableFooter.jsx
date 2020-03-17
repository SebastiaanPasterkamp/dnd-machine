import React from 'react';

import RaceLinks from '../../../components/RaceLinks';

export const TableFooter = function() {
    return (
        <tr>
            <td colSpan={2}>
                <RaceLinks
                    altStyle={true}
                />
            </td>
        </tr>
    );
};

export default TableFooter;
