import React from 'react';

import ListDataActions from '../actions/ListDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class NpcLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const { npc = {} } = this.props;

        return {
            'view': () => {
                return {
                    label: 'View',
                    link: "/npc/show/" + npc.id,
                    icon: 'eye',
                };
            },
            'edit': () => {
                return {
                    label: 'Edit',
                    link: "/npc/edit/" + npc.id,
                    icon: 'pencil',
                };
            },
            'new': () => {
                return {
                    label: 'New',
                    link: "/npc/new",
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
            if (this.props.npc == null) {
                return ['new'];
            }
            return ['edit', 'new', 'view'];
        }
        return [];
    }
}

NpcLinks.defaultProps = {
    buttons: ['view', 'edit'],
};

export default ListDataWrapper(
    ObjectDataWrapper(NpcLinks, [
        {type: 'npc', id: 'npc_id'}
    ]),
    ['current_user']
);
