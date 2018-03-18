import React from 'react';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class AdventureLeagueLogLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    userHasRole(role) {
        const { current_user = {} } = this.props;
        const roles = _.isArray(role) ? role : [role];

        return (
            _.intersection(
                current_user.role || [],
                roles
            ).length > 0
        );
    };

    buttonList() {
        const {
            logId, adventureleague = {}, current_user, characterId,
        } = this.props;

        if (!current_user) {
            return {};
        }

        return {
            'view': () => ({
                label: 'View',
                link: "/log/adventureleague/show/" + logId,
                icon: 'eye',
                available: (
                    !_.isNil(logId)
                    && (
                        adventureleague.user_id == current_user.id
                        || this.userHasRole(['admin'])
                    )
                ),
            }),
            'raw': () => ({
                label: 'Raw',
                link: "/log/adventureleague/raw/" + logId,
                icon: 'cogs',
                available: (
                    !_.isNil(logId)
                    && this.userHasRole(['admin'])
                ),
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/log/adventureleague/edit/" + logId,
                icon: 'pencil',
                available: (
                    !_.isNil(logId)
                    && adventureleague.user_id == current_user.id
                ),
            }),
            'consume': () => ({
                label: 'Consume',
                download: "/log/adventureleague/consume/" + logId,
                icon: 'shopping-basket',
                color: 'warning',
                available: (
                    !_.isNil(logId)
                    && adventureleague.user_id == current_user.id
                    && !adventureleague.consumed
                ),
            }),
            'new': () => ({
                label: 'New',
                link: characterId
                    ? "/log/adventureleague/new/" + characterId
                    : "/log/adventureleague/new",
                icon: 'plus',
                available: (
                    this.userHasRole(['player'])
                    && current_user.dci
                ),
            }),
            'delete': () => ({
                label: 'Delete',
                action: () => {
                    ObjectDataActions.deleteObject(
                        "adventureleague", logId, "log"
                    );
                },
                icon: 'trash-o',
                color: 'bad',
                available: (
                    !_.isNil(logId)
                    && adventureleague.user_id == current_user.id
                    && !adventureleague.consumed
                ),
            }),
        };
    }

    getAllowed() {
        const {
            current_user, adventureleague, logId
        } = this.props;

        if (!current_user) {
            return [];
        }

        const userHasRole = (role) => {
            const roles = _.isArray(role) ? role : [role];
            return (
                _.intersection(
                    current_user.role || [],
                    roles
                ).length > 0
            );
        };

        if (userHasRole(['admin'])) {
            if (adventureleague) {
                return [ 'raw', 'view', 'new' ];
            }
            return [ 'new' ];
        }

        if (!current_user.dci) {
            return [];
        }

        if (
            adventureleague
            && adventureleague.user_id == current_user.id
        ) {
            return [ 'delete', 'copy', 'edit', 'view', 'consume', ];
        }

        if (userHasRole(['player'])) {
            return [ 'new' ];
        }

        return [];
    }
}

AdventureLeagueLogLinks.defaultProps = {
    buttons: ['view', 'edit', 'consume'],
};

export default ListDataWrapper(
    ObjectDataWrapper(AdventureLeagueLogLinks, [
        {group: 'log', type: 'adventureleague', id: 'logId'}
    ]),
    ['current_user']
);
