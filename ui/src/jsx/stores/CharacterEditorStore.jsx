import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

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
            ...rest
        } = this.state;
        const state = _.assign(
            {
                original: {},
                abilityScoreIncrease: 0,
                character: {},
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
            ...changes,
        } = this.state;

        const character = ComputeChange(
            changes,
            original,
            original,
        );

        this.setState({
            character,
        });
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
