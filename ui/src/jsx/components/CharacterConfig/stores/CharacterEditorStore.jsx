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

import CharacterEditorActions from '../actions/CharacterEditorActions';
import {
    ComputeChange,
    ComputeConfig,
} from '../utils/ComputeChange';

class CharacterEditorStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            original: {},
            character: {},
            config: [],
            changes: {},
        };
        this.listenables = CharacterEditorActions;
    }

    reset() {
        this.setState({
            original: {},
            character: {},
            config: [],
            changes: {},
        });
    }

    previewChange(uuid, path, change) {
        const {
            original,
            character: old,
            config: oldConfig,
            changes: oldChanges,
        } = this.state;
        const {
            level_up: {
                config = [],
            } = {},
        } = original;

        const changes = {
            ...oldChanges,
            [uuid]: change,
        };
        const preview = reduce(
            (preview, previewChange) => {
                if (
                    previewChange
                    && previewChange.path === path
                ) {
                    preview.push(previewChange);
                }
                return preview;
            },
            []
        )(changes);

        const character = ComputeChange(
            preview,
            set(path, get(path, original), old)
        );

        this.setState({
            character,
            config: ComputeConfig(config, character),
            changes,
        });
    }

    computeChange() {
        const {
            original,
            character: old,
            config: oldConfig,
            changes,
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
            changes,
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

    onAddChange(uuid, path, value, option) {
        const change = {
            path,
            value,
            option,
        };

        this.previewChange(uuid, path, change);
        this.computeChange();
    }

    onRemoveChange(uuid) {
        const {
            changes: {
                [uuid]: change,
            },
        } = this.state;
        if (change === undefined) {
            return;
        }
        this.previewChange(uuid, change.path, undefined);
        this.computeChange();
        this.recordChoice(uuid, undefined, undefined);
    }

    onAddChoice(uuid, choice) {
        this.recordChoice(uuid, choice);
    }

    onRemoveChoice(uuid) {
        this.recordChoice(uuid, undefined);
    }

    recordChoice(uuid, choice) {
        const { character } = this.state;

        this.setState({
            character: {
                ...character,
                choices: {
                    ...character.choices,
                    [uuid]: choice,
                }
            }
        });
    }
}

export default Reflux.initStore(CharacterEditorStore);
