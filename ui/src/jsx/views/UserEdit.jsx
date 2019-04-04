import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_user-edit.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';
import Panel from '../components/Panel.jsx';
import TagContainer from '../components/TagContainer.jsx';

export class UserEdit extends React.Component
{
    onFieldChange(field, value) {
        this.props.setState({[field]: value});
    }

    render() {
        const {
            id, name, username, password, email, dci, role = [],
            user_roles = [], current_user: { role: current_role = [] }
        } = this.props;
        const isAdmin = _.includes(current_role, 'admin');

        return <React.Fragment>
            <Panel
                key="description"
                className="user-edit__description"
                header="Description"
                >
                <ControlGroup label="Username">
                    <InputField
                        placeholder="Username..."
                        value={username}
                        disabled={!isAdmin}
                        setState={isAdmin
                            ? (value) => this.onFieldChange('username', value)
                            : null
                        } />
                </ControlGroup>
                <ControlGroup label="Full name">
                    <InputField
                        placeholder="Full name..."
                        value={name}
                        setState={(value) => this.onFieldChange('name', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Password">
                    <InputField
                        placeholder="Password..."
                        type="password"
                        value={password}
                        setState={(value) => this.onFieldChange('password', value)
                        } />
                </ControlGroup>
                <ControlGroup label="Email">
                    <InputField
                        placeholder="Email..."
                        value={email}
                        type="email"
                        setState={(value) => this.onFieldChange('email', value)
                        } />
                </ControlGroup>
                <ControlGroup label="DCI">
                    <InputField
                        placeholder="DCI..."
                        value={dci}
                        setState={(value) => this.onFieldChange('dci', value)
                        } />
                </ControlGroup>
            </Panel>

            {isAdmin
                ? <Panel
                    key="permissions"
                    className="user-edit__permissions"
                    header="Permissions"
                    >
                    <ControlGroup label="Role">
                        <TagContainer
                            value={role}
                            items={user_roles}
                            setState={(value) => {
                                this.onFieldChange('role', value);
                            }}
                            />
                    </ControlGroup>
                </Panel>
                : null
            }
        </React.Fragment>;
    }
}

UserEdit.propTypes = {
    setState: PropTypes.func.isRequired,
    id: PropTypes.number,
    name: PropTypes.string,
    dci: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.arrayOf(
        PropTypes.string
    ),
    user_roles: PropTypes.arrayOf(
        PropTypes.shape({
            code: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    current_user: PropTypes.shape({
        role: PropTypes.arrayOf(
            PropTypes.string
        ),
    }).isRequired,
};

export default ListDataWrapper(
    ListDataWrapper(
        RoutedObjectDataWrapper(
            UserEdit, {
                className: 'user-edit',
                icon: 'fa-user',
                label: 'User',
                buttons: ['cancel', 'show', 'reload', 'save']
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
