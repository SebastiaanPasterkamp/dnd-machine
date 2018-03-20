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
    }

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
            'assign': () => ({
                label: 'Assign',
                icon: 'user-o',
                link: "/log/adventureleague/edit/" + logId + "#assign",
                color: 'info',
                available: (
                    !_.isNil(logId)
                    && adventureleague.user_id == current_user.id
                    && !adventureleague.character_id
                ),
            }),
            'consume': () => ({
                label: 'Consume',
                download: "/log/adventureleague/consume/" + logId,
                icon: 'thumb-tack',
                color: 'warning',
                available: (
                    !_.isNil(logId)
                    && adventureleague.user_id == current_user.id
                    && adventureleague.character_id
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
                    && !logId
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
}

AdventureLeagueLogLinks.defaultProps = {
    buttons: [
        'view', 'edit', 'assign', 'consume', 'delete', 'raw', 'new'
    ],
};

export default ListDataWrapper(
    ObjectDataWrapper(AdventureLeagueLogLinks, [
        {group: 'log', type: 'adventureleague', id: 'logId'}
    ]),
    ['current_user']
);
