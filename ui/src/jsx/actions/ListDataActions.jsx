import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

var ListDataActions = Reflux.createActions({
    "setState": {},
    "doLogin": {children: ['completed', 'failed']},
    "doLogout": {children: ['completed', 'failed']},
    "fetchItems": {children: ['completed', 'failed']},
});
let throttledGet = {};

ListDataActions.fetchItems.listen((type, category=null) => {
    let path = '/' + _.filter([
        category, type, category ? 'api' : null]).join('/');

    if (!(path in throttledGet)) {
        throttledGet[path] = _.throttle((path, type) => {

            fetch(path, {
                credentials: 'same-origin',
                'headers': {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then((response) => response.json())
            .then((response) => {
                if (response && 'error' in response) {
                    ListDataActions.fetchItems.failed(response.error);
                    return false;
                }
                let update = [];
                update[type] = response;
                ListDataActions.fetchItems.completed(update);
            })
            .catch((error) => {
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
    .then((response) => response.json())
    .then((response) => {
        if (response && 'error' in response) {
            ListDataActions.doLogin.failed(response.error);
            return false;
        }
        ListDataActions.fetchItems.completed({'current_user': response});
        if (success) {
            success(response);
        }
    })
    .catch((error) => {
        console.log(error);
        ListDataActions.doLogin.failed(error);
        if (failure) {
            failure(error);
        }
    });
});

ListDataActions.doLogout.listen(() => {
    fetch('/logout', {
        credentials: 'same-origin',
        'headers': {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then((response) => response.json())
    .then((response) => {
        if (response && 'error' in response) {
            ListDataActions.doLogout.failed(response.error);
            return false;
        }
        ListDataActions.fetchItems.completed({'current_user': response});
    })
    .catch((error) => {
        console.log(error);
        ListDataActions.doLogout.failed(error);
    });
});

export default ListDataActions;
