import React from 'react';

import { userHasRole } from '../utils.jsx';

import ListDataActions from '../actions/ListDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class CampaignLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const {
            campaign, campaign_id, current_user: user
        } = this.props;

        if (!user) {
            return {};
        }

        return {
            'view': () => ({
                label: 'View',
                link: "/campaign/show/" + campaign_id,
                icon: 'eye',
                available: campaign && (
                    campaign.user_id == user.id
                    || userHasRole(user, 'admin')
                ),
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/campaign/edit/" + campaign_id,
                icon: 'pencil',
                available: campaign && (
                    campaign.user_id == user.id
                    || userHasRole(user, 'admin')
                ),
            }),
            'new': () => ({
                label: 'New',
                link: "/campaign/new",
                icon: 'plus',
                available: !campaign && (
                    userHasRole(user, 'dm')
                ),
            }),
        };
    }
};

CampaignLinks.defaultProps = {
    buttons: ['view', 'edit'],
};

export default ListDataWrapper(
    ObjectDataWrapper(CampaignLinks, [
        {type: 'campaign', id: 'campaign_id'}
    ]),
    ['current_user']
);
