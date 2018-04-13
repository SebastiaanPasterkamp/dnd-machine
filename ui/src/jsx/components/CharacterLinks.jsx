import React from 'react';

import { userHasRole } from '../utils.jsx';

import ObjectDataActions from '../actions/ObjectDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class CharacterLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const {
            character, character_id, current_user: user
        } = this.props;

        const levelUp = (
            character
            && character.level_up
            && character.level_up.config.length
        );

        if (!user) {
            return {};
        }

        return {
            'view': () => ({
                label: 'View',
                link: "/character/show/" + character_id,
                icon: 'eye',
                available: character && userHasRole(user, 'player'),
            }),
            'raw': () => ({
                label: 'Raw',
                link: "/character/raw/" + character_id,
                icon: 'cogs',
                available: character && userHasRole(user, 'admin'),
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/character/edit/" + character_id,
                icon: levelUp ? 'level-up' : 'pencil',
                color: levelUp ? 'primary' : null,
                available: character && (
                    character.user_id == user.id
                    || userHasRole(user, ['admin', 'dm'])
                ),
            }),
            'copy': () => ({
                label: 'Copy',
                link: "/character/copy/" + character_id,
                icon: 'clone',
                available: character && (
                    character.user_id == user.id
                    || userHasRole(user, ['admin', 'dm'])
                ),
            }),
            'download': () => ({
                label: 'PDF',
                download: "/character/download/" + character_id,
                icon: 'file-pdf-o',
                available: character && userHasRole(user, ['player', 'dm']),
            }),
            'new': () => ({
                label: 'New',
                link: "/character/new",
                icon: 'plus',
                available: !character && userHasRole(user, ['player', 'dm']),
            }),
            'delete': () => ({
                label: 'Delete',
                action: () => {
                    ObjectDataActions.deleteObject(
                        "character", character_id
                    );
                },
                icon: 'trash-o',
                color: 'bad',
                available: character && character.user_id == user.id,
            }),
        };
    }
}

CharacterLinks.defaultProps = {
    buttons: ['view', 'edit', 'copy', 'pdf'],
};

export default ListDataWrapper(
    ObjectDataWrapper(CharacterLinks, [
        {type: 'character', id: 'character_id'}
    ]),
    ['current_user']
);
