import React from 'react';
import Reflux from 'reflux';
import {
    clone,
    concat,
    debounce,
    fromPairs,
    find,
    get,
    includes,
    isEqual,
    map,
    reduce,
    setWith,
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
            original: {
              level: 1,
              proficiency: 2,
            },
            character: {},
            configs: [],
            choices: {},
        };
        this.listenables = CharacterEditorActions;
        // this.computeChange = debounce(500, this.computeChange.bind(this));
    }

    reset() {
        this.setState({
            original: {},
            character: {},
            configs: [],
            choices: {},
        });
    }

    previewChange(uuid, path, choice) {
        if (!path) {
            return;
        }

        const {
            original,
            character: old,
        } = this.state;

        const { record, changes } = this.collectChanges(path);
        if (!changes.length) {
            return;
        }

        const character = ComputeChange(
            changes,
            setWith(clone, path, get(path, original), oldCharacter)
        );
        character.choices = {...character.choices, ...record };

        this.setState({ character });
    }

    collectChanges(path) {
        const { configs, choices } = this.state;
        const changes = reduce(
            (changes, field) => {
                const { [field]: change } = this.state;
                return concat(changes, change);
            },
            []
        )(configs);
        return CollectChanges(changes, choices, path);
    }

    computeChange() {
        const {
            original,
        } = this.state;

        const { record, changes } = this.collectChanges();
        const character = ComputeChange(changes, original);
        character.choices = {...character.choices, ...record };

        this.setState({
            character,
            ...this.computeConfigs(character),
        });
    }

    computeConfigs(character) {
        const { permanent: previous, configs } = this.state;
        const update = ComputeConfig(character.permanent || [], character, previous);
        const updates = {
            permanent: isEqual(update, previous) ? previous : update,
        };
        return reduce(
            (updates, field) => {
                const {
                    [field]: previous,
                    [`orig.${field}`]: config,
                } = this.state;
                const update = ComputeConfig(config, character, previous);
                if (!isEqual(update, previous)) {
                    updates[field] = update;
                }
                return updates;
            },
            updates,
        )(configs);
    };

    onAddChoice(uuid, path, choice) {
        const { choices } = this.state;
        this.setState({
            choices: { ...choices, [uuid]: choice }
        });
        // this.previewChange(uuid, path, choice);
        this.computeChange();
    }

    onRemoveChoice(uuid, path) {
        const { choices } = this.state;
        this.setState({
            choices: { ...choices, [uuid]: undefined }
        });
        // this.previewChange(uuid, path, undefined);
        this.computeChange();
    }

    onGetCharacterConfigCompleted(field, value) {
        const { configs } = this.state;
        this.setState({
            [field]: value,
            [`orig.${field}`]: value,
            configs: [...configs, field],
        });
    }

    onEditCharacterCompleted(original) {
        const { configs } = this.state;
        const config = get('level_up.config', original) || [];
        this.setState({
            original,
            character: {},
            config,
            'orig.config': config,
            configs: [...configs, 'config'],
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
        this.reset();
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
