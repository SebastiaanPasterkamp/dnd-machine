import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
import utils from '../utils.jsx';

import CharacterEditorActions from '../actions/CharacterEditorActions.jsx';
import ComputeChange from '../components/Character/ComputeChange.jsx';

class CharacterEditorStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            original: {},
            abilityScoreIncrease: 0,
            character: {},
            config: {},
        };
        this.listenables = CharacterEditorActions;

        this.delayedComputeChange = _.debounce(
            this.computeChange,
            50,
        );
    }

    reset() {
        const {
            original,
            abilityScoreIncrease,
            character,
            config,
            ...rest
        } = this.state;
        const state = _.assign(
            {
                original: {},
                abilityScoreIncrease: 0,
                character: {},
                config: {},
            },
            _.fromPairs(
                _.map(rest, (value, key) => [key, undefined])
            ),
        );
        this.setState(state);
    }

    computeChange = () => {
        const {
            original,
            abilityScoreIncrease,
            character: old,
            config: oldConfig,
            ...changes,
        } = this.state;
        const {
            level_up: {
                config = [],
                creation,
            } = {},
        } = original;

        const character = ComputeChange(
            changes,
            original,
            original,
        );

        this.setState({
            character,
            config: this.computeConfig(
                config,
                character,
            ),
        });
    }

    computeConfig(config, character) {
        if (_.isPlainObject(config)) {
            let changed = false;
            const newConfig = _.reduce(
                config,
                (newConfig, value, key) => {
                    newConfig[key] = value;
                    if (key.match(/_formula$/)) {
                        const root = _.replace(key, /_formula$/, '');
                        try {
                            const newValue = utils.resolveMath(
                                character,
                                value,
                                'character'
                            );
                            if (newValue != value) {
                                changed = true;
                                newConfig[root] = newValue;
                            }
                        } catch(error) {
                            if (config[root + '_default'] != value) {
                                changed = true;
                                newConfig[root] = config[root + '_default'];
                            }
                        }
                    } else {
                        const newValue = this.computeConfig(
                            value,
                            character,
                        );
                        if (newValue != value) {
                            changed = true;
                            newConfig[key] = newValue;
                        }
                    }
                    return newConfig;
                },
                {}
            );
            if (changed) {
                return newConfig;
            }
        } else if (_.isObject(config)) {
            let changed = false;
            const newConfig = _.map(
                config,
                value => {
                    const newValue = this.computeConfig(
                        value,
                        character,
                    );
                    if (newValue != value) {
                        changed = true;
                        return newValue;
                    }
                    return value;
                }
            );
            if (changed) {
                return newConfig;
            }
        }

        return config;
    }

    onEditCharacterCompleted(original) {
        this.setState({
            original,
            abilityScoreIncrease: 0,
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
            abilityScoreIncrease: 0,
            character: {},
        });
        this.computeChange();
    }

    onSaveCharacterCompleted(id, original, callback) {
        this.setState({
            original,
            abilityScoreIncrease: 0,
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
        this.setState({
            character: ComputeChange({[id]: change}, original, start),
            [id]: change,
        });
        this.delayedComputeChange();
    }

    onRemoveChange(id) {
        this.setState({
            [id]: undefined,
        });
        this.delayedComputeChange();
    }

    onAddAbilityScoreIncrease(increase) {
        const { abilityScoreIncrease } = this.state;

        this.setState({
            abilityScoreIncrease: abilityScoreIncrease + increase,
        });
    }

    onRemoveAbilityScoreIncrease(increase) {
        const { abilityScoreIncrease } = this.state;

        this.setState({
            abilityScoreIncrease: Math.max(0, abilityScoreIncrease - increase),
        });
    }
}

export default Reflux.initStore(CharacterEditorStore);
