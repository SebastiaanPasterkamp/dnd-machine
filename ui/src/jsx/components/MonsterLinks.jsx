import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import { userHasRole } from '../utils.jsx';

export class MonsterLinks extends BaseLinkGroup
{
    constructor(props, context) {
        super(props, context);
    }

    buttonList() {
        const { router } = this.context;
        const {
            monster_id, current_user: user,
        } = this.props;

        if (!user) {
            return {};
        }

        const available = (
            monster_id != undefined
            && userHasRole(user, 'dm')
        );

        return {
            'view': () => ({
                label: 'View',
                link: "/monster/show/" + monster_id,
                icon: 'eye',
                available,
            }),
            'raw': () => ({
                label: 'Raw',
                link: "/monster/raw/" + monster_id,
                icon: 'cogs',
                available: (
                    monster_id != undefined
                    && userHasRole(user, 'admin')
                ),
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
                available: (
                    monster_id == undefined
                    && userHasRole(user, 'dm')
                ),
            }),
        };
    }
};

MonsterLinks.contextTypes = {
    router: PropTypes.object,
};

MonsterLinks.propTypes = _.assign(
    {}, BaseLinkGroup.propTypes, {
        buttons: PropTypes.arrayOf(
            PropTypes.oneOf([
                'view', 'edit', 'copy', 'raw', 'new',
            ])
        ),
        monster_id: PropTypes.number,
        current_user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            role: PropTypes.arrayOf(
                PropTypes.oneOf(['player', 'dm', 'admin'])
            ),
        }),
    }
);

export default ListDataWrapper(
    MonsterLinks,
    ['current_user']
);
