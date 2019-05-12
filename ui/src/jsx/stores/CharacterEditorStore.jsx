import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import CharacterEditorActions from '../actions/CharacterEditorActions.jsx';
import {
    ComputeChange,
    ComputeConfig,
} from '../components/Character/ComputeChange.jsx';

class CharacterEditorStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            original: {},
            character: {},
            config: {},
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
        const state = _.assign(
            {
                original: {},
                character: {},
                config: {},
            },
            _.fromPairs(
                _.map(rest, (value, key) => [key, undefined])
            ),
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

        const preview = _.reduce(
            {
                ...changes,
                [id]: change,
            },
            (preview, previewChange, previewId) => {
                if (
                    previewChange
                    && previewChange.path === path
                ) {
                    preview[previewId] = previewChange;
                }
                return preview;
            },
            {}
        );

        const character = ComputeChange(
            preview,
            _.set(old, path, _.get(original, path))
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
            config: ComputeConfig(oldConfig || config, character),
        });
    }

    delayedComputeChange = _.debounce(
        this.computeChange,
        50
    );

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
        this.delayedComputeChange();
    }
}

export default Reflux.initStore(CharacterEditorStore);
