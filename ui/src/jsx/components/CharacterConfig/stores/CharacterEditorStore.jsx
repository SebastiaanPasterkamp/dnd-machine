import React from 'react';
import Reflux from 'reflux';
import {
    assign,
    fromPairs,
    get,
    map,
    reduce,
    set,
} from 'lodash/fp';

import CharacterEditorActions from '../actions/CharacterEditorActions.jsx';
import {
    ComputeChange,
    ComputeConfig,
} from '../utils/ComputeChange.jsx';

class CharacterEditorStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            original: {},
            character: {},
            config: [],
        };
        this.listenables = CharacterEditorActions;
    }

    reset() {
        const {
            original,
            character,
            config,
            ...rest
        } = this.state;
        const state = assign(
            fromPairs(
                map((value, key) => [key, undefined])(rest)
            ),
            {
                original: {},
                character: {},
                config: [],
            }
        );
        this.setState(state);
    }

    previewChange(id, path, change) {
        const {
            original,
            character: old,
            config: oldConfig,
            ...changes,
        } = this.state;
        const {
            level_up: {
                config = [],
            } = {},
        } = original;

        const preview = reduce(
            (preview, previewChange, previewId) => {
                if (
                    previewChange
                    && previewChange.path === path
                ) {
                    preview[previewId] = previewChange;
                }
                return preview;
            }
        )({
            ...changes,
            [id]: change,
        });

        const character = ComputeChange(
            preview,
            set(path, get(path, original), old)
        );

        this.setState({
            character,
            config: ComputeConfig(config, character),
            [id]: change,
        });
    }

    computeChange = () => {
        const {
            original,
            character: old,
            config: oldConfig,
            ...changes,
        } = this.state;
        const {
            level_up: {
                config = [],
            } = {},
        } = original;

        const character = ComputeChange(changes, original);

        this.setState({
            character,
            config: ComputeConfig(config, character),
        });
    }

    onEditCharacterCompleted(original) {
        this.setState({
            original,
            character: {},
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
        });
        this.computeChange();
    }

    onSaveCharacterCompleted(id, original, callback) {
        this.setState({
            original,
            character: original,
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

    onAddChange(path, value, id, option) {
        const {
            original,
            character: start,
        } = this.state;
        const change = {
            path,
            value,
            option,
        };

        this.previewChange(id, path, change);
        this.computeChange();
    }

    onRemoveChange(id) {
        const { [id]: change } = this.state;
        if (change === undefined) {
            return;
        }
        this.previewChange(id, change.path, undefined);
        this.computeChange();
    }
}

export default Reflux.initStore(CharacterEditorStore);
