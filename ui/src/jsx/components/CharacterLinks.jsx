import React from 'react';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

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
                ['dm']
            ).length
            || this.props.character.user_id == this.props.current_user.id
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