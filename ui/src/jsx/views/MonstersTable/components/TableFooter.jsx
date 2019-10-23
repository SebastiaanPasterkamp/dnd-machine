import React from 'react';

import MonsterLinks from '../../../components/MonsterLinks';

export const TableFooter = function() {
    return (
        <tr>
            <td colSpan={4}>
                <MonsterLinks
                    altStyle={true}
                />
            </td>
        </tr>
    );
};

export default TableFooter;
