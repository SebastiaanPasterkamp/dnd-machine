import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_login-dialog.scss';

import utils from '../utils.jsx';

import ListDataActions from '../actions/ListDataActions.jsx';
import UiActions from '../actions/UiActions.jsx';
import InlineDataWrapper from '../hocs/InlineDataWrapper.jsx';

import ButtonField from '../components/ButtonField.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import InputField from '../components/InputField.jsx';

export class LoginDialog extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: false,
            processing: false,
        };
    }

    onUsernameChange = (username) => {
        this.setState({ username, error: false });
    }

    onPasswordChange = (password) => {
        this.setState({ password, error: false });
    }

    doLogin = () => {
        const { onLogin } = this.props;
        const { username, password } = this.state;

        this.setState({
            processing: true,
            error: false,
        }, () => ListDataActions.doLogin(
            {username, password},
            onLogin,
            () => this.setState({
                processing: false,
                error: true,
            })
        ));
    }

    render() {
        const {
            processing, username, password, error
        } = this.state;
        const {
            icon, recoverAction, googleAuth, title, message, version, author, date
        } = this.props;

        const logoStyle = utils.makeStyle({
            'icon': icon,
            [icon]: icon
        }, ["product-icon"]);

        const loadingStyle = utils.makeStyle({
            'shown': processing
        }, ["nice-login-loading"]);

        return <div className="login-dialog nice-login">
            <div className="nice-login-brand">
                <span className="text-brand">{title}</span>
            </div>

            <div className="nice-login-intro">
                <div className="nice-login-intro-logo">
                    <i className={logoStyle}></i>
                </div>
                <div className="nice-login-intro-content">
                   {message}
                </div>
                <div className={loadingStyle}></div>
            </div>

            <div className="nice-login-content">

                <div className="nice-login-content">
                    <div className="nice-form-group">
                        <label>Username</label>
                        <InputField
                            className={error ? 'bad': null}
                            placeholder="Username..."
                            value={username}
                            onEnter={this.doLogin}
                            setState={this.onUsernameChange}
                        />
                    </div>

                    <div className="nice-form-group">
                        <label>Password</label>
                        <InputField
                            className={error ? 'bad': null}
                            type="password"
                            placeholder="Password..."
                            value={password}
                            onEnter={this.doLogin}
                            setState={this.onPasswordChange}
                        />
                    </div>
                </div>

                {googleAuth ? (
                    <div className="nice-btn-group pull-right">
                        <a
                            href="/login/google"
                            className="login-dialog__google"
                        >
                            Login with Google
                        </a>
                    </div>
                ) : null}

            </div>

            <div className="nice-login-footer">
                {recoverAction
                    ? <a
                        href={recoverAction}
                        className="nice-btn link icon fa-question"
                    >
                        Lost your credentials?
                    </a>
                    : null
                }

                <div className="nice-btn-group pull-right">
                    <ButtonField
                        color="primary"
                        icon="sign-in"
                        label="Sign in"
                        onClick={this.doLogin}
                    />
                </div>
            </div>

            <div className="nice-login-version">
                {title} {version}
                <span className="text-brand pull-right">
                    by {author} &copy; {date}
                </span>
            </div>
        </div>;
    }
}


LoginDialog.propTypes = {
    onLogin: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    icon: PropTypes.string,
    version: PropTypes.string,
    author: PropTypes.string,
    date: PropTypes.string,
    recoverAction: PropTypes.string,
    googleAuth: PropTypes.bool,
};

LoginDialog.defaultProps = {
    title: 'Login',
    message: 'Please log in',
    icon: null,
    version: null,
    author: null,
    date: null,
    recoverAction: null,
    googleAuth: false,
};

export default InlineDataWrapper(
    LoginDialog,
    'authenticate'
);
