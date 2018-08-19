import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

const CharacterEditorActions = Reflux.createActions({
    "editCharacter": {asyncResult: true},
    "addChange": {},
    "removeChange": {},
    "addAbilityScoreIncrease": {},
    "removeAbilityScoreIncrease": {},
});

CharacterEditorActions.editCharacter.listen((id=null) => {
    const action = CharacterEditorActions.editCharacter;
    if (id === null) {
        action.completed({});
        return;
    }

    fetch('/character/api/' + id, {
        credentials: 'same-origin',
        method: 'GET',
        'headers': {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(result => action.completed(result))
    .catch(error => {
        console.log(error);
        action.failed(id, error);
    });
});

export default CharacterEditorActions;
