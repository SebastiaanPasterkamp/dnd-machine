import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ReportingActions from './ReportingActions.jsx';
import LoadingActions from '../actions/LoadingActions.jsx';

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
let throttledGet = {};

ListDataActions.fetchItems.listen((type, category=null) => {
    let path = '/' + _.filter([
        category, type, category ? 'api' : null
    ]).join('/');

    if (!(path in throttledGet)) {
        throttledGet[path] = _.throttle((path, type) => {
            LoadingActions.start(type);

            fetch(path, {
                credentials: 'same-origin',
                'headers': {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(jsonOrBust)
            .then((response) => {
                LoadingActions.finish(type);
                ListDataActions.fetchItems.completed({
                    [type]: response
                }, type);
            })
            .catch((error) => {
                LoadingActions.finish(type);
                console.log(error);
                ListDataActions.fetchItems.failed(type, error);
            });
        }, 1000, {leading: true, trailing: false});
    }

    throttledGet[path](path, type);
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
});

export default ListDataActions;
