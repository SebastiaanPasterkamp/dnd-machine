import React from 'react';
import Reflux from 'reflux';
import {
    filter,
} from 'lodash/fp';

const CharacterEditorActions = Reflux.createActions({
    "getCharacterConfig": {asyncResult: true},
    "editCharacter": {asyncResult: true},
    "resetCharacter": {asyncResult: true},
    "postCharacter": {asyncResult: true},
    "patchCharacter": {asyncResult: true},
    "addChoice": {},
    "removeChoice": {},
});

CharacterEditorActions.getCharacterConfig.listen(
    (config, id) => fetch('/' + filter(null, [ 'character', config, 'api', id ]).join('/'), {
        credentials: 'same-origin',
        method: 'GET',
        'headers': {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        CharacterEditorActions.getCharacterConfig.completed(config, result);
    })
    .catch(error => {
        console.log(error);
        CharacterEditorActions.getCharacterConfig.failed(config, error);
    })
);

function getCharacter(action, id, callback=null) {
    if (id === null) {
        action.completed({});
        if (callback) callback();
        return;
    }

    fetch(`/character/api/${ id }`, {
        credentials: 'same-origin',
        method: 'GET',
        'headers': {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        action.completed(result);
        if (callback) callback();
    })
    .catch(error => {
        console.log(error);
        action.failed(id, error);
    });
};

CharacterEditorActions.editCharacter.listen(
    (id=null, callback=null) => getCharacter(
        CharacterEditorActions.editCharacter,
        id,
        callback,
    )
);

CharacterEditorActions.resetCharacter.listen(
    (id=null, callback=null) => getCharacter(
        CharacterEditorActions.resetCharacter,
        id,
        callback,
    )
);

const saveCharacter = (
    action, method, data, id=null, callback=null
) => {
    const path = '/' + filter(null, [ 'character', 'api', id ]).join('/');

    fetch(path, {
        credentials: 'same-origin',
        method,
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((result) => {
        action.completed(result.id, result, callback);
    })
    .catch((error) => {
        action.failed(id, error);
    });
};

CharacterEditorActions.postCharacter.listen(
    (data, id=null, callback=null) => saveCharacter(
        CharacterEditorActions.postCharacter,
        'POST',
        data,
        id,
        callback,
    )
);

CharacterEditorActions.patchCharacter.listen(
    (data, id=null, callback=null) => saveCharacter(
        CharacterEditorActions.patchCharacter,
        'PATCH',
        data,
        id,
        callback,
    )
);

export default CharacterEditorActions;
