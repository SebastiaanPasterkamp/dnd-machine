import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../components/BaseLinkGroup/index.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import { userHasRole } from '../utils.jsx';


export class AdventureLeagueLogLinks extends React.Component
{
    onConsume = () => {
        const {
            id,
            adventureleague: { character_id },
        } = this.props;
        ObjectDataActions.consumeObject(
            "adventureleague", id, "log",
            () => ObjectDataActions.getObject(
                "character", character_id
            )
        );
    }

    onDelete = () => {
        const { id } = this.props;
        ObjectDataActions.deleteObject("adventureleague", id,  "log");
    }

    render() {
        const { id, adventureleague, characterId, currentUser,
            altStyle, children, ...props
        } = this.props;

        if (!currentUser) {
            return {};
        }

        return (
            <BaseLinkGroup {...props}>
                <BaseLinkButton
                    name="view"
                    label="View"
                    icon="eye"
                    altStyle={altStyle}
                    link={`/log/adventureleague/show/${id}`}
                    available={(
                        id !== null
                        && (
                            adventureleague.user_id === currentUser.id
                            || userHasRole(currentUser, 'admin')
                        )
                    )}
                />
                <BaseLinkButton
                    name="raw"
                    label="Raw"
                    icon="cogs"
                    altStyle={altStyle}
                    download={`/log/adventureleague/raw/${id}`}
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
                    link={`/log/adventureleague/edit/${id}`}
                    available={(
                        id !== null
                        && adventureleague.user_id === currentUser.id
                    )}
                />
                <BaseLinkButton
                    name="assign"
                    label="Assign"
                    icon="user-o"
                    altStyle={altStyle}
                    className="info"
                    link={`/log/adventureleague/edit/${id}#assign`}
                    available={(
                        id !== null
                        && adventureleague.user_id === currentUser.id
                        && !adventureleague.character_id
                    )}
                />
                <BaseLinkButton
                    name="consume"
                    label="Consume"
                    icon="thumb-tack"
                    altStyle={altStyle}
                    className="warning"
                    action={this.onConsume}
                    available={(
                        id !== null
                        && adventureleague.user_id === currentUser.id
                        && !!adventureleague.character_id
                        && !adventureleague.consumed
                    )}
                />
                <BaseLinkButton
                    name="new"
                    label="New"
                    icon="plus"
                    link={characterId
                        ? `/log/adventureleague/new/${characterId}`
                        : "/log/adventureleague/new"
                    }
                    altStyle={altStyle}
                    available={(
                        id === null
                        && characterId !== null
                        && userHasRole(currentUser, ['player', 'dm'])
                        && !!currentUser.dci
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
                        && adventureleague.user_id == currentUser.id
                        && !adventureleague.consumed
                    )}
                />
                {children}
            </BaseLinkGroup>
        );
    }
};

AdventureLeagueLogLinks.propTypes = {
    altStyle: PropTypes.bool,
    id: PropTypes.number,
    adventureleague: PropTypes.shape({
        user_id: PropTypes.number,
        character_id: PropTypes.number,
        consumed: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.number,
        ]),
    }),
    characterId: PropTypes.number,
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        role: PropTypes.arrayOf(
            PropTypes.oneOf(['player', 'dm', 'admin'])
        ),
    }),
};

AdventureLeagueLogLinks.defaultProps = {
    altStyle: false,
    id: null,
    adventureleague: {},
    characterId: null,
    currentUser: {},
};

export default ListDataWrapper(
    ObjectDataWrapper(AdventureLeagueLogLinks, [
        {group: 'log', type: 'adventureleague', id: 'id'}
    ]),
    ['current_user'],
    null,
    { current_user: 'currentUser' }
);
