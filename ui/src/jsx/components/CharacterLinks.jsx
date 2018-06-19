import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import { userHasRole } from '../utils.jsx';

export class CharacterLinks extends BaseLinkGroup
{
    constructor(props, context) {
        super(props, context);
    }

    buttonList() {
        const { router } = this.context;
        const {
            character = {}, character_id, current_user: user
        } = this.props;

        if (!user) {
            return {};
        }

        const levelUp = (
            character
            && character.level_up
            && character.level_up.config.length
        );

        return {
            'view': () => ({
                label: 'View',
                link: "/character/show/" + character_id,
                icon: 'eye',
                available: (
                    character_id != undefined
                    && userHasRole(user, ['player', 'dm'])
                ),
            }),
            'raw': () => ({
                label: 'Raw',
                link: "/character/raw/" + character_id,
                icon: 'cogs',
                available: (
                    character_id != undefined
                    && userHasRole(user, 'admin')
                ),
            }),
            'edit': () => ({
                label: levelUp ? 'Level Up' : 'Edit',
                link: "/character/edit/" + character_id,
                icon: levelUp ? 'level-up' : 'pencil',
                className: levelUp ? 'primary' : null,
                available: (
                    character_id != undefined
                    && character.user_id == user.id
                ),
            }),
            'copy': () => ({
                label: 'Copy',
                action: () => {
                    ObjectDataActions.copyObject(
                        "character", character_id, null,
                        (type, id, data) => {
                            router.history.push(
                                '/character/edit/' + data.id
                            );
                        }
                    );
                },
                icon: 'clone',
                available: (
                    character_id != undefined
                    && (
                        character.user_id == user.id
                        || userHasRole(user, ['dm'])
                    )
                ),
            }),
            'pdf': () => ({
                label: 'PDF',
                download: "/character/download/" + character_id,
                icon: 'file-pdf-o',
                available: (
                    character_id != undefined
                    && userHasRole(user, ['player', 'dm'])
                ),
            }),
            'new': () => ({
                label: 'New',
                link: "/character/new",
                icon: 'plus',
                available: (
                    character_id == undefined
                    && userHasRole(user, ['player', 'dm'])
                ),
            }),
            'delete': () => ({
                label: 'Delete',
                action: () => {
                    ObjectDataActions.deleteObject(
                        "character", character_id
                    );
                },
                icon: 'trash-o',
                className: 'bad',
                available: (
                    character_id != undefined
                    && character.user_id == user.id
                ),
            }),
        };
    }
}

CharacterLinks.contextTypes = {
    router: PropTypes.object,
};

CharacterLinks.propTypes = _.assign(
    {}, BaseLinkGroup.propTypes, {
        buttons: PropTypes.arrayOf(
            PropTypes.oneOf([
                'view', 'edit', 'copy', 'raw', 'new', 'pdf', 'delete',
            ])
        ),
        character_id: PropTypes.number,
        current_user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            role: PropTypes.arrayOf(
                PropTypes.oneOf(['player', 'dm', 'admin'])
            ),
        }),
        character: PropTypes.shape({
            user_id: PropTypes.number.isRequired,
            level_up: PropTypes.object,
        }),
    }
);

export default ListDataWrapper(
    ObjectDataWrapper(CharacterLinks, [
        {type: 'character', id: 'character_id'}
    ]),
    ['current_user']
);
