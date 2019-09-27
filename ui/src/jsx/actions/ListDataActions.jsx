import React from 'react';
import Reflux from 'reflux';
import {
    filter,
} from 'lodash/fp';

import ReportingActions from './ReportingActions.jsx';

function jsonOrBust(response) {
    if (response.ok) {
        return response.json();
    }
    throw response.statusText;
};

var ListDataActions = Reflux.createActions({
    "setState": {},
    "doLogin": {children: ['completed', 'failed']},
    "doLogout": {children: ['completed', 'failed']},
    "fetchItems": {children: ['completed', 'failed']},
});

ListDataActions.doLogin.listen((credentials, success, failure) => {
    fetch('/login', {
        credentials: 'same-origin',
        method: 'POST',
        'headers': {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    })
    .then(jsonOrBust)
    .then((response) => {
        ListDataActions.doLogin.completed(response);
        ListDataActions.fetchItems.completed({
            current_user: response
        });

        ReportingActions.showMessage(
            'good',
            'Login successful',
            'Login',
            5
        );

        if (success) {
            success(response);
        }

        ReportingActions.getMessages();
    })
    .catch((error) => {
        console.log(error);

        ReportingActions.showMessage(
            'bad',
            'Login failed',
            'Login',
            10
        );

        ListDataActions.doLogin.failed(error);

        if (failure) {
            failure();
        }

        ReportingActions.getMessages();
    });
});

ListDataActions.doLogout.listen((callback) => {
    fetch('/logout', {
        credentials: 'same-origin',
        'headers': {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(jsonOrBust)
    .then((response) => {
        ListDataActions.doLogout.completed(response);
        ListDataActions.setState({
            current_user: null,
            navigation: null,
        });

        ReportingActions.showMessage(
            'good',
            'Logout successful',
            'Logout',
            5
        );

        if (callback) {
            callback();
        }
    })
    .catch((error) => {
        console.log(error);
        ListDataActions.doLogout.failed(error);
        ListDataActions.fetchItems.completed({
            current_user: null
        });

        ReportingActions.showMessage(
            'bad',
            'Logout failed',
            'Logout',
            10
        );

        if (callback) {
            callback();
        }
    });

    ReportingActions.getMessages();
});

export default ListDataActions;
