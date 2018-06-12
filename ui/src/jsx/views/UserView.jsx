import React from 'react';
import _ from 'lodash';

import '../../sass/_user-view.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import Panel from '../components/Panel.jsx';
import ListLabel from '../components/ListLabel.jsx';
import UserLinks from '../components/UserLinks.jsx';

export class UserView extends React.Component
{
    render() {
        const {
            id, name, username, dci, email, role = [],
            user_roles = [], current_user
        } = this.props;
        const isAdmin = _.includes(current_user.role || [], 'admin');

        return <React.Fragment>
            <Panel
                key="description"
                className="user-view__description info"
                header="Description"
                >
                <thead>
                    <tr>
                        <th colSpan="2">
                            <UserLinks
                                buttons={['edit']}
                                className="pull-right"
                                user_id={id}
                                />

                            <h3>{name || username}</h3>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <th>Username</th>
                        <td>{username}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{email}</td>
                    </tr>
                    {dci? <tr>
                        <th>DCI</th>
                        <td>{dci}</td>
                    </tr> : null}
                    <tr>
                        <th>Roles</th>
                        <td className="user-view__roles">
                            {_.map(role, (r) => (
                                <ListLabel
                                    key={r}
                                    items={user_roles}
                                    value={r}
                                    />
                            ))}
                        </td>
                    </tr>
                </tbody>
            </Panel>
        </React.Fragment>;
    }
}

export default ListDataWrapper(
    ListDataWrapper(
        RoutedObjectDataWrapper(
            UserView, {
                className: 'user-view',
                icon: 'fa-user',
                label: 'User',
            },
            "user"
        ),
        [
            "user_roles",
        ],
        'items'
    ),
    [
        "current_user",
    ]
);
