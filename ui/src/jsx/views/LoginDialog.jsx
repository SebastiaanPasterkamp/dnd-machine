import React from 'react';
import _ from 'lodash';

// import '../../sass/_login-dialog.scss';

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
            error: null,
            processing: false
        };
    }

    doLogin() {
        this.setState({
            processing: true
        }, () => {
            ListDataActions.doLogin({
                username: this.state.username,
                password: this.state.password
            });
        });
    }

    onFieldChange(field, value) {
        this.setState({
            [field]: value,
            error: null
        });
    }

    render() {
        let logoStyle = ["product-icon"];
        let loadingStyle = ["nice-login-loading"];
        if (this.props.icon) {
            logoStyle.push("icon");
            logoStyle.push(this.props.icon);
        }
        if (this.state.processing) {
            loadingStyle.push("shown");
        }

        return <div className="nice-login">
            <div className="nice-login-brand">
                <span className="text-brand">{this.props.title || 'Login'}</span>
            </div>

            <div className="nice-login-intro">
                <div className="nice-login-intro-logo">
                    <i className={logoStyle.join(' ')}></i>
                </div>
                <div className="nice-login-intro-content">
                   {this.props.message || 'Please log in '}
                </div>
                <div className={loadingStyle.join(' ')}></div>
            </div>

            <div className="nice-login-content">

                <div className="nice-login-content">
                    <div className="nice-form-group">
                        <label>Username</label>
                        <InputField
                            placeholder="Username..."
                            value={this.state.username}
                            onEnter={() => this.doLogin()}
                            setState={(value) => {
                                this.onFieldChange('username', value);
                            }} />
                    </div>

                    <div className="nice-form-group">
                        <label>Password</label>
                        <InputField
                            type="password"
                            placeholder="Password..."
                            value={this.state.password}
                            onEnter={() => this.doLogin()}
                            setState={(value) => {
                                this.onFieldChange('password', value);
                            }} />
                    </div>
                </div>

            </div>

            <div className="nice-login-footer">
                {this.props.recoverAction
                    ? <a
                            onClick={this.props.recoverAction}
                            className="nice-btn link icon fa-question">
                        Lost your credentials?
                    </a> : null
                }

                <div className="nice-btn-group pull-right">
                    <ButtonField
                        color="primary"
                        icon="sign-in"
                        label="Sign in"
                        onClick={() => this.doLogin()}
                        />
                </div>
            </div>

            <div className="nice-login-version">
                {this.props.title || ''} {this.props.version || ''}
                <span className="text-brand pull-right">
                    by {this.props.author || ''} &copy; {this.props.date || ''}
                </span>
            </div>
        </div>;
    }
}

export default InlineDataWrapper(
    LoginDialog,
    'authenticate'
);
