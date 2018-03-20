import React from 'react';

import ListDataActions from '../actions/ListDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class PartyLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    userHasRole(role) {
        const { current_user = {} } = this.props;
        const roles = _.isArray(role) ? role : [role];

        return (
            _.intersection(
                current_user.role || [],
                roles
            ).length > 0
        );
    }

    buttonList() {
        const {
            party = {}, hosted_party, current_user = {}
        } = this.props;

        if (!current_user) {
            return [];
        }

        if (!this.userHasRole('dm')) {
            return [];
        }

        return {
            'view': () => ({
                label: 'View',
                link: "/party/show/" + party.id,
                icon: 'eye',
                available: !_.isNil(party.id),
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/party/edit/" + party.id,
                icon: 'pencil',
                available: (
                    !_.isNil(party.id)
                    && (
                        party.user_id == current_user.id
                        || this.userHasRole(['admin'])
                    )
                ),
            }),
            'host': () => (hosted_party && party.id == hosted_party.id ? {
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
                available: !_.isNil(party.id),
            } : {
                label: 'Host',
                action: () => {
                    fetch("/party/host/" + party.id, {
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
                available: !_.isNil(party.id),
            }),
            'new': () => ({
                label: 'New',
                link: "/party/new",
                icon: 'plus',
                available: _.isNil(party.id),
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
