import React from 'react';
import Reflux from 'reflux';
import {
    filter,
} from 'lodash/fp';

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

    oda.postObject.listen((type, data, group=null, callback=null) => {
        const path = '/' + filter(null, [
            group, type, 'api'
        ]).join('/');

        fetch(path, {
            credentials: 'same-origin',
            method: 'POST',
            'headers': {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(jsonOrBust)
        .then((result) => {
            oda.postObject.completed(
                type, result.id, result, callback
            );
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
        });
    });

    oda.patchObject.listen((type, id, data, group=null, callback=null) => {
        const path = '/' + filter(null, [
            group, type, 'api', id
        ]).join('/');

        fetch(path, {
            credentials: 'same-origin',
            method: 'PATCH',
            'headers': {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(jsonOrBust)
        .then((result) => {
            oda.patchObject.completed(
                type, id, result, callback
            );
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
        });
    });

    oda.copyObject.listen((type, id, group=null, callback=null) => {
        const path = '/' + filter(null, [
            group, type, 'copy', id
        ]).join('/');

        fetch(path, {
            credentials: 'same-origin',
            method: 'GET',
            'headers': {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(jsonOrBust)
        .then((result) => {
            oda.copyObject.completed(
                type, id, result, callback
            );
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
        });
    });

    oda.consumeObject.listen((type, id, group=null, callback=null) => {
        const path = '/' + filter(null, [
            group, type, 'consume', id
        ]).join('/');

        if (!confirm("Are you sure you wish to consume this?")) {
            return false;
        }

        fetch(path, {
            credentials: 'same-origin',
            method: 'PATCH',
            'headers': {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(jsonOrBust)
        .then((result) => {
            oda.consumeObject.completed(
                type, id, result, callback
            );
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
        });
    });

    oda.deleteObject.listen((type, id, group=null, callback=null) => {
        const path = '/' + filter(null, [
            group, type, 'api', id
        ]).join('/');

        if (!confirm("Are you sure you wish to delete this?")) {
            return false;
        }

        fetch(path, {
            credentials: 'same-origin',
            method: 'DELETE',
            'headers': {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(jsonOrBust)
        .then((result) => {
            oda.deleteObject.completed(
                type, id, result, callback
            );
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
        });
    });

    oda.recomputeObject.listen((type, id, data, group=null, callback=null) => {
        const path = '/' + filter(null, [
            group, type, 'recompute', id
        ]).join('/');

        fetch(path, {
            credentials: 'same-origin',
            method: 'POST',
            'headers': {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(jsonOrBust)
        .then((result) => {
            oda.recomputeObject.completed(
                type, id, result, callback
            );
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
        });
    });

    oda.id = id;

    return oda;
}

export default ObjectDataActionsFactory('default');
