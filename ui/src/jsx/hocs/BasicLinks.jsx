import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
} from 'lodash/fp';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../components/BaseLinkGroup/index';
import ListDataWrapper from './ListDataWrapper';
import { userHasRole } from '../utils';

export const BasicLinks = function(path, requiredRoles) {
    const component = function({
        id, currentUser, altStyle, children,
        ...props
    }) {
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
                    link={`/${path.join('/')}/show/${id}`}
                    available={(
                        id !== null
                        && userHasRole(currentUser, requiredRoles)
                    )}
                />
                <BaseLinkButton
                    name="edit"
                    label="Edit"
                    icon="pencil"
                    altStyle={altStyle}
                    link={`/${path.join('/')}/edit/${id}`}
                    available={(
                        id !== null
                        && userHasRole(currentUser, requiredRoles)
                    )}
                />
                <BaseLinkButton
                    name="new"
                    label="New"
                    icon="plus"
                    altStyle={altStyle}
                    link={`/${path.join('/')}/new`}
                    available={(
                        id === null
                        && userHasRole(currentUser, requiredRoles)
                    )}
                />
                {children}
            </BaseLinkGroup>
        );
    };

    component.propTypes = {
        altStyle: PropTypes.bool,
        id: PropTypes.number,
        currentUser: PropTypes.shape({
            id: PropTypes.number,
            role: PropTypes.arrayOf(
                PropTypes.oneOf(['player', 'dm', 'admin'])
            ),
        }),
    };

    component.defaultProps = {
        altStyle: false,
        id: null,
        currentUser: {},
    };

    component.displayName = map(
        word => (word.toUpperCase() + word.slice(1))
    )(['basic', ...path, 'links']).join('/');

    return ListDataWrapper(
        component,
        ['current_user'],
        null,
        { current_user: 'currentUser' }
    );
};

export default BasicLinks;
