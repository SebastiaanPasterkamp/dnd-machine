import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BaseLinkGroup from '../components/BaseLinkGroup.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';

import { userHasRole } from '../utils.jsx';

export class SpellLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const {
            spell_id, current_user: user,
        } = this.props;

        if (!user) {
            return {};
        }

        return {
            'view': () => ({
                label: 'View',
                link: "/items/spell/show/" + spell_id,
                icon: 'eye',
                available: spell_id != undefined,
            }),
            'edit': () => ({
                label: 'Edit',
                link: "/items/spell/edit/" + spell_id,
                icon: 'pencil',
                available: (
                    spell_id != undefined
                    && userHasRole(user, ['admin', 'dm'])
                ),
            }),
            'new': () => ({
                label: 'New',
                link: "/items/spell/new",
                icon: 'plus',
                available: (
                    spell_id == undefined
                    && userHasRole(user, ['admin', 'dm'])
                ),
            }),
        };
    }
};

SpellLinks.propTypes = _.assign(
    {}, BaseLinkGroup.propTypes, {
        buttons: PropTypes.arrayOf(
            PropTypes.oneOf([
                'view', 'edit', 'new',
            ])
        ),
        spell_id: PropTypes.number,
        current_user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            role: PropTypes.arrayOf(
                PropTypes.oneOf(['player', 'dm', 'admin'])
            ),
        }),
    }
);

export default ListDataWrapper(
    SpellLinks,
    ['current_user']
);
