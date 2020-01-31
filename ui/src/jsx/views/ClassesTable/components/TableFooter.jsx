import React from 'react';

import ClassLinks from '../../../components/ClassLinks';

export const TableFooter = function() {
    return (
        <tr>
            <td colSpan={2}>
                <ClassLinks
                    altStyle={true}
                />
            </td>
        </tr>
    );
};

export default TableFooter;
