import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

let ObjectDataActions = Reflux.createActions({
    "listObjects": {asyncResult: true},
    "getObject": {asyncResult: true},
    "postObject": {asyncResult: true},
    "patchObject": {asyncResult: true},
    "deleteObject": {asyncResult: true},
});
let throttledGet = {};

ObjectDataActions.listObjects.listen((type, group=null) => {
    let path = '/' + _.filter([group, type, 'list']).join('/')

    if (!(path in throttledGet)) {
        throttledGet[path] = {
            running: false,
            call: _.throttle((path, type) => {
                throttledGet[path].running = true;

                fetch(path, {
                    credentials: 'same-origin',
                    method: 'GET',
                    'headers': {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then((response) => response.json())
                .then((result) => {
                    throttledGet[path].running = false;
                    ObjectDataActions.listObjects.completed(type, result);
                })
                .catch((error) => {
                    throttledGet[path].running = false;
                    console.error(error);
                    ObjectDataActions.listObjects.failed(type, error);
                });

            }, 1000, {leading: true, trailing: false})
        };
    }

    throttledGet[path].call(path, type);
});

ObjectDataActions.getObject.listen((type, id, group=null) => {
    let path = '/' + _.filter([group, type, 'api', id]).join('/'),
        list = '/' + _.filter([group, type, 'list']).join('/')

    if (
        list in throttledGet
        && throttledGet[list].running
    ) {
        return;
    }

    if (!(path in throttledGet)) {
        throttledGet[path] = _.throttle((path, type, id) => {

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
                console.error(error);
                ObjectDataActions.getObject.failed(type, id, error);
            });

        }, 1000, {leading: true, trailing: false});
    }

    throttledGet[path](path, type, id);
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
        ObjectDataActions.deleteObject.failed(type, id, error);
    });
});

export default ObjectDataActions;
