import React from 'react';

import { userHasRole } from '../utils.jsx';

import ListDataActions from '../actions/ListDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class PartyLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const {
            party, party_id, hosted_party, current_user: user
        } = this.props;

        if (!user) {
            return {};
        }

        return {
            'view': () => ({
                label: 'View',
                link: "/party/show/" + party_id,
                icon: 'eye',
                available: party && (
                    party.user_id == user.id
                    || userHasRole(user, ['dm', 'admin'])
                ),
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/party/edit/" + party_id,
                icon: 'pencil',
                available: party && (
                    party.user_id == user.id
                    || userHasRole(user, 'admin')
                ),
            }),
            'host': () => (hosted_party && party_id == hosted_party_id ? {
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
                available: party && (
                    userHasRole(user, 'dm')
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
                available: party && (
                    userHasRole(user, 'dm')
                ),
            }),
            'new': () => ({
                label: 'New',
                link: "/party/new",
                icon: 'plus',
                available: !party && (
                    userHasRole(user, ['dm', 'admin'])
                ),
            })
        };
    }
}

PartyLinks.defaultProps = {
    buttons: ['view', 'edit', 'host', 'new'],
};

export default ListDataWrapper(
    ObjectDataWrapper(PartyLinks, [
        {type: 'party', id: 'party_id'}
    ]),
    ['current_user', 'hosted_party']
);
