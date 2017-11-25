import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

var listDataActions = Reflux.createActions({
    "setState": {},
    "fetchItems": {children: ['completed', 'failed']}
});

let debouncedGet = {};
listDataActions.fetchItems.listen((type, category=null) => {
    let path = '/' + _.filter([category, type]).join('/');

    if (!(path in debouncedGet)) {
        debouncedGet[path] = _.debounce((path, type) => {

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
                listDataActions.fetchItems.completed(update);
            })
            .catch((error) => {
                console.error(error);
                listDataActions.fetchItems.failed(type, error);
            });
        }, 1000, {leading: true, trailing: false});
    }

    debouncedGet[path](path, type);
});

export default listDataActions;