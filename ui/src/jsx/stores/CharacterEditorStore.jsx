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

        this.computeChange = _.throttle(
            this._computeChange.bind(this),
            500,
            {
                leading: true,
                trailing: true,
            }
        );
    }

    _computeChange() {
        const {
            original,
            abilityScoreIncrease,
            character: old,
            ...changes,
        } = this.state;

        const character = ComputeChange(changes, original);

        this.setState({
            character,
        });
    }

    onEditCharacterCompleted(original) {
        this.setState({
            original,
            abilityScoreIncrease: 0,
            character: original,
        });
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
        this.computeChange();
    }

    onRemoveChange(id) {
        this.setState(
            {
                [id]: undefined,
            }
        );
        this.computeChange();
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
