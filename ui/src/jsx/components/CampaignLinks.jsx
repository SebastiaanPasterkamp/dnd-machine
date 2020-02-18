import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../components/BaseLinkGroup/index.jsx';
import ListDataActions from '../actions/ListDataActions.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import { userHasRole } from '../utils.jsx';


export class CampaignLinks extends React.Component
{
    constructor(props) {
        super(props);
        this.onSetCurrent = this.onSetCurrent.bind(this);
        this.onUnsetCurrent = this.onUnsetCurrent.bind(this);
    }

    onSetCurrent() {
        const { id } = this.props;
        fetch(`/campaign/current/${id}`, {
            method: "POST",
            credentials: 'same-origin',
            'headers': {
                'Accept': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            ListDataActions.fetchItems.completed({
                current_campaign: data,
            });
        });
    }

    onUnsetCurrent() {
        fetch("/campaign/current", {
            method: "POST",
            credentials: 'same-origin',
            'headers': {
                'Accept': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            ListDataActions.fetchItems.completed({
                current_campaign: data,
            });
        });
    }

    render() {
        const {
            id,
            campaign,
            currentCampaign,
            currentUser,
            altStyle,
            children,
            ...props
        } = this.props;

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
                    name="open"
                    label="Activate"
                    icon="folder-open-o"
                    className="info"
                    altStyle={altStyle}
                    action={this.onSetCurrent}
                    available={(
                        id !== null
                        && (
                            !currentCampaign
                            || currentCampaign.id !== id
                        )
                        && userHasRole(currentUser, 'dm')
                    )}
                />
                <BaseLinkButton
                    name="close"
                    label="Deactivate"
                    icon="folder-o"
                    className="warning"
                    altStyle={altStyle}
                    action={this.onUnsetCurrent}
                    available={(
                        id !== null
                        && currentCampaign
                        && currentCampaign.id === id
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
    }
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
    currentCampaign: PropTypes.shape({
        id: PropTypes.number,
    }),
};

CampaignLinks.defaultProps = {
    altStyle: false,
    id: null,
    campaign: {},
    currentUser: {},
    currentCampaign: {},
};

export default ListDataWrapper(
    ObjectDataWrapper(CampaignLinks, [
        {type: 'campaign', id: 'id'}
    ]),
    ['current_user', 'current_campaign'],
    null,
    {
        current_user: 'currentUser',
        current_campaign: 'currentCampaign',
    }
);
