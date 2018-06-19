import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import { userHasRole } from '../utils.jsx';

export class UserLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const {
            user_id, current_user,
        } = this.props;

        if (!current_user) {
            return {};
        }

        return {
            'view': () => ({
                label: 'View',
                link: "/user/show/" + user_id,
                icon: 'eye',
                available: (
                    user_id != undefined
                    && (
                        user_id == current_user.id
                        || userHasRole(current_user, ['admin'])
                    )
                ),
            }),
            'raw': () => ({
                label: 'Raw',
                link: "/user/raw/" + user_id,
                icon: 'cogs',
                available: (
                    user_id != undefined
                    && userHasRole(current_user, ['admin'])
                ),
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/user/edit/" + user_id,
                icon: 'pencil',
                available: (
                    user_id != undefined
                    && (
                        user_id == current_user.id
                        || userHasRole(current_user, ['admin'])
                    )
                ),
            }),
            'new': () => ({
                label: 'New',
                link: "/user/new",
                icon: 'plus',
                available: (
                    user_id == undefined
                    && userHasRole(current_user, ['admin'])
                ),
            }),
            'delete': () => ({
                label: 'Delete',
                action: () => {
                    ObjectDataActions.deleteObject(
                        "user", user_id
                    );
                },
                icon: 'trash-o',
                color: 'bad',
                available: (
                    user_id != undefined
                    && (
                        user_id != current_user.id
                        && userHasRole(current_user, ['admin'])
                    )
                ),
            }),
        };
    }
};

UserLinks.propTypes = _.assign(
    {}, BaseLinkGroup.propTypes, {
        buttons: PropTypes.arrayOf(
            PropTypes.oneOf([
                'view', 'raw', 'edit', 'new', 'delete',
            ])
        ),
        user_id: PropTypes.number,
        current_user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            role: PropTypes.arrayOf(
                PropTypes.oneOf(['player', 'dm', 'admin'])
            ),
        }),
    }
);

export default ListDataWrapper(
    UserLinks,
    ['current_user']
);
