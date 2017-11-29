import React from 'react';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class PartyLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
        this.buttonList = {
            'view': () => {
                return {
                    label: 'View',
                    link: "/party/show/" + this.props.party.id,
                    icon: 'eye',
                };
            },
            'edit': () => {
                return {
                    label: 'Edit',
                    link: "/party/edit/" + this.props.party.id,
                    icon: 'pencil',
                };
            },
            'host': () => {
                return {
                    label: 'Host',
                    link: "/party/host/" + this.props.party.id,
                    icon: 'beer',
                };
            },
            'new': () => {
                return {
                    label: 'New',
                    link: "/party/new",
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
            _.intersection(
                this.props.current_user.role || [],
                ['dm']
            ).length
        ) {
            if (this.props.party == null) {
                return ['new'];
            }
            return ['host', 'edit', 'new', 'view'];
        }
        return [];
    }
}

PartyLinks.defaultProps = {
    buttons: ['view', 'edit', 'host'],
};

export default ListDataWrapper(
    ObjectDataWrapper(PartyLinks, [
        {type: 'party', id: 'party_id'}
    ]),
    ['current_user']
);