import React from 'react';
import Reflux from 'reflux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    clone,
    countBy,
    forEach,
    get,
    isEqual,
    lastIndexOf,
    keys,
    map,
    range,
    reduce,
    sortBy,
    sum,
    times,
} from 'lodash/fp';

import './sass/_stats-block.scss';

import ListDataWrapper from '../../hocs/ListDataWrapper';

import Bonus from '../Bonus';
import SingleSelect from '../SingleSelect';

import Footer from './components/Footer';
import Header from './components/Header';
import Row from './components/Row';

export class StatsBlock extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            improvement: [],
        };
        this.onBareChange = this.onBareChange.bind(this);
        this.onIncreaseChange = this.onIncreaseChange.bind(this);
    }

    hasBonus() {
        const { bonus, increase } = this.props;
        if (increase > 0) {
            return true;
        }
        const total = reduce(
            (total, bonuses) => (total + sum(bonuses)),
            0
        )(bonus);
        return total > 0;
    }

    hasFinal() {
        const { increase } = this.props;
        if (increase) {
            return true;
        }
        return this.hasBonus();
    }

    sendUpdate(update) {
        const {
            bare, bonus, base, modifiers,
            statistics, setState
        } = this.props;

        if (!statistics.length) {
            return;
        }

        let props = {
            bare,
            bonus,
            base: {...base},
            modifiers: {...modifiers},
            ...update,
        };

        forEach(
            stat => {
                stat = stat.id;
                props.bare[stat] = get(['bare', stat], props) || 8;
                props.base[stat] = props.bare[stat]
                    + sum(get(['bonus', stat], props));

                props.modifiers[stat] = Math.floor(
                    (props.base[stat] - 10) / 2
                );
            }
        )(statistics);

        if (!(
            isEqual(props.bare, bare)
            && isEqual(props.bonus, bonus)
            && isEqual(props.modifiers, modifiers)
        )) {
            setState(props);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { bare, bonus, base, modifiers } = nextProps;
        this.sendUpdate({ bare, bonus, base, modifiers });
    }

    onBareChange(stat, value) {
        const { bare: oldBare, manualChange, minBare, maxBare } = this.props;
        if (value < minBare) {
            return;
        }
        if (value > maxBare) {
            return;
        }
        if (!this.withinBudget(stat, value)) {
            return;
        }
        const bare = {
            ...oldBare,
            [stat]: value,
        };
        if (manualChange) {
            manualChange({ bare });
        }
        this.sendUpdate({ bare });
    }

    onIncreaseChange(index, stat) {
        const { improvement: stateImprovement } = this.state
        const {
            bonus: oldBonus = {},
            bonusChange,
            manualChange,
            improvement: oldImprovement = stateImprovement,
        } = this.props;
        let bonus = {...oldBonus};

        let improvement = [...oldImprovement];
        improvement[index] = stat;

        const oldCount = countBy(i => i)(oldImprovement);
        const newCount = countBy(i => i)(improvement);

        forEach(
            stat => {
                if (oldCount[stat] === newCount[stat]) {
                    return;
                }
                bonus[stat] = bonus[stat] || [];
                const idx = lastIndexOf(oldCount[stat], bonus[stat]);
                if (idx < 0) {
                    return;
                }
                bonus[stat] = [
                    ...bonus[stat].slice(0, idx),
                    ...bonus[stat].slice(idx + 1),
                ];
            }
        )(keys(oldCount));
        forEach(
            stat => {
                if (oldCount[stat] === newCount[stat]) {
                    return;
                }
                bonus[stat] = [...(bonus[stat] || []), newCount[stat]];
            }
        )(keys(newCount));

        this.setState(
            {
                improvement,
            },
            () => {
                this.sendUpdate({
                    bonus,
                    improvement,
                });

                if (manualChange) {
                    manualChange({ improvement });
                }

                if (bonusChange) {
                    bonusChange(newCount);
                }
            }
        );
    }

    getCost(value) {
        return (value - 8) + Math.max(0, value - 13);
    }

    getSpent() {
        const { statistics, bare } = this.props;
        return reduce(
            (result, {id: stat}) => (
                result + this.getCost(bare[stat] || 8)
            ),
            0
        )(statistics);
    }

    withinBudget(stat, value) {
        const { budget, bare } = this.props;
        if (!budget) {
            return true;
        }
        const spent = this.getSpent()
            - this.getCost(bare[stat] || 8)
            + this.getCost(value);
        return (
            (budget - spent) >= 0
        );
    }

    render() {
        const { improvement: stateImprovement } = this.state
        const { improvement = stateImprovement } = this.props;
        const {
            statistics, increase, budget, editBase, minBare, maxBare,
            base, bare, bonus, modifiers,
        } = this.props;

        if (!statistics) {
            return null;
        }

        return (
            <table className="nice-table stats-block condensed bordered">
                <Header
                    showBonus={this.hasBonus()}
                    showFinal={this.hasFinal()}
                    increase={increase}
                />
                <tbody>
                    {map(
                        stat => (
                            <Row
                                key={stat.id}
                                {...stat}
                                minBare={minBare}
                                maxBare={maxBare}
                                bare={bare[stat.id] || 8}
                                base={base[stat.id]}
                                bonus={bonus[stat.id]}
                                modifier={modifiers[stat.id]}
                                increase={increase}
                                improvement={improvement}
                                showBonus={this.hasBonus()}
                                showFinal={this.hasFinal()}
                                editBase={editBase}
                                onBareChange={this.onBareChange}
                                onIncreaseChange={this.onIncreaseChange}
                            />
                        )
                    )(sortBy(item => item.prio)(statistics))}
                </tbody>
                <Footer
                    budget={budget}
                    spent={this.getSpent()}
                    showBonus={this.hasBonus()}
                    showFinal={this.hasFinal()}
                    increase={increase}
                />
            </table>
        );
    }
}

StatsBlock.propTypes = {
    bare: PropTypes.objectOf(PropTypes.number).isRequired,
    bonus: PropTypes.objectOf(
        PropTypes.arrayOf(PropTypes.number)
    ).isRequired,
    base: PropTypes.objectOf(PropTypes.number).isRequired,
    modifiers: PropTypes.objectOf(PropTypes.number).isRequired,
    improvement: PropTypes.arrayOf(PropTypes.string),

    bonusChange: PropTypes.func,
    manualChange: PropTypes.func,
    setState: PropTypes.func,

    minBare: PropTypes.number,
    maxBare: PropTypes.number,
    budget: PropTypes.number,
    editBase: PropTypes.bool,
    increase: PropTypes.number,
};

StatsBlock.defaultProps = {
    minBare: 8,
    maxBare: 30,
    budget: 0,
    editBase: true,
    increase: 0,
    bare: {},
    bonus: {},
    base: {},
    modifiers: {},
    improvement: undefined,
    statistics: [],
    setState: (selected) => {
        console.log(['StatsBlock', selected]);
    }
};

export default ListDataWrapper(
    StatsBlock,
    ['statistics'],
    'items'
);
