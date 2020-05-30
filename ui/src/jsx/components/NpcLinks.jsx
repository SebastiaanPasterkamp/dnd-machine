import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../components/BaseLinkGroup/index.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataActions from '../actions/ObjectDataActions.jsx';
import { userHasRole } from '../utils.jsx';


export class NpcLinks extends React.Component
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
            "npc", id, null,
            (type, id, data) => router.history.push(
                '/npc/edit/' + data.id
            )
        );
    }

    onDelete() {
        const { id } = this.props;
        ObjectDataActions.deleteObject("npc", id);
    }

    render() {
        const { id, currentUser, altStyle, children,
            ...props
        } = this.props;

        if (!currentUser) {
            return null;
        }

        const available = (
            id !== null
            && userHasRole(currentUser, 'dm')
        );

        return (
            <BaseLinkGroup {...props}>
                <BaseLinkButton
                    name="view"
                    label="View"
                    icon="eye"
                    altStyle={altStyle}
                    link={`/npc/show/${id}`}
                    available={available}
                />
                <BaseLinkButton
                    name="raw"
                    label="Raw"
                    icon="cogs"
                    altStyle={altStyle}
                    download={`/npc/raw/${id}`}
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
                    link={`/npc/edit/${id}`}
                    available={available}
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
                    link="/npc/new"
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
                    available={available}
                />
                {children}
            </BaseLinkGroup>
        );
    }
};

NpcLinks.contextTypes = {
    router: PropTypes.object,
};

NpcLinks.propTypes = {
    altStyle: PropTypes.bool,
    id: PropTypes.number,
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        role: PropTypes.arrayOf(
            PropTypes.oneOf(['player', 'dm', 'admin'])
        ),
    }),
};

NpcLinks.defaultProps = {
    altStyle: false,
    id: null,
    currentUser: {},
};

export default ListDataWrapper(
    NpcLinks,
    ['current_user'],
    null,
    { current_user: 'currentUser' }
);
