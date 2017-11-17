import React from 'react';
import Reflux from 'reflux';

var dataObjectActions = Reflux.createActions({
    "getObject": {asyncResult: true},
    "postObject": {asyncResult: true},
    "patchObject": {asyncResult: true},
    "deleteObject": {asyncResult: true},
});

dataObjectActions.getObject.listen((type, id, path=null) => {
    path = (path || '/' + type + '/api') + '/' + id;
    fetch(path, {
        credentials: 'same-origin',
        method: 'GET',
        'headers': {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then((response) => response.json())
    .then((result) => {
        dataObjectActions.getObject.completed(type, id, result);
    })
    .catch((error) => {
        console.error(error);
        dataObjectActions.getObject.failed(type, id, error);
    });
});

dataObjectActions.postObject.listen((type, data, path=null) => {
    path = path || '/' + type + '/api';
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
        dataObjectActions.postObject.completed(type, result.id, result);
    })
    .catch((error) => {
        console.error(error);
        dataObjectActions.postObject.failed(type, error);
    });
});

dataObjectActions.patchObject.listen((type, id, data, path=null) => {
    path = (path || '/' + type + '/api') + '/' + id;
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
        dataObjectActions.patchObject.completed(type, id, result);
    })
    .catch((error) => {
        console.error(error);
        dataObjectActions.patchObject.failed(type, id, error);
    });
});

dataObjectActions.deleteObject.listen((type, id, path=null) => {
    path = (path || '/' + type + '/api') + '/' + id;
    fetch(path, {
        credentials: 'same-origin',
        method: 'DELETE',
        'headers': {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then((response) => response.json())
    .then((result) => {
        dataObjectActions.deleteObject.completed(type, id, result);
    })
    .catch((error) => {
        console.error(error);
        dataObjectActions.deleteObject.failed(type, id, error);
    });
});

export default dataObjectActions;