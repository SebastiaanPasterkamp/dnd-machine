import React from 'react';
import Reflux from 'reflux';
import {
    debounce,
} from 'lodash';

const ReportingActions = Reflux.createActions({
    "reportError": {children: ['completed', 'failed']},
    "getMessages": {children: ['completed', 'failed']},
    "showMessage": {children: ['completed', 'failed']},
    "hideMessage": {children: ['completed', 'failed']},
});

const messageTypes = {
    message: 'info',
    success: 'good',
    warning: 'warning',
    error: 'bad',
};

ReportingActions.getMessages.listen(debounce(() => {
    fetch('/messages', {
        credentials: 'same-origin',
        method: 'GET',
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
    .then(jsonOrBust)
    .then((messages) => messages.map(([type, message]) => ReportingActions.showMessage(
        messageTypes[type],
        message,
    )))
    .catch((error) => {
        console.error(error);
        ReportingActions.reportError.failed();
    });
}, 1000));

ReportingActions.reportError.listen((error, info) => {
    fetch('/error', {
        credentials: 'same-origin',
        method: 'POST',
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({error, info})
    })
    .then(() => {
        ReportingActions.reportError.completed();
    })
    .catch((error) => {
        console.error(error);
        ReportingActions.reportError.failed();
    });
});

export function jsonOrBust(response) {
    return new Promise((resolve, reject) => {
        response.json()
            .then((response.ok || response.redirected)
                ? resolve
                : reject
            )
            .catch(reject)
        }
    );
};

export default ReportingActions;
