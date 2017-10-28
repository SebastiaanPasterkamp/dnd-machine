import React from 'react';
import Reflux from 'reflux';

var listDataActions = Reflux.createActions({
    "setState": {},
    "fetchLanguages": {children: ['completed', 'failed']},
    "fetchWeapons": {children: ['completed', 'failed']}
});

listDataActions.fetchLanguages.listen( function() {
    fetch('/items/languages', {
        credentials: 'same-origin',
        'headers': {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then((response) => response.json())
    .then((languages) => {
        this.completed({languages: languages});
    })
    .catch((error) => {
        console.error(error);
        this.failed(error);
    });
});

listDataActions.fetchWeapons.listen( function() {
    fetch('/items/weapons', {
        credentials: 'same-origin',
        'headers': {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then((response) => response.json())
    .then((weapons) => {
        this.completed({weapons: weapons});
    })
    .catch((error) => {
        console.error(error);
        this.failed(error);
    });
});

export default listDataActions;