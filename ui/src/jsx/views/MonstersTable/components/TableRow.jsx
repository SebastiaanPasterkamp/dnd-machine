import React from 'react';
import PropTypes from 'prop-types';

import MonsterLabel from '../../../components/MonsterLabel';
import MonsterLinks from '../../../components/MonsterLinks';

const TableRow = function(props) {
    const { id } = props;
    return (
        <tr data-name={id}>
            <th>
                <MonsterLabel
                    monster={props}
                />
                <MonsterLinks
                    altStyle={true}
                    id={id}
                />
            </th>
            <td>
                <MonsterLabel
                    monster={props}
                    showName={false}
                    showType={true}
                />
            </td>
            <td>
                <MonsterLabel
                    monster={props}
                    showName={false}
                    showRating={true}
                />
            </td>
            <td>
                <MonsterLabel
                    monster={props}
                    showName={false}
                    showCampaign={true}
                />
            </td>
        </tr>
    );
};

TableRow.propTypes = {
    id: PropTypes.number.isRequired,
    campaign_id: PropTypes.number,
    name: PropTypes.string.isRequired,
    challenge_rating: PropTypes.number.isRequired,
    xp: PropTypes.number.isRequired,
};

TableRow.defaultProps = {
    campaign_id: null,
};

export default TableRow;
