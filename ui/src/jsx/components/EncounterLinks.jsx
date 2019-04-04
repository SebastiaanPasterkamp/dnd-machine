import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import { userHasRole } from '../utils.jsx';

export class EncounterLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const {
            encounter_id, current_user: user,
        } = this.props;

        if (!user) {
            return {};
        }

        return {
            'view': () => ({
                label: 'View',
                link: "/encounter/show/" + encounter_id,
                icon: 'eye',
                available:  (
                    encounter_id != undefined
                    && userHasRole(user, ['admin', 'dm'])
                ),
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/encounter/edit/" + encounter_id,
                icon: 'pencil',
                available: (
                    encounter_id != undefined
                    && userHasRole(user, ['admin', 'dm'])
                ),
            }),
            'new': () => ({
                label: 'New',
                link: "/encounter/new",
                icon: 'plus',
                available: (
                    encounter_id == undefined
                    && userHasRole(user, ['admin', 'dm'])
                ),
            }),
        };
    }
};

EncounterLinks.propTypes = _.assign(
    {}, BaseLinkGroup.propTypes, {
        buttons: PropTypes.arrayOf(
            PropTypes.oneOf([
                'view', 'edit', 'new',
            ])
        ),
        encounter_id: PropTypes.number,
        current_user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            role: PropTypes.arrayOf(
                PropTypes.oneOf(['player', 'dm', 'admin'])
            ),
        }),
    }
);

export default ListDataWrapper(
    EncounterLinks,
    ['current_user']
);
