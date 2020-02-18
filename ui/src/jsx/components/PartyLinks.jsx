import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../components/BaseLinkGroup/index.jsx';
import ListDataActions from '../actions/ListDataActions.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import { userHasRole } from '../utils.jsx';


export class PartyLinks extends BaseLinkGroup
{
    onHost = () => {
        const { id } = this.props;
        fetch(`/party/host/${id}`, {
            method: "POST",
            credentials: 'same-origin',
            'headers': {
                'Accept': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            ListDataActions.fetchItems.completed({
                hosted_party: data
            });
        });
    }

    onUnhost = () => {
        fetch("/party/host", {
        method: "POST",
            credentials: 'same-origin',
            'headers': {
                'Accept': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            ListDataActions.fetchItems.completed({
                hosted_party: data
            });
        });
    }

    onDelete = () => {
        const { id } = this.props;
        ObjectDataActions.deleteObject("character", id);
    }

    render() {
        const {
            id,
            hostedParty,
            party: {
                user_id: userId,
            } = {},
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
                    link={`/party/show/${id}`}
                    available={(
                        id !== null
                        && userHasRole(currentUser, ['dm', 'admin'])
                    )}
                />
                <BaseLinkButton
                    name="raw"
                    label="Raw"
                    icon="cogs"
                    altStyle={altStyle}
                    download={`/party/raw/${id}`}
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
                    link={`/party/edit/${id}`}
                    available={(
                        id !== null
                        && userId === currentUser.id
                        && userHasRole(currentUser, ['dm', 'admin'])
                    )}
                />
                <BaseLinkButton
                    name="host"
                    label="Host"
                    icon="beer"
                    className="info"
                    altStyle={altStyle}
                    action={this.onHost}
                    available={(
                        id !== null
                        && (
                            !hostedParty
                            || hostedParty.id !== id
                        )
                        && userHasRole(currentUser, 'dm')
                    )}
                />
                <BaseLinkButton
                    name="host"
                    label="Stop"
                    icon="ban"
                    className="warning"
                    altStyle={altStyle}
                    action={this.onUnhost}
                    available={(
                        id !== null
                        && hostedParty
                        && hostedParty.id === id
                        && userHasRole(currentUser, 'dm')
                    )}
                />
                <BaseLinkButton
                    name="new"
                    label="New"
                    icon="plus"
                    link="/party/new"
                    altStyle={altStyle}
                    available={(
                        id === null
                        && userHasRole(currentUser, 'dm')
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
                        && userId === currentUser.id
                        && userHasRole(currentUser, ['dm', 'admin'])
                    )}
                />
                {children}
            </BaseLinkGroup>
        );
    }
};

PartyLinks.propTypes = {
    altStyle: PropTypes.bool,
    id: PropTypes.number,
    party: PropTypes.shape({
        user_id: PropTypes.number,
    }),
    hostedParty: PropTypes.shape({
        id: PropTypes.number,
    }),
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        role: PropTypes.arrayOf(
            PropTypes.oneOf(['player', 'dm', 'admin'])
        ),
    }),
};

PartyLinks.defaultProps = {
    altStyle: false,
    id: null,
    party: {},
    hostedParty: null,
    currentUser: {},
};

export default ListDataWrapper(
    ObjectDataWrapper(PartyLinks, [
        {type: 'party', id: 'id'}
    ]),
    ['current_user', 'hosted_party'],
    null,
    {
        current_user: 'currentUser',
        hosted_party: 'hostedParty',
    }
);
