import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import { userHasRole } from '../utils.jsx';

import ListDataActions from '../actions/ListDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

export class PartyLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const {
            party: {
                user_id,
                member_ids = [],
            } = {},
            party_id,
            hosted_party: hosted,
            current_user: user,
        } = this.props;

        if (!user) {
            return {};
        }

        return {
            'view': () => ({
                label: 'View',
                link: "/party/show/" + party_id,
                icon: 'eye',
                available: (
                    party_id !== undefined
                    && (
                        user_id === user.id
                        || userHasRole(user, ['dm', 'admin'])
                    )
                ),
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/party/edit/" + party_id,
                icon: 'pencil',
                available: (
                    party_id !== undefined
                    && (
                        user_id === user.id
                        || userHasRole(user, 'admin')
                    )
                ),
            }),
            'host': () => (hosted && party_id === hosted.id ? {
                label: 'Stop',
                action: () => {
                    fetch("/party/host", {
                    method: "POST",
                        credentials: 'same-origin',
                        'headers': {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        ListDataActions.fetchItems.completed({
                            hosted_party: data
                        });
                    });
                },
                icon: 'ban',
                className: 'info',
                available: (
                    party_id !== undefined
                    && userHasRole(user, 'dm')
                ),
            } : {
                label: 'Host',
                action: () => {
                    fetch("/party/host/" + party_id, {
                        method: "POST",
                        credentials: 'same-origin',
                        'headers': {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        ListDataActions.fetchItems.completed({
                            hosted_party: data
                        });
                    });
                },
                icon: 'beer',
                available: (
                    party_id !== undefined
                    && userHasRole(user, 'dm')
                ),
            }),
            'new': () => ({
                label: 'New',
                link: "/party/new",
                icon: 'plus',
                available: (
                    party_id === undefined
                    && userHasRole(user, ['dm', 'admin'])
                ),
            }),
            'delete': () => ({
                label: 'Delete',
                action: () => {
                    ObjectDataActions.deleteObject(
                        "party", party_id
                    );
                },
                icon: 'trash-o',
                className: 'bad',
                available: (
                    party_id !== undefined
                    && userHasRole(user, ['dm', 'admin'])
                    && user_id == user.id
                    && !member_ids.length
                ),
            }),
        };
    }
}


PartyLinks.propTypes = _.assign(
    {}, BaseLinkGroup.propTypes, {
        buttons: PropTypes.arrayOf(
            PropTypes.oneOf([
                'view', 'edit', 'new', 'host', 'delete',
            ])
        ),
        party_id: PropTypes.number,
        current_user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            role: PropTypes.arrayOf(
                PropTypes.oneOf(['player', 'dm', 'admin'])
            ),
        }),
        hosted_party: PropTypes.shape({
            id: PropTypes.number.isRequired,
        }),
    }
);

export default ListDataWrapper(
    ObjectDataWrapper(PartyLinks, [
        {type: 'party', id: 'party_id'}
    ]),
    ['current_user', 'hosted_party']
);
