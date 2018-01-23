import React from 'react';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class WeaponLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        return {
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
        this.altStyle = true;
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
            if (this.props.weapons == null) {
                return ['new'];
            }
            return ['edit', 'new', 'view'];
        }
        if (
            _.intersection(
                this.props.current_user.role || [],
                ['player']
            ).length
        ) {
            return ['view'];
        }
        return [];
    }
}

WeaponLinks.defaultProps = {
    buttons: ['view', 'edit'],
};

export default ListDataWrapper(
    ObjectDataWrapper(WeaponLinks, [
        {group: 'items', type: 'weapons', id: 'weapon_id'}
    ]),
    ['current_user']
);
