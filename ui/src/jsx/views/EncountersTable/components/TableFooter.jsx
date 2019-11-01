import React from 'react';

import EncounterLinks from '../../../components/EncounterLinks';

export const TableFooter = function() {
    return (
        <tr>
            <td colSpan={4}>
                <EncounterLinks
                    altStyle={true}
                />
            </td>
        </tr>
    );
};

export default TableFooter;
