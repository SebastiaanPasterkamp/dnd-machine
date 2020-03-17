import React from 'react';

import SubRaceLinks from '../../../components/SubRaceLinks';

export const TableFooter = function() {
    return (
        <tr>
            <td colSpan={2}>
                <SubRaceLinks
                    altStyle={true}
                />
            </td>
        </tr>
    );
};

export default TableFooter;
