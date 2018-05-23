import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import { userHasRole } from '../utils.jsx';

export class CampaignLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const {
            campaign = {}, campaign_id, current_user: user
        } = this.props;

        if (!user) {
            return {};
        }

        return {
            'view': () => ({
                label: 'View',
                link: "/campaign/show/" + campaign_id,
                icon: 'eye',
                available: (
                    campaign_id
                    && (
                        campaign.user_id == user.id
                        || userHasRole(user, 'admin')
                    )
                ),
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/campaign/edit/" + campaign_id,
                icon: 'pencil',
                available: (
                    campaign_id
                    && campaign.user_id == user.id
                    && userHasRole(user, 'dm')
                ),
            }),
            'new': () => ({
                label: 'New',
                link: "/campaign/new",
                icon: 'plus',
                available: (
                    !campaign_id
                    && userHasRole(user, 'dm')
                ),
            }),
        };
    }
};


CampaignLinks.propTypes = _.assign(
    {}, BaseLinkGroup.propTypes, {
        buttons: PropTypes.arrayOf(
            PropTypes.oneOf([
                'view', 'edit', 'new',
            ])
        ),
        campaign_id: PropTypes.number,
        current_user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            role: PropTypes.arrayOf(
                PropTypes.oneOf(['player', 'dm', 'admin'])
            ),
        }),
        campaign: PropTypes.shape({
            user_id: PropTypes.number.isRequired,
        }),
    }
);

export default ListDataWrapper(
    ObjectDataWrapper(CampaignLinks, [
        {type: 'campaign', id: 'campaign_id'}
    ]),
    ['current_user']
);
