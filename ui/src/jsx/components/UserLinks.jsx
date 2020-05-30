import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../components/BaseLinkGroup/index.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import { userHasRole } from '../utils.jsx';


export class UserLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
        this.onDelete = this.onDelete.bind(this);
    }

    onDelete() {
        const { id } = this.props;
        ObjectDataActions.deleteObject("user", id);
    }

    render() {
        const {
            id,
            currentUser,
            altStyle,
            children,
            ...props
        } = this.props;

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
                    link={`/user/show/${id}`}
                    available={(
                        id !== null
                        && (
                            id === currentUser.id
                            || userHasRole(currentUser, 'admin')
                        )
                    )}
                />
                <BaseLinkButton
                    name="raw"
                    label="Raw"
                    icon="cogs"
                    altStyle={altStyle}
                    download={`/user/raw/${id}`}
                    available={(
                        id !== null
                        && userHasRole(currentUser, 'admin')
                    )}
                />
                <BaseLinkButton
                    name="edit"
                    label="Edit"
                    icon="pencil"
                    altStyle={altStyle}
                    link={`/user/edit/${id}`}
                    available={(
                        id !== null
                        && (
                            id === currentUser.id
                            || userHasRole(currentUser, 'admin')
                        )
                    )}
                />
                <BaseLinkButton
                    name="new"
                    label="New"
                    icon="plus"
                    link="/user/new"
                    altStyle={altStyle}
                    available={(
                        id === null
                        && userHasRole(currentUser, 'admin')
                    )}
                />
                <BaseLinkButton
                    name="delete"
                    label="Delete"
                    icon="trash-o"
                    className="bad"
                    action={this.onDelete}
                    altStyle={altStyle}
                    available={(
                        id !== null
                        && id !== currentUser.id
                        && userHasRole(currentUser, 'admin')
                    )}
                />
                {children}
            </BaseLinkGroup>
        );
    }
};

UserLinks.propTypes = {
    altStyle: PropTypes.bool,
    id: PropTypes.number,
    user: PropTypes.shape({
        id: PropTypes.number,
    }),
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        role: PropTypes.arrayOf(
            PropTypes.oneOf(['player', 'dm', 'admin'])
        ),
    }),
};

UserLinks.defaultProps = {
    altStyle: false,
    id: null,
    user: {},
    currentUser: {},
};

export default ListDataWrapper(
    UserLinks,
    ['current_user'],
    null,
    { current_user: 'currentUser' }
);
