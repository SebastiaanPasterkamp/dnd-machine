import React from 'react';

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
        return {
            'view': () => {
                return {
                    label: 'View',
                    link: "/campaign/show/" + this.props.campaign.id,
                    icon: 'eye',
                };
            },
            'edit': () => {
                return {
                    label: 'Edit',
                    link: "/campaign/edit/" + this.props.campaign.id,
                    icon: 'pencil',
                };
            },
            'new': () => {
                return {
                    label: 'New',
                    link: "/campaign/new",
                    icon: 'plus',
                };
            }
        };
    }

    getAllowed() {
        if (this.props.current_user == null) {
            return [];
        }
        if (
            !_.intersection(
                this.props.current_user.role || [],
                ['dm', 'admin']
            ).length
        ) {
            return [];
        }
        if (this.props.campaign == null) {
            return ['new'];
        }
        if (this.props.campaign.user_id == this.props.current_user.id) {
            return ['edit', 'new', 'view'];
        }
        return ['view', 'new'];
    }
}

CampaignLinks.defaultProps = {
    buttons: ['view', 'edit'],
};

export default ListDataWrapper(
    ObjectDataWrapper(CampaignLinks, [
        {type: 'campaign', id: 'campaign_id'}
    ]),
    ['current_user']
);
