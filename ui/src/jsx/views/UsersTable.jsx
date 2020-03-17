import React from 'react';
import PropTypes from 'prop-types';
import {
    filter,
    isEmpty,
    map,
} from 'lodash/fp';
import {Link} from 'react-router-dom';

import '../../sass/_users-table.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import UserLinks from '../components/UserLinks.jsx';

const UserHeader = function() {
    return (
        <thead>
            <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
            </tr>
        </thead>
    );
};

const UserFooter = function() {
    return (
        <tbody>
            <tr>
                <td colSpan={3}>
                    <UserLinks altStyle={true} />
                </td>
            </tr>
        </tbody>
    );
};

const UserRow = function({
    id, username, name, role, email, user_roles,
}) {
    return (
        <tr data-id={id}>
            <th>
                {username}<br/>
                <i>({name})</i>
                <UserLinks altStyle={true} id={id} />
            </th>
            <td className="users-table__roles">
                {map((r) => (
                    <ListLabel
                        key={r}
                        items={user_roles}
                        value={r}
                    />
                ))(role)}
            </td>
            <td>{email}</td>
        </tr>
    );
};

UserRow.propTypes = {
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    name: PropTypes.string,
    role: PropTypes.arrayOf(PropTypes.string),
    email: PropTypes.string,
    user_roles: PropTypes.array,
};

UserRow.defaultProps = {
    name: '',
    email: '',
    user_roles: [],
};

class UserTable extends LazyComponent
{
    shouldDisplayRow(pattern, {name, username, email}) {
        return (
            (name && name.match(pattern))
            || (username && username.match(pattern))
            || (email && email.match(pattern))
        );
    }

    render() {
        const { users, user_roles, search } = this.props;

        if (isEmpty(users)) {
            return null;
        }

        const pattern = new RegExp(search, "i");
        const filtered = filter(
            (user) => this.shouldDisplayRow(pattern, user)
        )(users);

        return (
            <div>
                <h2 className="icon fa-address-book-o">Users</h2>

                <table className="nice-table users-table condensed bordered responsive">
                    <UserHeader />
                    <tbody key="tbody">
                        {map((user) => (
                            <UserRow
                                key={user.id}
                                user_roles={user_roles}
                                {...user}
                            />
                        ))(filtered)}
                    </tbody>
                    <UserFooter />
                </table>
            </div>
        );
    }
}

UserTable.propTypes = {
    users: PropTypes.object,
    user_roles: PropTypes.array,
    search: PropTypes.string,
};

UserTable.defaultProps = {
    search: '',
    user_roles: [],
    users: {},
};

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
