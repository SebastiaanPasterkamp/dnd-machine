import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../components/BaseLinkGroup/index.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import { userHasRole } from '../utils.jsx';


export class MonsterLinks extends React.Component
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
            "monster", id, null,
            (type, id, data) => router.history.push(
                '/monster/edit/' + data.id
            )
        );
    }

    onDelete() {
        const { id } = this.props;
        ObjectDataActions.deleteObject("monster", id);
    }

    render() {
        const { id, monster, currentUser, altStyle, children,
            ...props
        } = this.props;

        if (!currentUser) {
            return null;
        }

        const available = (
            id !== null
            && userHasRole(currentUser, 'dm')
        );

        const owned = (
            id !== null
            && (
                monster.user_id === null
                || monster.user_id === undefined
                || monster.user_id === currentUser.id
            )
            && userHasRole(currentUser, 'dm')
        );

        return (
            <BaseLinkGroup {...props}>
                <BaseLinkButton
                    name="view"
                    label="View"
                    icon="eye"
                    altStyle={altStyle}
                    link={`/monster/show/${id}`}
                    available={available}
                />
                <BaseLinkButton
                    name="raw"
                    label="Raw"
                    icon="cogs"
                    altStyle={altStyle}
                    download={`/monster/raw/${id}`}
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
                    link={`/monster/edit/${id}`}
                    available={owned}
                />
                <BaseLinkButton
                    name="copy"
                    label="Copy"
                    icon="clone"
                    action={this.onCopy}
                    altStyle={altStyle}
                    available={available}
                />
                <BaseLinkButton
                    name="new"
                    label="New"
                    icon="plus"
                    link="/monster/new"
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
                    available={owned}
                />
                {children}
            </BaseLinkGroup>
        );
    }
};

MonsterLinks.contextTypes = {
    router: PropTypes.object,
};

MonsterLinks.propTypes = {
    altStyle: PropTypes.bool,
    id: PropTypes.number,
    monster: PropTypes.shape({
        user_id: PropTypes.number,
    }),
    user_id: PropTypes.number,
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        role: PropTypes.arrayOf(
            PropTypes.oneOf(['player', 'dm', 'admin'])
        ),
    }),
};

MonsterLinks.defaultProps = {
    altStyle: false,
    id: null,
    monster: {},
    currentUser: {},
};

export default ListDataWrapper(
    ObjectDataWrapper(
        MonsterLinks,
        [
            {type: 'monster', id: 'id'}
        ]
    ),
    ['current_user'],
    null,
    { current_user: 'currentUser' }
);
