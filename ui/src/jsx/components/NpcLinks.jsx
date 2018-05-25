import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import { userHasRole } from '../utils.jsx';

export class NpcLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const { router } = this.context;
        const {
            npc_id, current_user: user
        } = this.props;

        if (!user) {
            return {};
        }

        const available = (
            npc_id
            && userHasRole(user, 'dm')
        );

        return {
            'view': () => ({
                label: 'View',
                link: "/npc/show/" + npc_id,
                icon: 'eye',
                available,
            }),
            'raw': () => ({
                label: 'Raw',
                link: "/npc/raw/" + npc_id,
                icon: 'cogs',
                available: (
                    npc_id
                    && userHasRole(user, 'admin')
                ),
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
                available: (
                    !npc_id
                    && userHasRole(user, 'dm')
                ),
            }),
        };
    }
}

NpcLinks.contextTypes = {
    router: PropTypes.object,
};

NpcLinks.propTypes = _.assign(
    {}, BaseLinkGroup.propTypes, {
        buttons: PropTypes.arrayOf(
            PropTypes.oneOf([
                'view', 'edit', 'copy', 'raw', 'new',
            ])
        ),
        npc_id: PropTypes.number,
        current_user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            role: PropTypes.arrayOf(
                PropTypes.oneOf(['player', 'dm', 'admin'])
            ),
        }),
    }
);

export default ListDataWrapper(
    NpcLinks,
    ['current_user']
);
