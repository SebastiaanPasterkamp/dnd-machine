import React from 'react';
import PropTypes from 'prop-types';

const Header = function({showBonus, showFinal, increase}) {
    return (
        <thead>
            <tr>
                <th>Statistic</th>
                <th className="text-align-center">Base</th>
                {increase
                    ? <th colSpan={increase} className="text-align-center">Increase</th>
                    : null
                }
                {showBonus
                    ? <th className="text-align-center">Bonus</th>
                    : null
                }
                {showFinal
                    ? <th className="text-align-center">Final</th>
                    : null
                }
                <th className="text-align-center">Modifier</th>
            </tr>
        </thead>
    );
};

Header.propTypes = {
    showBonus: PropTypes.bool,
    showFinal: PropTypes.bool,
    increase: PropTypes.number,
};

Header.defaultProps = {
    showBonus: false,
    showFinal: false,
    increase: 0,
};

export default Header;
