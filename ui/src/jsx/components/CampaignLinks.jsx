import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../components/BaseLinkGroup/index.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import { userHasRole } from '../utils.jsx';


export const CampaignLinks = ({
    id, campaign, currentUser, altStyle, children,
    ...props
}) => {
    if (!currentUser) {
        return null;
    }

    return (
        <BaseLinkGroup {...props}>
            <BaseLinkButton
                name="view"
                label="View"
                icon="eye"
                altStyle={altStyle}
                link={`/campaign/show/${id}`}
                available={(
                    id !== null
                    && (
                        campaign.user_id == currentUser.id
                        || userHasRole(currentUser, 'admin')
                    )
                )}
            />
            <BaseLinkButton
                name="edit"
                label="Edit"
                icon="pencil"
                altStyle={altStyle}
                link={`/campaign/edit/${id}`}
                available={(
                    id !== null
                    && campaign.user_id == currentUser.id
                    && userHasRole(currentUser, 'dm')
                )}
            />
            <BaseLinkButton
                name="new"
                label="New"
                icon="plus"
                altStyle={altStyle}
                link={`/campaign/new`}
                available={(
                    id === null
                    && userHasRole(currentUser, 'dm')
                )}
            />
            {children}
        </BaseLinkGroup>
    );
};

CampaignLinks.propTypes = {
    altStyle: PropTypes.bool,
    id: PropTypes.number,
    campaign: PropTypes.shape({
        user_id: PropTypes.number,
    }),
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        role: PropTypes.arrayOf(
            PropTypes.oneOf(['player', 'dm', 'admin'])
        ),
    }),
};

CampaignLinks.defaultProps = {
    altStyle: false,
    id: null,
    campaign: {},
    currentUser: {},
};

export default ListDataWrapper(
    ObjectDataWrapper(CampaignLinks, [
        {type: 'campaign', id: 'id'}
    ]),
    ['current_user'],
    null,
    { current_user: 'currentUser' }
);
