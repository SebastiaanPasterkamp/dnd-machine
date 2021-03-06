import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../components/BaseLinkGroup/index.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import { userHasRole } from '../utils.jsx';


export const SpellLinks = ({
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
                link={`/items/spell/show/${id}`}
                available={id !== null}
            />
            <BaseLinkButton
                name="edit"
                label="Edit"
                icon="pencil"
                altStyle={altStyle}
                link={`/items/spell/edit/${id}`}
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
                link={`/items/spell/new`}
                available={(
                    id === null
                    && userHasRole(currentUser, ['admin', 'dm'])
                )}
            />
            {children}
        </BaseLinkGroup>
    );
};

SpellLinks.propTypes = {
    altStyle: PropTypes.bool,
    id: PropTypes.number,
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        role: PropTypes.arrayOf(
            PropTypes.oneOf(['player', 'dm', 'admin'])
        ),
    }),
};

SpellLinks.defaultProps = {
    altStyle: false,
    id: null,
    currentUser: {},
};

export default ListDataWrapper(
    SpellLinks,
    ['current_user'],
    null,
    { current_user: 'currentUser' }
);
