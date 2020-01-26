import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_user-edit.scss';

import ListDataWrapper from '../hocs/ListDataWrapper';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper';
import InlineDataWrapper from '../hocs/InlineDataWrapper.jsx';

import ControlGroup from '../components/ControlGroup';
import InputField from '../components/InputField';
import Panel from '../components/Panel';
import TagContainer from '../components/TagContainer';
import ToggleSwitch from '../components/ToggleSwitch';

import { memoize } from '../utils';

export class UserEdit extends React.Component
{
    constructor(props) {
        super(props);
        this.memoize = memoize.bind(this);
        this.onRemoveGoogleID = this.onRemoveGoogleID.bind(this);
    }

    onFieldChange(field) {
        return this.memoize(field, (value) => {
            this.props.setState({ [field]: value });
        });
    }

    onRemoveGoogleID() {
        this.props.setState({ google_id: undefined });
    }

    render() {
        const {
            id, name, username, password, email, dci, google_id,
            role, user_roles, googleAuth,
            current_user: {
                role: current_role = [],
            },
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
                            ? this.onFieldChange('username')
                            : null
                        }
                    />
                </ControlGroup>
                <ControlGroup label="Full name">
                    <InputField
                        placeholder="Full name..."
                        value={name}
                        setState={this.onFieldChange('name')}
                    />
                </ControlGroup>
                <ControlGroup label="Password">
                    <InputField
                        placeholder="Password..."
                        type="password"
                        value={password}
                        setState={this.onFieldChange('password')}
                    />
                </ControlGroup>
                <ControlGroup label="Email">
                    <InputField
                        placeholder="Email..."
                        value={email}
                        type="email"
                        setState={this.onFieldChange('email')}
                    />
                </ControlGroup>
                <ControlGroup label="DCI">
                    <InputField
                        placeholder="DCI..."
                        value={dci}
                        setState={this.onFieldChange('dci')}
                    />
                </ControlGroup>

                {googleAuth ? (
                    <ToggleSwitch
                        value={google_id}
                        checked={!!google_id}
                        disabled={!google_id}
                        onChange={this.onRemoveGoogleID}
                        label={google_id ? (
                            "Login with Google enabled"
                            ) : (
                                <a href="/user/google">Enable login with Google</a>
                            )
                        }
                    />
                ) : null}
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
                            setState={this.onFieldChange('role')}
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
    google_id: PropTypes.string,
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
    googleAuth: PropTypes.bool,
};

UserEdit.defaultProps = {
    google_id: '',
    name: '',
    dci: '',
    email: '',
    role: [],
    user_roles: [],
    googleAuth: false,
};

export default InlineDataWrapper(
    ListDataWrapper(
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
    ),
    'authenticate'
);
