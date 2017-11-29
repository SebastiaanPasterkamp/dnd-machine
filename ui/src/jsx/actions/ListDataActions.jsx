import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

var ListDataActions = Reflux.createActions({
    "setState": {},
    "fetchItems": {children: ['completed', 'failed']}
});
let throttledGet = {};

ListDataActions.fetchItems.listen((type, category=null) => {
    let path = '/' + _.filter([category, type]).join('/');

    if (!(path in throttledGet)) {
        throttledGet[path] = _.throttle((path, type) => {

            fetch(path, {
                credentials: 'same-origin',
                'headers': {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then((response) => response.json())
            .then((data) => {
                let update = [];
                update[type] = data;
                ListDataActions.fetchItems.completed(update);
            })
            .catch((error) => {
                console.error(error);
                ListDataActions.fetchItems.failed(type, error);
            });
        }, 1000, {leading: true, trailing: false});
    }

    throttledGet[path](path, type);
});

export default ListDataActions;