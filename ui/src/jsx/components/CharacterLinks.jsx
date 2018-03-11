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
            'copy': () => {
                return {
                    label: 'Copy',
                    link: "/character/copy/" + character_id,
                    icon: 'clone',
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

        const userHasRole = (role) => {
            const roles = _.isArray(role) ? role : [role];
            return (
                _.intersection(
                    current_user.role || [],
                    roles
                ).length > 0
            );
        };

        if (!character) {
            if (userHasRole(['dm', 'player'])) {
                return ['new'];
            }
            return [];
        }

        if (userHasRole(['admin'])) {
            return [
                'download', 'delete', 'copy', 'raw', 'new', 'view',
            ];
        }

        if (
            character
            && character.user_id == current_user.id
        ) {
            return [
                'download', 'delete', 'copy', 'edit', 'new', 'view',
            ];
        }

        if (userHasRole(['dm'])) {
            return ['download', 'edit', 'copy', 'new', 'view'];
        }

        if (userHasRole(['player'])) {
            return ['download', 'new', 'view'];
        }

        return [];
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
