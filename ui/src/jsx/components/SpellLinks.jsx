import React from 'react';

import ListDataActions from '../actions/ListDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class SpellLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const {
            spell_id
        } = this.props;

        return {
            'view': () => {
                return {
                    label: 'View',
                    link: "/items/spell/show/" + spell_id,
                    icon: 'eye',
                };
            },
            'edit': () => {
                return {
                    label: 'Edit',
                    link: "/items/spell/edit/" + spell_id,
                    icon: 'pencil',
                };
            },
            'new': () => {
                return {
                    label: 'New',
                    link: "/items/spell/new",
                    icon: 'plus',
                };
            }
        };
    }

    getAllowed() {
        const {
            spell_id, current_user
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

        return ['view'];
    }
}

SpellLinks.defaultProps = {
    buttons: ['view', 'edit'],
};

export default ListDataWrapper(
    SpellLinks,
    ['current_user']
);
