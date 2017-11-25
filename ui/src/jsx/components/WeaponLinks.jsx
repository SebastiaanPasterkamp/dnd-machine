import React from 'react';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ItemStore from '../mixins/ItemStore.jsx';
import ObjectLoader from '../mixins/ObjectLoader.jsx';

class WeaponLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
        this.buttonList = {
            'view': () => {
                return {
                    label: 'View',
                    link: "/items/weapons/show/" + this.props.weapons.id,
                    icon: 'eye',
                };
            },
            'edit': () => {
                return {
                    label: 'Edit',
                    link: "/items/weapons/edit/" + this.props.weapons.id,
                    icon: 'pencil',
                };
            },
            'new': () => {
                return {
                    label: 'New',
                    link: "/items/weapons/new",
                    icon: 'plus',
                };
            }
        };
    }

    getAllowed() {
        if (
            this.props.weapons == null
            || this.props.current_user == null
        ) {
            return [];
        }
        if (
            _.indexOf(
                this.props.current_user.role || [],
                'dm'
            ) >= 0
        ) {
            return ['edit', 'new', 'view'];
        }
        if (
            _.indexOf(
                this.props.current_user.role || [],
                'player'
            ) >= 0
        ) {
            return ['view'];
        }
        return [];
    }
}

WeaponLinks.defaultProps = {
    buttons: ['view', 'edit'],
};

export default ItemStore(
        ObjectLoader(WeaponLinks, [
        {group: 'items', type: 'weapons', id: 'weapon_id'}
    ]),
    ['current_user']
);