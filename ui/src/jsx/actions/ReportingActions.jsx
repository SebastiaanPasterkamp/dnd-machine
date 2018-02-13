import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

var ReportingActions = Reflux.createActions({
    "reportError": {children: ['completed', 'failed']},
    "showMessage": {children: ['completed', 'failed']},
    "hideMessage": {children: ['completed', 'failed']},
});

ReportingActions.reportError.listen((error, info) => {
    fetch('/error', {
        credentials: 'same-origin',
        method: 'POST',
        'headers': {
            'X-Requested-With': 'XMLHttpRequest',
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

export default ReportingActions;
