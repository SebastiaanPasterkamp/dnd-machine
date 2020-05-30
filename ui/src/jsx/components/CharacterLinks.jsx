import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../components/BaseLinkGroup/index.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import { userHasRole } from '../utils.jsx';


export class CharacterLinks extends React.Component
{
    constructor(props) {
        super(props);
        this.onCopy = this.onCopy.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onCopy() {
        const { router } = this.context;
        const { id } = this.props;
        ObjectDataActions.copyObject(
            "character", id, null,
            (type, id, data) => router.history.push(
                '/character/edit/' + data.id
            )
        );
    }

    onDelete() {
        const { id } = this.props;
        ObjectDataActions.deleteObject("character", id);
    }

    render() {
        const { id, character, currentUser, altStyle, children,
            ...props
        } = this.props;

        if (!currentUser) {
            return null;
        }

        const levelUp = (
            character
            && character.level_up
            && character.level_up.config.length
        );

        return (
            <BaseLinkGroup {...props}>
                <BaseLinkButton
                    name="view"
                    label="View"
                    icon="eye"
                    altStyle={altStyle}
                    link={`/character/show/${id}`}
                    available={(
                        id !== null
                        && userHasRole(currentUser, ['player', 'dm'])
                    )}
                />
                <BaseLinkButton
                    name="raw"
                    label="Raw"
                    icon="cogs"
                    altStyle={altStyle}
                    download={`/character/raw/${id}`}
                    available={(
                        id !== null
                        && userHasRole(currentUser, 'admin')
                    )}
                />
                <BaseLinkButton
                    name="edit"
                    label={levelUp ? 'Level Up' : 'Edit'}
                    icon={levelUp ? 'level-up' : 'pencil'}
                    className={levelUp ? 'primary' : null}
                    altStyle={altStyle}
                    link={`/character/edit/${id}`}
                    available={(
                        id !== null
                        && character.user_id === currentUser.id
                    )}
                />
                <BaseLinkButton
                    name="copy"
                    label="Copy"
                    icon="clone"
                    action={this.onCopy}
                    altStyle={altStyle}
                    available={(
                        id !== null
                        && (
                            character.user_id === currentUser.id
                            || userHasRole(currentUser, ['dm'])
                        )
                    )}
                />
                <BaseLinkButton
                    name="download"
                    label="PDF"
                    icon="file-pdf-o"
                    download={`/character/download/${id}`}
                    altStyle={altStyle}
                    available={(
                        id !== null
                        && userHasRole(currentUser, ['player', 'dm'])
                    )}
                />
                <BaseLinkButton
                    name="new"
                    label="New"
                    icon="plus"
                    link="/character/new"
                    altStyle={altStyle}
                    available={(
                        id === null
                        && userHasRole(currentUser, ['player', 'dm'])
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
                        && character.user_id === currentUser.id
                    )}
                />
                <BaseLinkButton
                    name="logs"
                    label="Logs"
                    icon="folder-o"
                    link={`/log/adventureleague/list/${id}`}
                    altStyle={altStyle}
                    available={(
                        id !== null
                        && character.user_id === currentUser.id
                        && userHasRole(currentUser, 'player')
                        && !!currentUser.dci
                        && character.adventure_league
                    )}
                />
                <BaseLinkButton
                    name="log"
                    label="Log"
                    icon="pencil-square-o"
                    link={`/log/adventureleague/new/${id}`}
                    altStyle={altStyle}
                    available={(
                        id !== null
                        && character.user_id === currentUser.id
                        && userHasRole(currentUser, 'player')
                        && !!currentUser.dci
                        && (
                            (
                                !character.adventure_checkpoints
                                && !character.xp
                            ) || character.adventure_league
                        )
                    )}
                />
                {children}
            </BaseLinkGroup>
        );
    }
};

CharacterLinks.contextTypes = {
    router: PropTypes.object,
};

CharacterLinks.propTypes = {
    altStyle: PropTypes.bool,
    id: PropTypes.number,
    character: PropTypes.shape({
        user_id: PropTypes.number,
        xp: PropTypes.number,
        adventure_checkpoints: PropTypes.number,
        adventure_league: PropTypes.bool,
        level_up: PropTypes.shape({
            config: PropTypes.array,
        }),
    }),
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        role: PropTypes.arrayOf(
            PropTypes.oneOf(['player', 'dm', 'admin'])
        ),
    }),
};

CharacterLinks.defaultProps = {
    altStyle: false,
    id: null,
    character: {},
    currentUser: {},
};

export default ListDataWrapper(
    ObjectDataWrapper(CharacterLinks, [
        {type: 'character', id: 'id'}
    ]),
    ['current_user'],
    null,
    { current_user: 'currentUser' }
);
