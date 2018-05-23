import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import { userHasRole } from '../utils.jsx';

export class ArmorLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const {
            armor_id, armor = {}, current_user: user,
        } = this.props;

        if (!user) {
            return {};
        }

        return {
            'view': () => ({
                label: 'View',
                link: "/items/armor/show/" + armor_id,
                icon: 'eye',
                available: armor_id,
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/items/armor/edit/" + armor_id,
                icon: 'pencil',
                available: (
                    armor_id
                    && userHasRole(user, ['admin', 'dm'])
                ),
            }),
            'new': () => ({
                label: 'New',
                link: "/items/armor/new",
                icon: 'plus',
                available: (
                    !armor_id
                    && userHasRole(user, ['admin', 'dm'])
                ),
            })
        };
    }
};

ArmorLinks.propTypes = _.assign(
    {}, BaseLinkGroup.propTypes, {
        buttons: PropTypes.arrayOf(
            PropTypes.oneOf([
                'view', 'edit', 'new',
            ])
        ),
        armor_id: PropTypes.number,
        current_user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            role: PropTypes.arrayOf(
                PropTypes.oneOf(['player', 'dm', 'admin'])
            ),
        }),
    }
);

export default ListDataWrapper(
    ArmorLinks,
    ['current_user']
);
