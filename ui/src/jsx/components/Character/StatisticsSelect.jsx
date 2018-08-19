import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import actions from '../../actions/CharacterEditorActions.jsx';
import store from '../../stores/CharacterEditorStore.jsx';

import StatsBlock from '../StatsBlock.jsx';

class StatisticsSelect extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.store = store;
        this.storeKeys = ['character', 'abilityScoreIncrease'];
        this._id = _.uniqueId();
    }

    componentWillUnmount() {
        const {
            character,
        } = this.state;
        const {
            statistics = {},
        } = character;

        actions.removeChange(`${ this._id }-bare`);
        actions.removeChange(`${ this._id }-base`);
        actions.removeChange(`${ this._id }-modifiers`);

        _.forEach(
            statistics.bare,
            (stat) => actions.removeChange(
                `${ this._id }-bonus-${ stat }`
            )
        );
    }

    onStatisticsChange = (statistics) => {
        const {
            bare, base, bonus, modifiers,
        } = statistics;

        actions.addChange(
            'statistics.bare',
            bare,
            `${ this._id }-bare`,
            { type: 'dict' },
        );
        actions.addChange(
            'statistics.base',
            base,
            `${ this._id }-base`,
            { type: 'dict' },
        );
        actions.addChange(
            'statistics.modifiers',
            modifiers,
            `${ this._id }-modifiers`,
            { type: 'dict' },
        );
    }

    onBonusChange = (bonus) => {
        const {
            character,
        } = this.state;
        const {
            statistics = {},
        } = character;

        console.log({
            statistics,
            bonus,
        });

        _.forEach(
            statistics.modifiers,
            (mod, stat) => {
                actions.addChange(
                    `statistics.bonus.${ stat }`,
                    {
                        added: [_.get(bonus, stat, 0)],
                        removed: [],
                    },
                    `${ this._id }-bonus-${ stat }`,
                    { type: 'list' },
                );
            }
        );
    }

    render() {
        const {
            onChange, getCurrent, current,
            ...props
        } = this.props;
        const {
            character,
            abilityScoreIncrease,
        } = this.state;
        const {
            statistics = {},
        } = character;

        return (
            <StatsBlock
                { ...props }
                { ...statistics }
                increase={ abilityScoreIncrease }
                setState={ this.onStatisticsChange }
                bonusChange={ this.onBonusChange }
                />
        );
    }
};

export default StatisticsSelect;
