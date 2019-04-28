import React from 'react';
import {Link} from 'react-router-dom';

import '../../sass/_users-table.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import UserLinks from '../components/UserLinks.jsx';

class UserHeader extends LazyComponent
{
    render() {
        return <thead>
            <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
            </tr>
        </thead>
    }
};

class UserFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan={3}>
                    <UserLinks
                        altStyle={true}
                    />
                </td>
            </tr>
        </tbody>
    }
};

class UserRow extends LazyComponent
{
    render() {
        const {
            id, username, name, role, email, user_roles = []
        } = this.props;

        return <tr data-id={id}>
            <th>
                {username}<br/>
                <i>({name})</i>
                <UserLinks
                    altStyle={true}
                    id={id}
                />
            </th>
            <td className="users-table__roles">
                {_.map(role, (r) => (
                    <ListLabel
                        key={r}
                        items={user_roles}
                        value={r}
                        />
                ))}
            </td>
            <td>{email}</td>
        </tr>
    }
};

class UserTable extends LazyComponent
{
    shouldDisplayRow(pattern, user) {
        return (
            (user.name && user.name.match(pattern))
            || (user.username && user.username.match(pattern))
            || (user.email && user.email.match(pattern))
        );
    }

    render() {
        const {
            users, user_roles, search = ''
        } = this.props;

        if (!users) {
            return null;
        }

        let pattern = new RegExp(search, "i");
        const filtered = _.filter(
            users,
            (user) => this.shouldDisplayRow(pattern, user)
        );

        return <div>
            <h2 className="icon fa-user">Users</h2>

            <table className="nice-table users-table condensed bordered responsive">
                <UserHeader />
                <tbody key="tbody">
                    {_.map(this.props.users, (user) => (
                        <UserRow
                            key={user.id}
                            user_roles={user_roles}
                            {...user}
                            />
                    ))}
                </tbody>
                <UserFooter />
            </table>
        </div>
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        UserTable,
        {users: {type: 'user'}}
    ),
    [
        'search',
        'user_roles',
    ],
    'items'
);
