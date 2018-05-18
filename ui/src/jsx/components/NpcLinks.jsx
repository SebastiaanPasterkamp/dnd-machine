import React from 'react';
import PropTypes from 'prop-types';

import { userHasRole } from '../utils.jsx';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class NpcLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const { router } = this.context;
        const {
            npc, npc_id, current_user: user
        } = this.props;

        if (!user) {
            return {};
        }

        const available = npc && userHasRole(user, 'dm');

        return {
            'view': () => ({
                label: 'View',
                link: "/npc/show/" + npc_id,
                icon: 'eye',
                available,
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/npc/edit/" + npc_id,
                icon: 'pencil',
                available,
            }),
            'copy': () => ({
                label: 'Copy',
                action: () => {
                    ObjectDataActions.copyObject(
                        "npc", npc_id, null,
                        (type, id, data) => {
                            router.history.push(
                                '/npc/edit/' + data.id
                            );
                        }
                    );
                },
                icon: 'clone',
                available,
            }),
            'new': () => ({
                label: 'New',
                link: "/npc/new",
                icon: 'plus',
                available: !npc && userHasRole(user, 'dm'),
            }),
        };
    }
}

NpcLinks.contextTypes = {
    router: PropTypes.object,
};

NpcLinks.propTypes = {
    npc: PropTypes.object,
    npc_id: PropTypes.number,
    current_user: PropTypes.object,
};

NpcLinks.defaultProps = {
    buttons: ['view', 'edit', 'copy'],
};

export default ListDataWrapper(
    ObjectDataWrapper(NpcLinks, [
        {type: 'npc', id: 'npc_id'}
    ]),
    ['current_user']
);
