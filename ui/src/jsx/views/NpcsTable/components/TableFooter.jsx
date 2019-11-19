import React from 'react';

import NpcLinks from '../../../components/NpcLinks.jsx';

export const TableFooter = function() {
    return (
        <tr>
            <td colSpan={7}>
                <NpcLinks
                    altStyle={true}
                />
            </td>
        </tr>
    );
};

export default TableFooter;
