import React from 'react';

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
            character, character_id
        } = this.props;

        const levelUp = (
            character
            && character.level_up
            && character.level_up.config.length
        );

        return {
            'view': () => {
                return {
                    label: 'View',
                    link: "/character/show/" + character_id,
                    icon: 'eye',
                };
            },
            'raw': () => {
                return {
                    label: 'Raw',
                    link: "/character/raw/" + character_id,
                    icon: 'cogs',
                };
            },
            'edit': () => {
                if (
                    character
                    && character.level_up
                    && character.level_up.config.length
                ) {
                    return {
                        label: 'Level Up',
                        link: "/character/edit/" + character_id,
                        icon: 'level-up',
                        color: 'primary',
                    };
                }
                return {
                    label: 'Edit',
                    link: "/character/edit/" + character_id,
                    icon: 'pencil',
                };
            },
            'download': () => {
                return {
                    label: 'Download',
                    download: "/character/download/" + character_id,
                    icon: 'file-pdf-o',
                };
            },
            'new': () => {
                return {
                    label: 'New',
                    link: "/character/new",
                    icon: 'plus',
                };
            },
            'delete': () => {
                return {
                    label: 'Delete',
                    action: () => {
                        ObjectDataActions.deleteObject(
                            "character", character_id
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
            current_user, character, character_id
        } = this.props;

        if (!current_user) {
            return [];
        }

        if (!character) {
            if (
                _.intersection(
                    current_user.role || [],
                    ['dm', 'player']
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
            return ['download', 'delete', 'raw', 'new', 'view'];
        }

        if (
            character
            && character.user_id == current_user.id
        ) {
            return ['download', 'delete', 'edit', 'new', 'view'];
        }

        if (
            _.intersection(
                current_user.role || [],
                ['dm']
            ).length
        ) {
            return ['download', 'edit', 'new', 'view'];
        }

        if (
            _.intersection(
                current_user.role || [],
                ['player']
            ).length
        ) {
            return ['download', 'new', 'view'];
        }

        return [];
    }
}

CharacterLinks.defaultProps = {
    buttons: ['view', 'edit', 'pdf'],
};

export default ListDataWrapper(
    ObjectDataWrapper(CharacterLinks, [
        {type: 'character', id: 'character_id'}
    ]),
    ['current_user']
);
