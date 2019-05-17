import React from 'react';
import Reflux from 'reflux';
import {
    forEach,
    isEqual,
    uniqueId,
} from 'lodash/fp';

import actions from '../actions/CharacterEditorActions.jsx';
import ListDataWrapper from '../../../hocs/ListDataWrapper.jsx';
import store from '../stores/CharacterEditorStore.jsx';

import StatsBlock from '../../StatsBlock.jsx';

class StatisticsSelect extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.store = store;
        this.storeKeys = ['character'];
        this._id = uniqueId();
    }

    componentWillUnmount() {
        super.componentWillUnmount.call(this);
        const { statistics } = this.props;

        actions.removeChange(`${ this._id }-bare`);
        actions.removeChange(`${ this._id }-base`);
        actions.removeChange(`${ this._id }-modifiers`);

        forEach(({ code }) => actions.removeChange(
            `${ this._id }-bonus-${ code }`
        ))(statistics);
    }

    onStatisticsChange = ({ bare, base, modifiers }) => {
        const {
            character: {
                statistics = {},
            },
        } = this.state;

        if (!isEqual(bare, statistics.bare)) {
            actions.addChange(
                'statistics.bare',
                bare,
                `${ this._id }-bare`,
                { type: 'dict' },
            );
        }
        if (!isEqual(base, statistics.base)) {
            actions.addChange(
                'statistics.base',
                base,
                `${ this._id }-base`,
                { type: 'dict' },
            );
        }
        if (!isEqual(modifiers, statistics.modifiers)) {
            actions.addChange(
                'statistics.modifiers',
                modifiers,
                `${ this._id }-modifiers`,
                { type: 'dict' },
            );
        }
    }

    onBonusChange = (bonus) => {
        const { statistics } = this.props;

        forEach(({ code }) => {
            if(code in bonus) {
                actions.addChange(
                    `statistics.bonus.${code}`,
                    {
                        removed: [],
                        added: bonus[code],
                    },
                    `${ this._id }-bonus-${ code }`,
                    {
                        type: 'list',
                        multiple: true,
                    },
                );
            } else {
                actions.removeChange(
                    `${ this._id }-bonus-${ code }`
                );
            }
        })(statistics);
    }

    render() {
        const {
            onChange, getCurrent, current, limit,
            ...props
        } = this.props;
        const {
            character: {
                statistics = {},
            }
        } = this.state;

        return (
            <StatsBlock
                editBase={false}
                {...props}
                {...statistics}
                increase={ limit }
                setState={ this.onStatisticsChange }
                bonusChange={ this.onBonusChange }
            />
        );
    }
};

StatisticsSelect.defaultProps = {
    statistics: [],
};

export default ListDataWrapper(
    StatisticsSelect,
    ['statistics'],
    'items'
);
