import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import ReportingActions, { jsonOrBust } from './ReportingActions.jsx';

export function ObjectDataActionsFactory(id)
{

    let oda = Reflux.createActions({
        "listObjects": {asyncResult: true},
        "getObject": {asyncResult: true},
        "postObject": {asyncResult: true},
        "patchObject": {asyncResult: true},
        "copyObject": {asyncResult: true},
        "deleteObject": {asyncResult: true},
        "recomputeObject": {asyncResult: true},
    });
    oda.throttledGet = {};

    oda.listObjects.listen((type, group=null, callback=null) => {
        let path = '/' + _.filter([group, type, 'api']).join('/')

        if (!(path in oda.throttledGet)) {
            oda.throttledGet[path] = {
                running: false,
                call: _.throttle((path, type, callback) => {
                    oda.throttledGet[path].running = true;

                    fetch(path, {
                        credentials: 'same-origin',
                        method: 'GET',
                        'headers': {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    })
                    .then(jsonOrBust)
                    .then(result => oda.listObjects.completed(
                        type, result, callback
                    ))
                    .catch(error => {
                        console.log(error);
                        oda.listObjects.failed(
                            type, error
                        );
                        ReportingActions.showMessage(
                            'bad',
                            error.message,
                            'Fetch list'
                        );
                    }).finally(() => {
                        oda.throttledGet[path].running = false;
                    });

                }, 1000, {leading: true, trailing: false})
            };
        }

        oda.throttledGet[path].call(path, type, callback);
    });

    oda.getObject.listen((type, id, group=null, callback=null) => {
        let path = '/' + _.filter(
                [group, type, 'api', id],
                p => (p !== null)
            ).join('/'),
            list = '/' + _.filter(
                [group, type, 'api'],
                p => (p !== null)
            ).join('/')

        if (
            list in oda.throttledGet
            && oda.throttledGet[list].running
        ) {
            return;
        }

        if (!(path in oda.throttledGet)) {
            oda.throttledGet[path] = _.throttle((path, type, id, callback) => {

                fetch(path, {
                    credentials: 'same-origin',
                    method: 'GET',
                    'headers': {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(jsonOrBust)
                .then(result => oda.getObject.completed(
                    type, id, result, callback
                ))
                .catch(error => {
                    console.log(error);
                    oda.getObject.failed(
                        type, id, error
                    );
                    ReportingActions.showMessage(
                        'bad',
                        error.message,
                        'Fetch object'
                    );
                });

            }, 1000, {leading: true, trailing: false});
        }

        oda.throttledGet[path](path, type, id, callback);
    });

    oda.postObject.listen((type, data, group=null, callback=null) => {
        let path = '/' + _.filter([group, type, 'api']).join('/')

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
        .then(result => oda.postObject.completed(
            type, result.id, result, callback
        ))
        .catch(error => {
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
        let path = '/' + _.filter([group, type, 'api', id]).join('/')

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
        .then(result => oda.patchObject.completed(
            type, id, result, callback
        ))
        .catch(error => {
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
        let path = '/' + _.filter([group, type, 'copy', id]).join('/')

        fetch(path, {
            credentials: 'same-origin',
            method: 'GET',
            'headers': {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(jsonOrBust)
        .then(result => oda.copyObject.completed(
            type, id, result, callback
        ))
        .catch(error => {
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

    oda.deleteObject.listen((type, id, group=null, callback=null) => {
        let path = '/' + _.filter([group, type, 'api', id]).join('/')

        if (!confirm("Are you sure?")) {
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
        .then(result => oda.deleteObject.completed(
            type, id, result, callback
        ))
        .catch(error => {
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
        let path = '/' + _.filter([group, type, 'recompute', id]).join('/')

        if (!(path in oda.throttledGet)) {
            oda.throttledGet[path] = {
                running: false,
                call: _.throttle((path, type, data, callback) => {
                    oda.throttledGet[path].running = true;

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
                    .then(result => oda.recomputeObject.completed(
                        type, id, result, callback
                    ))
                    .catch(error => {
                        console.log(error);
                        oda.recomputeObject.failed(
                            type, error
                        );
                        ReportingActions.showMessage(
                            'bad',
                            error.message,
                            'Refresh failed'
                        );
                    }).finally(() => {
                        oda.throttledGet[path].running = false;
                    });
                }, 1000, {leading: true, trailing: true})
            };
        }

        oda.throttledGet[path].call(path, type, data, callback);
    });

    oda.id = id;

    return oda;
}

export default ObjectDataActionsFactory('default');
