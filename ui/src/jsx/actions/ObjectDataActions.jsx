import React from 'react';
import Reflux from 'reflux';
import {
    debounce,
    filter,
} from 'lodash/fp';

import { memoize } from '../utils';

import ReportingActions, { jsonOrBust } from './ReportingActions.jsx';

export function ObjectDataActionsFactory(id)
{
    const oda = Reflux.createActions({
        "listObjects": {children: ['completed', 'failed']},
        "getObject": {children: ['completed', 'failed']},
        "postObject": {asyncResult: true},
        "patchObject": {asyncResult: true},
        "consumeObject": {asyncResult: true},
        "copyObject": {asyncResult: true},
        "deleteObject": {asyncResult: true},
        "recomputeObject": {asyncResult: true},
    });

    oda.memoize = memoize.bind(oda);

    oda.debounce = function(path, func) {
        return this.memoize(path, debounce(1000, func));
    };

    oda.postObject.listen((type, data, group=null, callback=null) => {
        const path = '/' + filter(
            p => (p !== null && p !== undefined),
            [ group, type, 'api' ]
        ).join('/');

        fetch(path, {
            credentials: 'same-origin',
            method: 'POST',
            'headers': {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(jsonOrBust)
        .then((result) => {
            oda.postObject.completed(
                type, result.id, result, callback
            );
            ReportingActions.getMessages();
        })
        .catch((error) => {
            console.log(error);
            oda.postObject.failed(
                type, error
            );
            ReportingActions.showMessage(
                'bad',
                error.message,
                'Creation failed'
            );
            ReportingActions.getMessages();
        });
    });

    oda.patchObject.listen((type, id, data, group=null, callback=null) => {
        const path = '/' + filter(
            p => (p !== null && p !== undefined),
            [ group, type, 'api', id ]
        ).join('/');

        fetch(path, {
            credentials: 'same-origin',
            method: 'PATCH',
            'headers': {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(jsonOrBust)
        .then((result) => {
            oda.patchObject.completed(
                type, id, result, callback
            );
            ReportingActions.getMessages();
        })
        .catch((error) => {
            console.log(error);
            oda.patchObject.failed(
                type, id, error
            );
            ReportingActions.showMessage(
                'bad',
                error.message,
                'Update failed'
            );
            ReportingActions.getMessages();
        });
    });

    oda.copyObject.listen((type, id, group=null, callback=null) => {
        const path = '/' + filter(
            p => (p !== null && p !== undefined),
            [ group, type, 'copy', id ]
        ).join('/');

        fetch(path, {
            credentials: 'same-origin',
            method: 'GET',
            'headers': {
                'Accept': 'application/json'
            }
        })
        .then(jsonOrBust)
        .then((result) => {
            oda.copyObject.completed(
                type, id, result, callback
            );
            ReportingActions.getMessages();
        })
        .catch((error) => {
            console.log(error);
            oda.copyObject.failed(
                type, id, error
            );
            ReportingActions.showMessage(
                'bad',
                error.message,
                'Copy failed'
            );
            ReportingActions.getMessages();
        });
    });

    oda.consumeObject.listen((type, id, group=null, callback=null) => {
        const path = '/' + filter(
            p => (p !== null && p !== undefined),
            [ group, type, 'consume', id ]
        ).join('/');

        if (!confirm("Are you sure you wish to consume this?")) {
            return false;
        }

        fetch(path, {
            credentials: 'same-origin',
            method: 'PATCH',
            'headers': {
                'Accept': 'application/json'
            }
        })
        .then(jsonOrBust)
        .then((result) => {
            oda.consumeObject.completed(
                type, id, result, callback
            );
            ReportingActions.getMessages();
        })
        .catch((error) => {
            console.log(error);
            oda.consumeObject.failed(
                type, id, error
            );
            ReportingActions.showMessage(
                'bad',
                error.message,
                'Consume failed'
            );
            ReportingActions.getMessages();
        });
    });

    oda.deleteObject.listen((type, id, group=null, callback=null) => {
        const path = '/' + filter(
            p => (p !== null && p !== undefined),
            [ group, type, 'api', id ]
        ).join('/');

        if (!confirm("Are you sure you wish to delete this?")) {
            return false;
        }

        fetch(path, {
            credentials: 'same-origin',
            method: 'DELETE',
            'headers': {
                'Accept': 'application/json'
            }
        })
        .then(jsonOrBust)
        .then((result) => {
            oda.deleteObject.completed(
                type, id, result, callback
            );
            ReportingActions.getMessages();
        })
        .catch((error) => {
            console.log(error);
            oda.deleteObject.failed(
                type, id, error
            );
            ReportingActions.showMessage(
                'bad',
                error.message,
                'Delete failed'
            );
            ReportingActions.getMessages();
        });
    });

    oda.recomputeObject.listen((type, id, data, group=null, callback=null) => {
        const path = '/' + filter(
            p => (p !== null && p !== undefined),
            [ group, type, 'recompute', id ]
        ).join('/');

        const delayedRecompute = oda.debounce(path, (path, type, id, data, group, callback) => {
            fetch(path, {
                credentials: 'same-origin',
                method: 'POST',
                'headers': {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(jsonOrBust)
            .then((result) => {
                oda.recomputeObject.completed(
                    type, id, result, callback
                );
                ReportingActions.getMessages();
            })
            .catch((error) => {
                console.log(error);
                oda.recomputeObject.failed(
                    type, error
                );
                ReportingActions.showMessage(
                    'bad',
                    error.message,
                    'Refresh failed'
                );
                ReportingActions.getMessages();
            })
        });

        delayedRecompute(path, type, id, data, group, callback);
    });

    oda.id = id;

    return oda;
}

export default ObjectDataActionsFactory('default');
