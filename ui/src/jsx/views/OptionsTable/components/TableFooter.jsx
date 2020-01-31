import React from 'react';

import OptionLinks from '../../../components/OptionLinks';

export const TableFooter = function() {
    return (
        <tr>
            <td colSpan={2}>
                <OptionLinks
                    altStyle={true}
                />
            </td>
        </tr>
    );
};

export default TableFooter;
