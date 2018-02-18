import React from 'react';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class WeaponLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
        this.altStyle = true;
    }

    buttonList() {
        const {
            weapon_id
        } = this.props;

        return {
            'view': () => {
                return {
                    label: 'View',
                    link: "/items/weapon/show/" + weapon_id,
                    icon: 'eye',
                };
            },
            'edit': () => {
                return {
                    label: 'Edit',
                    link: "/items/weapon/edit/" + weapon_id,
                    icon: 'pencil',
                };
            },
            'new': () => {
                return {
                    label: 'New',
                    link: "/items/weapon/new",
                    icon: 'plus',
                };
            }
        };
    }

    getAllowed() {
        const {
            weapon_id, current_user
        } = this.props;

        if (current_user == null) {
            return [];
        }

        if (
            _.intersection(
                current_user.role || [],
                ['dm']
            ).length
        ) {
            if (weapon_id == null) {
                return ['new'];
            }
            return ['edit', 'new', 'view'];
        }

        if (
            _.intersection(
                current_user.role || [],
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
    WeaponLinks,
    ['current_user']
);
