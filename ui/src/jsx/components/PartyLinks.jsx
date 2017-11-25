import React from 'react';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ItemStore from '../mixins/ItemStore.jsx';
import ObjectLoader from '../mixins/ObjectLoader.jsx';

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
        if (
            this.props.party == null
            || this.props.current_user == null
        ) {
            return [];
        }
        if (
            _.indexOf(
                this.props.current_user.role || [],
                'dm'
            ) < 0
        ) {
            return [];
        }
        if (this.props.party.user_id != this.props.current_user.id) {
            return [];
        }
        return ['host', 'edit', 'new', 'view'];
    }
}

PartyLinks.defaultProps = {
    buttons: ['view', 'edit', 'host'],
};

export default ItemStore(
        ObjectLoader(PartyLinks, [
        {type: 'party', id: 'party_id'}
    ]),
    ['current_user']
);