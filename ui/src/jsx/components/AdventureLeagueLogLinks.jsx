import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import { userHasRole } from '../utils.jsx';

export class AdventureLeagueLogLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const {
            logId, adventureleague = {}, current_user: user,
            characterId,
        } = this.props;

        if (!user) {
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
                        adventureleague.user_id == user.id
                        || userHasRole(user, 'admin')
                    )
                ),
            }),
            'raw': () => ({
                label: 'Raw',
                link: "/log/adventureleague/raw/" + logId,
                icon: 'cogs',
                available: (
                    !_.isNil(logId)
                    && userHasRole(user, 'admin')
                ),
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/log/adventureleague/edit/" + logId,
                icon: 'pencil',
                available: (
                    !_.isNil(logId)
                    && adventureleague.user_id == user.id
                ),
            }),
            'assign': () => ({
                label: 'Assign',
                icon: 'user-o',
                link: "/log/adventureleague/edit/" + logId + "#assign",
                className: 'info',
                available: (
                    !_.isNil(logId)
                    && adventureleague.user_id == user.id
                    && !adventureleague.character_id
                ),
            }),
            'consume': () => ({
                label: 'Consume',
                download: "/log/adventureleague/consume/" + logId,
                icon: 'thumb-tack',
                className: 'warning',
                available: (
                    !_.isNil(logId)
                    && adventureleague.user_id == user.id
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
                    _.isNil(logId)
                    && userHasRole(user, 'player')
                    && user.dci
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
                className: 'bad',
                available: (
                    !_.isNil(logId)
                    && adventureleague.user_id == user.id
                    && !adventureleague.consumed
                ),
            }),
        };
    }
}

AdventureLeagueLogLinks.propTypes = _.assign(
    {}, BaseLinkGroup.propTypes, {
        buttons: PropTypes.arrayOf(
            PropTypes.oneOf([
                'view', 'edit', 'assign', 'consume', 'delete',
                'raw', 'new',
            ])
        ),
        logId: PropTypes.number,
        current_user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            dci: PropTypes.string,
            role: PropTypes.arrayOf(
                PropTypes.oneOf(['player', 'dm', 'admin'])
            ),
        }),
        adventureleague: PropTypes.shape({
            user_id: PropTypes.number.isRequired,
            consumed: PropTypes.oneOf([0, 1]).isRequired,
            character_id: PropTypes.number,
        }),
        characterId: PropTypes.number,
    }
);

export default ListDataWrapper(
    ObjectDataWrapper(AdventureLeagueLogLinks, [
        {group: 'log', type: 'adventureleague', id: 'logId'}
    ]),
    ['current_user']
);
