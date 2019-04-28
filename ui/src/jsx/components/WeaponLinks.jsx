import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../components/BaseLinkGroup/index.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import { userHasRole } from '../utils.jsx';


export const WeaponLinks = ({
    id, currentUser, altStyle, children,
    ...props
}) => {
    if (!currentUser) {
        return null;
    }

    return (
        <BaseLinkGroup {...props}>
            <BaseLinkButton
                name="view"
                label="View"
                icon="eye"
                altStyle={altStyle}
                link={`/items/weapon/show/${id}`}
                available={id !== null}
            />
            <BaseLinkButton
                name="edit"
                label="Edit"
                icon="pencil"
                altStyle={altStyle}
                link={`/items/weapon/edit/${id}`}
                available={(
                    id !== null
                    && userHasRole(currentUser, ['admin', 'dm'])
                )}
            />
            <BaseLinkButton
                name="new"
                label="New"
                icon="plus"
                altStyle={altStyle}
                link={`/items/weapon/new`}
                available={(
                    id === null
                    && userHasRole(currentUser, ['admin', 'dm'])
                )}
            />
            {children}
        </BaseLinkGroup>
    );
};

WeaponLinks.propTypes = {
    altStyle: PropTypes.bool,
    id: PropTypes.number,
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        role: PropTypes.arrayOf(
            PropTypes.oneOf(['player', 'dm', 'admin'])
        ),
    }),
};

WeaponLinks.defaultProps = {
    altStyle: false,
    id: null,
    currentUser: {},
};

export default ListDataWrapper(
    WeaponLinks,
    ['current_user'],
    null,
    { current_user: 'currentUser' }
);
