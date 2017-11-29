import React from 'react';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class ArmorLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
        this.buttonList = {
            'view': () => {
                return {
                    label: 'View',
                    link: "/items/armor/show/" + this.props.armor.id,
                    icon: 'eye',
                };
            },
            'edit': () => {
                return {
                    label: 'Edit',
                    link: "/items/armor/edit/" + this.props.armor.id,
                    icon: 'pencil',
                };
            },
            'new': () => {
                return {
                    label: 'New',
                    link: "/items/armor/new",
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
            if (this.props.armor == null) {
                return ['new'];
            }
            return ['edit', 'new', 'view'];
        }
        if (
            _.intersection(
                this.props.current_user.role || [],
                'player'
            ).length
        ) {
            return ['view'];
        }
        return [];
    }
}

ArmorLinks.defaultProps = {
    buttons: ['view', 'edit'],
};

export default ListDataWrapper(
    ObjectDataWrapper(ArmorLinks, [
        {group: 'items', type: 'armor', id: 'armor_id'}
    ]),
    ['current_user']
);