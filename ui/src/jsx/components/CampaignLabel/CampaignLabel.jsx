import React from 'react';
import PropTypes from 'prop-types';
import {
    assign,
} from 'lodash/fp';

// import './sass/_campaign-label';

import ListDataWrapper from '../../hocs/ListDataWrapper';
import ObjectDataWrapper from '../../hocs/ObjectDataWrapper';

import ToolTip from '../ToolTip';

export function CampaignLabel(props) {
    const {
        showTooltip,
        campaign: {
            name,
            description,
        },
    } = props;
    return (
        <div className="campaign-label inline">
            {showTooltip
                ? <ToolTip content={description}>
                    {name}
                </ToolTip>
                : name
            }
        </div>
    );
};

CampaignLabel.propTypes = {
    id: PropTypes.number.isRequired,
    showTooltip: PropTypes.bool,
    campaign: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        user_id: PropTypes.number,
    }),
};

CampaignLabel.defaultProps = {
    showTooltip: false,
    campaign: {},
};

export default ObjectDataWrapper(
    CampaignLabel,
    [{type: 'campaign', id: 'id'}]
);
