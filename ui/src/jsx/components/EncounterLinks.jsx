import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../components/BaseLinkGroup/index.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import { userHasRole } from '../utils.jsx';


export const EncounterLinks = ({
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
                link={`/encounter/show/${id}`}
                available={(
                    id !== null
                    && userHasRole(currentUser, ['admin', 'dm'])
                )}
            />
            <BaseLinkButton
                name="edit"
                label="Edit"
                icon="pencil"
                altStyle={altStyle}
                link={`/encounter/edit/${id}`}
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
                link={`/encounter/new`}
                available={(
                    id === null
                    && userHasRole(currentUser, ['admin', 'dm'])
                )}
            />
            {children}
        </BaseLinkGroup>
    )
};

EncounterLinks.propTypes = {
    altStyle: PropTypes.bool,
    id: PropTypes.number,
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        role: PropTypes.arrayOf(
            PropTypes.oneOf(['player', 'dm', 'admin'])
        ),
    }),
};

EncounterLinks.defaultProps = {
    altStyle: false,
    id: null,
    currentUser: {},
};

export default ListDataWrapper(
    EncounterLinks,
    ['current_user'],
    null,
    { current_user: 'currentUser' }
);
