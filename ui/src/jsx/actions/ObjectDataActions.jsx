import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

export function makeObjectDataActions() {
    let ObjectDataActions = Reflux.createActions({
        "listObjects": {asyncResult: true},
        "getObject": {asyncResult: true},
        "postObject": {asyncResult: true},
        "patchObject": {asyncResult: true},
        "deleteObject": {asyncResult: true},
        "recomputeObject": {asyncResult: true},
    });
    ObjectDataActions.throttledGet = {};

    ObjectDataActions.listObjects.listen((type, group=null) => {
        let path = '/' + _.filter([group, type, 'api']).join('/')

        if (!(path in ObjectDataActions.throttledGet)) {
            ObjectDataActions.throttledGet[path] = {
                running: false,
                call: _.throttle((path, type) => {
                    ObjectDataActions.throttledGet[path].running = true;

                    fetch(path, {
                        credentials: 'same-origin',
                        method: 'GET',
                        'headers': {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    })
                    .then((response) => response.json())
                    .then((result) => {
                        ObjectDataActions.throttledGet[path].running = false;
                        ObjectDataActions.listObjects.completed(type, result);
                    })
                    .catch((error) => {
                        ObjectDataActions.throttledGet[path].running = false;
                        console.log(error);
                        ObjectDataActions.listObjects.failed(type, error);
                    });

                }, 1000, {leading: true, trailing: false})
            };
        }

        ObjectDataActions.throttledGet[path].call(path, type);
    });

    ObjectDataActions.getObject.listen((type, id, group=null) => {
        let path = '/' + _.filter([group, type, 'api', id]).join('/'),
            list = '/' + _.filter([group, type, 'api']).join('/')

        if (
            list in ObjectDataActions.throttledGet
            && ObjectDataActions.throttledGet[list].running
        ) {
            return;
        }

        if (!(path in ObjectDataActions.throttledGet)) {
            ObjectDataActions.throttledGet[path] = _.throttle((path, type, id) => {

                fetch(path, {
                    credentials: 'same-origin',
                    method: 'GET',
                    'headers': {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then((response) => response.json())
                .then((result) => {
                    ObjectDataActions.getObject.completed(type, id, result);
                })
                .catch((error) => {
                    console.log(error);
                    ObjectDataActions.getObject.failed(type, id, error);
                });

            }, 1000, {leading: true, trailing: false});
        }

        ObjectDataActions.throttledGet[path](path, type, id);
    });

    ObjectDataActions.postObject.listen((type, data, group=null, callback=null) => {
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
        .then((response) => response.json())
        .then((result) => {
            ObjectDataActions.postObject.completed(type, result.id, result);
            if (callback) {
                (callback)();
            }
        })
        .catch((error) => {
            console.log(error);
            ObjectDataActions.postObject.failed(type, error);
        });
    });

    ObjectDataActions.patchObject.listen((type, id, data, group=null, callback=null) => {
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
        .then((response) => response.json())
        .then((result) => {
            ObjectDataActions.patchObject.completed(type, id, result);
            if (callback) {
                (callback)();
            }
        })
        .catch((error) => {
            console.log(error);
            ObjectDataActions.patchObject.failed(type, id, error);
        });
    });

    ObjectDataActions.deleteObject.listen((type, id, group=null, callback=null) => {
        let path = '/' + _.filter([group, type, 'api', id]).join('/')

        fetch(path, {
            credentials: 'same-origin',
            method: 'DELETE',
            'headers': {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then((response) => response.json())
        .then((result) => {
            ObjectDataActions.deleteObject.completed(type, id, result);
            if (callback) {
                (callback)();
            }
        })
        .catch((error) => {
            console.log(error);
            ObjectDataActions.deleteObject.failed(type, id, error);
        });
    });

    ObjectDataActions.recomputeObject.listen((type, id, data, group=null, callback=null) => {
        let path = '/' + _.filter([group, type, 'recompute', id]).join('/')

        if (!(path in ObjectDataActions.throttledGet)) {
            ObjectDataActions.throttledGet[path] = {
                running: false,
                call: _.throttle((path, type, data) => {
                    ObjectDataActions.throttledGet[path].running = true;

                    fetch(path, {
                        credentials: 'same-origin',
                        method: 'POST',
                        'headers': {
                            'X-Requested-With': 'XMLHttpRequest',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    })
                    .then((response) => response.json())
                    .then((result) => {
                        ObjectDataActions.postObject.completed(
                            type, id, result);
                        if (callback) {
                            (callback)();
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        ObjectDataActions.postObject.failed(type, error);
                    });
                }, 1000, {leading: true, trailing: true})
            };
        }

        ObjectDataActions.throttledGet[path].call(path, type, data);
    });

    return ObjectDataActions;
}

export default makeObjectDataActions();
