import React from 'react';
import PropTypes from 'prop-types';

import { userHasRole } from '../utils.jsx';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class MonsterLinks extends BaseLinkGroup
{
    constructor(props, context) {
        super(props, context);
    }

    buttonList() {
        const { router } = this.context;
        const {
            monster, monster_id, current_user: user,
        } = this.props;

        if (!user) {
            return {};
        }

        const available = monster && userHasRole(user, 'dm');

        return {
            'view': () => ({
                label: 'View',
                link: "/monster/show/" + monster_id,
                icon: 'eye',
                available,
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/monster/edit/" + monster_id,
                icon: 'pencil',
                available,
            }),
            'copy': () => ({
                label: 'Copy',
                action: () => {
                    ObjectDataActions.copyObject(
                        "monster", monster_id, null,
                        (type, id, data) => {
                            router.history.push(
                                '/monster/edit/' + data.id
                            );
                        }
                    );
                },
                icon: 'clone',
                available,
            }),
            'new': () => ({
                label: 'New',
                link: "/monster/new",
                icon: 'plus',
                available: !monster_id && userHasRole(user, 'dm')
            }),
        };
    }
};

MonsterLinks.contextTypes = {
    router: PropTypes.object,
};

MonsterLinks.propTypes = {
    monster: PropTypes.object,
    monster_id: PropTypes.number,
    current_user: PropTypes.object,
};

MonsterLinks.defaultProps = {
    buttons: ['view', 'edit', 'copy'],
};

export default ListDataWrapper(
    ObjectDataWrapper(MonsterLinks, [
        {type: 'monster', id: 'monster_id'}
    ]),
    ['current_user']
);
