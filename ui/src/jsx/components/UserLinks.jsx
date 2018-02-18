import React from 'react';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class UserLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const {
            user, user_id
        } = this.props;

        return {
            'view': () => {
                return {
                    label: 'View',
                    link: "/user/show/" + user_id,
                    icon: 'eye',
                };
            },
            'raw': () => {
                return {
                    label: 'Raw',
                    link: "/user/raw/" + user_id,
                    icon: 'cogs',
                };
            },
            'edit': () => {
                return {
                    label: 'Edit',
                    link: "/user/edit/" + user_id,
                    icon: 'pencil',
                };
            },
            'new': () => {
                return {
                    label: 'New',
                    link: "/user/new",
                    icon: 'plus',
                };
            },
            'delete': () => {
                return {
                    label: 'Delete',
                    action: () => {
                        ObjectDataActions.deleteObject(
                            "user", user_id
                        );
                    },
                    icon: 'trash-o',
                    color: 'bad'
                };
            },
        };
    }

    getAllowed() {
        const {
            current_user, user, user_id
        } = this.props;

        if (!current_user) {
            return [];
        }

        if (!user) {
            if (
                _.intersection(
                    current_user.role || [],
                    ['admin']
                ).length
            ) {
                return ['new'];
            }
            return [];
        }

        if (
            _.intersection(
                current_user.role || [],
                ['admin']
            ).length
        ) {
            return ['delete', 'edit', 'new', 'view'];
        }

        if (
            user
            && user.id == current_user.id
        ) {
            return ['delete', 'edit', 'view'];
        }

        return [];
    }
}

UserLinks.defaultProps = {
    buttons: ['view', 'edit'],
};

export default ListDataWrapper(
    ObjectDataWrapper(UserLinks, [
        {type: 'user', id: 'user_id'}
    ]),
    ['current_user']
);
