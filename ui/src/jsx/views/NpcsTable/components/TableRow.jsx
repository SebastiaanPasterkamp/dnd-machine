import React from 'react';
import PropTypes from 'prop-types';

import NpcLinks from '../../../components/NpcLinks';
import CampaignLabel from '../../../components/CampaignLabel';

const TableRow = function({
    id, campaign_id, name, race, class: _class, alignment, location, organization,
}) {
    return (
        <tr data-name={id}>
            <th>
                {name}
                <NpcLinks
                    altStyle={true}
                    id={id}
                />

            </th>
            <td>{race}</td>
            <td>{_class}</td>
            <td>{alignment}</td>
            <td>{location}</td>
            <td>{organization}</td>
            <td>{campaign_id
                ? <CampaignLabel id={campaign_id} />
                : null
            }</td>
        </tr>
    );
};

TableRow.propTypes = {
    id: PropTypes.number.isRequired,
    campaign_id: PropTypes.number,
    name: PropTypes.string.isRequired,
    race: PropTypes.string,
    class: PropTypes.string,
    alignment: PropTypes.string,
    location: PropTypes.string,
    organization: PropTypes.string,
};

TableRow.defaultProps = {
    campaign_id: null,
};

export default TableRow;
