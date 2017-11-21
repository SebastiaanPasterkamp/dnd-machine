import React from 'react';
import Reflux from 'reflux';

var listDataActions = Reflux.createActions({
    "setState": {},
    "fetchItems": {children: ['completed', 'failed']}
});

listDataActions.fetchItems.listen( function(type, category='items') {
    fetch('/' + _.filter([category, type]).join('/'), {
        credentials: 'same-origin',
        'headers': {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then((response) => response.json())
    .then((data) => {
        let update = [];
        update[type] = data;
        this.completed(update);
    })
    .catch((error) => {
        console.error(error);
        this.failed(type, error);
    });
});

export default listDataActions;