import React from 'react';
import PropTypes from 'prop-types';

const Footer = function({budget, spent, showBonus, showFinal, increase}) {
    if (!budget) {
        return null;
    }

    return (
        <tfoot>
            <tr key="budget" className="text-align-center">
                <th>Budget</th>
                <td>{budget - spent}</td>
                <td colSpan={
                    1
                    + (showBonus ? 1 : 0)
                    + increase
                    + (showFinal ? 1 : 0)
                }></td>
            </tr>
        </tfoot>
    );
};

Footer.propTypes = {
    budget: PropTypes.number,
    spent: PropTypes.number,
    showBonus: PropTypes.bool,
    showFinal: PropTypes.bool,
    increase: PropTypes.number,
};

Footer.defaultProps = {
    bonus: 0,
    spent: 0,
    showBonus: false,
    showFinal: false,
    increase: 0,
};

export default Footer;
