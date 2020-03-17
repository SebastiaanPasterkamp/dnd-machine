import React from 'react';

import SubClassLinks from '../../../components/SubClassLinks';

export const TableFooter = function() {
    return (
        <tr>
            <td colSpan={2}>
                <SubClassLinks
                    altStyle={true}
                />
            </td>
        </tr>
    );
};

export default TableFooter;
