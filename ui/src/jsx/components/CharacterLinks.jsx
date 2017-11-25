import React from 'react';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ItemStore from '../mixins/ItemStore.jsx';
import ObjectLoader from '../mixins/ObjectLoader.jsx';

class CharacterLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
        this.buttonList = {
            'view': () => {
                return {
                    label: 'View',
                    link: "/character/show/" + this.props.character.id,
                    icon: 'eye',
                };
            },
            'edit': () => {
                return {
                    label: 'Edit',
                    link: "/character/edit/" + this.props.character.id,
                    icon: 'pencil',
                };
            },
            'download': () => {
                return {
                    label: 'Download',
                    link: "/character/download/" + this.props.character.id,
                    icon: 'pdf',
                };
            },
            'new': () => {
                return {
                    label: 'New',
                    link: "/character/new",
                    icon: 'plus',
                };
            }
        };
    }

    getAllowed() {
        if (
            this.props.character == null
            || this.props.current_user == null
        ) {
            return [];
        }
        if (
            _.indexOf(
                this.props.current_user.role || [],
                'dm'
            ) >= 0
        ) {
            return ['download', 'edit', 'new', 'view'];
        }
        if (this.props.character.user_id == this.props.current_user.id) {
            return ['download', 'edit', 'new', 'view'];
        }
        if (
            _.indexOf(
                this.props.current_user.role || [],
                'player'
            ) >= 0
        ) {
            return ['download', 'new', 'view'];
        }
        return [];
    }
}

CharacterLinks.defaultProps = {
    buttons: ['view', 'edit', 'pdf'],
};

export default ItemStore(
        ObjectLoader(CharacterLinks, [
        {type: 'character', id: 'character_id'}
    ]),
    ['current_user']
);