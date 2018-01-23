import React from 'react';

import ListDataActions from '../actions/ListDataActions.jsx';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

class EncounterLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        return {
            'view': () => {
                return {
                    label: 'View',
                    link: "/encounter/show/" + this.props.encounter.id,
                    icon: 'eye',
                };
            },
            'edit': () => {
                return {
                    label: 'Edit',
                    link: "/encounter/edit/" + this.props.encounter.id,
                    icon: 'pencil',
                };
            },
            'new': () => {
                return {
                    label: 'New',
                    link: "/encounter/new",
                    icon: 'plus',
                };
            }
        };
    }

    getAllowed() {
        if (this.props.current_user == null) {
            return [];
        }
        if (
            _.intersection(
                this.props.current_user.role || [],
                ['dm']
            ).length
        ) {
            if (this.props.encounter == null) {
                return ['new'];
            }
            return ['edit', 'new', 'view'];
        }
        return [];
    }
}

EncounterLinks.defaultProps = {
    buttons: ['view', 'edit'],
};

export default ListDataWrapper(
    ObjectDataWrapper(EncounterLinks, [
        {type: 'encounter', id: 'encounter_id'}
    ]),
    ['current_user']
);
