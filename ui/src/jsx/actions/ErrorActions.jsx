import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

var ErrorActions = Reflux.createActions({
    "reportError": {children: ['completed', 'failed']},
    "showMessage": {children: ['completed', 'failed']},
});

ErrorActions.reportError.listen((error, info) => {
    fetch('/error', {
        credentials: 'same-origin',
        method: 'POST',
        'headers': {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    })
    .then(() => {
        this.reportError.completed();
    })
    .catch((error) => {
        console.error(error);
        this.reportError.failed();
    });
});

ErrorActions.showMessage.listen((type, message, timeout=0) => {
});

export default ErrorActions;
