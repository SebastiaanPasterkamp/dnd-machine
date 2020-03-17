import React from 'react';

import BackgroundLinks from '../../../components/BackgroundLinks';

export const TableFooter = function() {
    return (
        <tr>
            <td colSpan={2}>
                <BackgroundLinks
                    altStyle={true}
                />
            </td>
        </tr>
    );
};

export default TableFooter;
