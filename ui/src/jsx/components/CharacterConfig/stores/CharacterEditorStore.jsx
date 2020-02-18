import React from 'react';
import Reflux from 'reflux';
import {
    debounce,
    fromPairs,
    find,
    get,
    includes,
    map,
    reduce,
    set,
} from 'lodash/fp';

import CharacterEditorActions from '../actions/CharacterEditorActions';
import {
    CollectChanges,
    ComputeChange,
    ComputeConfig,
} from '../utils';

class CharacterEditorStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            original: {},
            character: {},
            config: [],
            choices: {},
        };
        this.listenables = CharacterEditorActions;
        this.computeChange = debounce(500, this.computeChange.bind(this));
    }

    reset() {
        this.setState({
            original: {},
            character: {},
            config: [],
            choices: {},
        });
    }

    previewChange(uuid, path, choice) {
        const {
            original,
            character: oldCharacter,
            config,
            choices,
        } = this.state;

        const { record, changes } = CollectChanges(config, choices, path);
        if (!changes.length) {
            return;
        }

        const character = ComputeChange(
            changes,
            set(path, get(path, original), oldCharacter)
        );
        character.choices = {...character.choices, ...record };

        this.setState({ character });
    }

    computeChange() {
        const {
            original,
            character: old,
            choices,
            config,
        } = this.state;

        const { record, changes } = CollectChanges(config, choices);
        const character = ComputeChange(changes, original);
        character.choices = {...character.choices, ...record };

        this.setState({
            character,
            config: ComputeConfig(config, character),
        });
    }

    onAddChoice(uuid, path, choice) {
        const { choices } = this.state;
        this.setState({
            choices: { ...choices, [uuid]: choice }
        });
        this.previewChange(uuid, path, choice);
        this.computeChange();
    }

    onRemoveChoice(uuid, path) {
        const { choices } = this.state;
        this.setState({
            choices: { ...choices, [uuid]: undefined }
        });
        this.previewChange(uuid, path, undefined);
        this.computeChange();
    }

    onEditCharacterCompleted(original) {
        this.setState({
            original,
            character: {},
            config: ComputeConfig(
                get('level_up.config', original) || [],
                original,
            ),
        });
        this.computeChange();
    }

    onResetCharacterCompleted(original) {
        const {
            user_id, xp, level, xp_progress, xp_level,
            name, personality, gender, appearance,
            alignment, backstory, age, weight, height,
        } = original;

        this.setState({
            original: {
                user_id, xp, level, xp_progress, xp_level,
                name, personality, gender, appearance,
                alignment, backstory, age, weight, height,
            },
            character: {},
            choices: {},
        });
        this.computeChange();
    }

    onSaveCharacterCompleted(id, original, callback) {
        this.setState({
            original,
            character: original,
            choices: {},
            config: [],
        });
        if (callback) {
            callback(id, original);
        }
    }

    onPostCharacterCompleted(id, original, callback) {
        this.onSaveCharacterCompleted(id, original, callback);
    }

    onPatchCharacterCompleted(id, original, callback) {
        this.onSaveCharacterCompleted(id, original, callback);
    }
}

export default Reflux.initStore(CharacterEditorStore);
