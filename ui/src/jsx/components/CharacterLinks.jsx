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
        const levelUp = this.props.character
            && this.props.character.level_up.config.length  > 0;

        return {
            'view': () => {
                return {
                    label: 'View',
                    link: "/character/show/" + this.props.character.id,
                    icon: 'eye',
                };
            },
            'raw': () => {
                return {
                    label: 'Raw',
                    link: "/character/raw/" + this.props.character.id,
                    icon: 'cogs',
                };
            },
            'edit': () => {
                return {
                    label: levelUp ? 'Level Up' : 'Edit',
                    link: "/character/edit/" + this.props.character.id,
                    icon: levelUp ? 'level-up' : 'pencil',
                    color: levelUp ? 'primary' : null,
                };
            },
            'download': () => {
                return {
                    label: 'Download',
                    download: "/character/download/" + this.props.character.id,
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
                            "character", this.props.character.id
                        );
                    },
                    icon: 'trash-o',
                    color: 'bad'
                };
            },
        };
    }

    getAllowed() {
        if (this.props.current_user == null) {
            return [];
        }
        if (this.props.character == null) {
            if (
                _.intersection(
                    this.props.current_user.role || [],
                    ['dm', 'player']
                ).length
            ) {
                return ['new'];
            }
            return [];
        }
        if (
            _.intersection(
                this.props.current_user.role || [],
                ['admin']
            ).length
        ) {
            return ['download', 'delete', 'raw', 'new', 'view'];
        }
        if (
            this.props.character.user_id == this.props.current_user.id
        ) {
            return ['download', 'delete',, 'edit', 'new', 'view'];
        }
        if (
            _.intersection(
                this.props.current_user.role || [],
                ['dm']
            ).length
        ) {
            return ['download', 'edit', 'new', 'view'];
        }
        if (
            _.intersection(
                this.props.current_user.role || [],
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
