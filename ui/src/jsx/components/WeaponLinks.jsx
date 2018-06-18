import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import { userHasRole } from '../utils.jsx';

export class WeaponLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
        this.altStyle = true;
    }

    buttonList() {
        const {
            weapon_id, current_user: user,
        } = this.props;

        if (!user) {
            return {};
        }

        return {
            'view': () => ({
                label: 'View',
                link: "/items/weapon/show/" + weapon_id,
                icon: 'eye',
                available: weapon_id,
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/items/weapon/edit/" + weapon_id,
                icon: 'pencil',
                available: (
                    weapon_id
                    && userHasRole(user, ['admin', 'dm'])
                ),
            }),
            'new': () => ({
                label: 'New',
                link: "/items/weapon/new",
                icon: 'plus',
                available: (
                    !weapon_id
                    && userHasRole(user, ['admin', 'dm'])
                ),
            }),
        };
    }
}

WeaponLinks.propTypes = _.assign(
    {}, BaseLinkGroup.propTypes, {
        buttons: PropTypes.arrayOf(
            PropTypes.oneOf([
                'view', 'edit', 'new',
            ])
        ),
        weapon_id: PropTypes.number,
        current_user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            role: PropTypes.arrayOf(
                PropTypes.oneOf(['player', 'dm', 'admin'])
            ),
        }),
    }
);

export default ListDataWrapper(
    WeaponLinks,
    ['current_user']
);
